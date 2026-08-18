import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Edit3, Compass, Loader2, Plus, Search, Trash2, ImageIcon } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminEditModal, { adminFieldClass, adminTextAreaClass } from '@/components/admin/AdminEditModal';
import { AdminButton, Panel, StatusPill } from '@/components/admin/AdminUi';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Spinner from '@/components/ui/Spinner';
import {
  thingsToDoApi,
  activitiesApi,
  citiesApi,
  resolveApiAssetUrl,
  type ThingsToDo,
  type CreateThingsToDoPayload,
  type UpdateThingsToDoPayload,
  type Activity,
  type City,
} from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { useLanguage } from '@/lib/language';

const PAGE_SIZE = 6;

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

type ThingsToDoForm = Omit<CreateThingsToDoPayload, 'hero_image'> & { hero_image: File | null };

const EMPTY_FORM: ThingsToDoForm = {
  slug: '',
  name_en: '',
  name_am: '',
  description_en: '',
  description_am: '',
  hero_image: null,
  activity: '',
  city: '',
};

export default function AdminThingsToDoPage() {
  const { token } = useAuth();
  const { show } = useToast();
  const { language } = useLanguage();

  const [items, setItems] = useState<ThingsToDo[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [editingItem, setEditingItem] = useState<ThingsToDo | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const [form, setForm] = useState<ThingsToDoForm>(EMPTY_FORM);
  const [heroPreview, setHeroPreview] = useState('');

  useEffect(() => {
    if (!form.hero_image) {
      setHeroPreview(resolveApiAssetUrl(editingItem?.hero_image) || '');
      return;
    }
    const objectUrl = URL.createObjectURL(form.hero_image);
    setHeroPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [editingItem?.hero_image, form.hero_image]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [loadedThings, loadedActivities, loadedCities] = await Promise.all([
        thingsToDoApi.list(token || undefined),
        activitiesApi.list(token || undefined).catch(() => []),
        citiesApi.list(token || undefined).catch(() => []),
      ]);
      setItems(loadedThings);
      setActivities(loadedActivities);
      setCities(loadedCities);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load things to do.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;
    return items.filter((item) =>
      `${item.name_en} ${item.name_am} ${item.description_en} ${item.description_am} ${item.slug}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [items, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [query]);
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  function updateField<K extends keyof ThingsToDoForm>(field: K, value: ThingsToDoForm[K]) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === 'name_en' && !editingItem) {
        next.slug = slugify(String(value));
      }
      return next;
    });
  }

  function openCreateModal() {
    setForm({
      ...EMPTY_FORM,
      activity: activities[0]?._id ?? (activities[0]?.id ? String(activities[0].id) : ''),
      city: cities[0]?._id ?? (cities[0]?.id ? String(cities[0].id) : ''),
    });
    setEditingItem(null);
    setShowCreate(true);
  }

  function openEditModal(item: ThingsToDo) {
    const activityId = item.activity && typeof item.activity === 'object'
      ? String(item.activity._id ?? item.activity.id ?? '')
      : String(item.activity ?? '');

    const cityId = item.city && typeof item.city === 'object'
      ? String(item.city._id ?? item.city.id ?? '')
      : String(item.city ?? '');

    setForm({
      slug: item.slug || '',
      name_en: item.name_en || '',
      name_am: item.name_am || '',
      description_en: item.description_en || '',
      description_am: item.description_am || '',
      hero_image: null,
      activity: activityId,
      city: cityId,
    });
    setEditingItem(item);
    setShowCreate(true);
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const textPayload = {
        slug: form.slug.trim() || slugify(form.name_en),
        name_en: form.name_en.trim(),
        name_am: form.name_am.trim(),
        description_en: form.description_en.trim(),
        description_am: form.description_am.trim(),
        activity: form.activity.trim(),
        city: form.city.trim(),
      };

      const editingId = editingItem?.id ?? editingItem?._id;
      if (editingId === undefined && !form.hero_image) {
        show('Please select a hero image.', 'error');
        return;
      }
      const saved = editingId === undefined
        ? await thingsToDoApi.create({ ...textPayload, hero_image: form.hero_image as File }, token || undefined)
        : await thingsToDoApi.update(
          editingId,
          { ...textPayload, ...(form.hero_image ? { hero_image: form.hero_image } : {}) } as UpdateThingsToDoPayload,
          token || undefined,
        );

      setItems((current) =>
        editingId === undefined
          ? [saved, ...current]
          : current.map((item) => ((item.id ?? item._id) === editingId ? { ...item, ...saved } : item)),
      );

      setShowCreate(false);
      setEditingItem(null);
      setForm(EMPTY_FORM);
      const name = language === 'am' ? saved.name_am : saved.name_en;
      show(`${name} was ${editingId === undefined ? 'created' : 'updated'} successfully.`, 'success');
    } catch (caughtError) {
      show(
        caughtError instanceof Error ? caughtError.message : `Unable to ${editingItem ? 'update' : 'create'} item.`,
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteItem(item: ThingsToDo) {
    const itemId = item.id ?? item._id;
    if (itemId === undefined) {
      show('This item cannot be deleted because it has no ID.', 'error');
      return;
    }
    const name = language === 'am' ? item.name_am : item.name_en;
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;

    setDeletingId(itemId);
    try {
      await thingsToDoApi.delete(itemId, token || undefined);
      setItems((current) => current.filter((i) => (i.id ?? i._id) !== itemId));
      show(`${name} was deleted successfully.`, 'success');
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : 'Unable to delete item.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminLayout
      title="Things to Do"
      description="Create and manage activities and attractions for travelers across Ethiopia."
      eyebrow="Content management"
      actions={
        <AdminButton onClick={openCreateModal}>
          <Plus size={16} /> Create thing to do
        </AdminButton>
      }
    >
      <Panel>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="relative w-full sm:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search things to do..."
              className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white"
            />
          </div>
          <p className="text-xs font-semibold text-ink-400">
            Showing {filtered.length} of {items.length} items
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="p-5">
            <ErrorState
              title="Could not load things to do"
              subtitle={error}
              retryLabel="Try again"
              onRetry={() => void loadData()}
            />
          </div>
        ) : paginated.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title={query ? 'No items match your search' : 'No things to do yet'}
              subtitle={query ? 'Try searching for a different title or activity.' : 'Add your first activity or attraction.'}
              icon={Compass}
              action={
                !query ? (
                  <AdminButton onClick={openCreateModal}>
                    <Plus size={16} /> Create thing to do
                  </AdminButton>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {paginated.map((item, index) => {
              const itemId = item.id ?? item._id;
              const name = language === 'am' ? item.name_am : item.name_en;
              const description = language === 'am' ? item.description_am : item.description_en;
              const image = resolveApiAssetUrl(item.hero_image);

              const activityName = item.activity && typeof item.activity === 'object'
                ? (language === 'am' ? item.activity.name_am : item.activity.name_en) || ''
                : '';

              const cityName = item.city && typeof item.city === 'object'
                ? (language === 'am' ? item.city.name_am : item.city.name_en) || ''
                : '';

              return (
                <article
                  key={itemId ?? `${item.slug}-${index}`}
                  className="group overflow-hidden rounded-card-lg border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                        }}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-ink-300">
                        <ImageIcon size={36} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/75 via-transparent to-transparent" />
                    {activityName && (
                      <div className="absolute left-3 top-3">
                        <StatusPill tone="green">{activityName}</StatusPill>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <h2 lang={language} className="font-heading text-xl font-extrabold">{name}</h2>
                      {cityName && <p className="text-xs text-white/80">{cityName}</p>}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-mono text-ink-400 mb-1">/{item.slug}</p>
                    <p lang={language} className="line-clamp-2 min-h-10 text-sm leading-relaxed text-ink-500">{description}</p>
                    {itemId !== undefined && (
                      <div className="mt-4 flex gap-2 border-t border-neutral-100 pt-4">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-800 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-primary-700"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteItem(item)}
                          disabled={deletingId === itemId}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-danger-500/25 px-3 py-2.5 text-xs font-bold text-danger-500 transition hover:bg-danger-500 hover:text-white disabled:cursor-wait disabled:opacity-60"
                        >
                          {deletingId === itemId ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <AdminPagination
            page={page}
            pageCount={pageCount}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </Panel>

      {showCreate && (
        <AdminEditModal
          title={editingItem ? 'Edit Thing to Do' : 'Create Thing to Do'}
          description="Fill in the details below. Data will be sent to the /things-to-do endpoint."
          onClose={() => {
            if (!submitting) {
              setShowCreate(false);
              setEditingItem(null);
            }
          }}
          onSubmit={saveItem}
          submitLabel={editingItem ? 'Save changes' : 'Create thing to do'}
          submitting={submitting}
          submittingLabel={editingItem ? 'Saving…' : 'Creating…'}
        >
          <label className="text-sm font-bold text-ink-600">
            English Name
            <input
              required
              value={form.name_en}
              onChange={(e) => updateField('name_en', e.target.value)}
              placeholder="Mountain Hiking"
              className={adminFieldClass}
            />
          </label>

          <label className="text-sm font-bold text-ink-600">
            Amharic Name
            <input
              required
              lang="am"
              value={form.name_am}
              onChange={(e) => updateField('name_am', e.target.value)}
              placeholder="የተራራ ጉልበት"
              className={adminFieldClass}
            />
          </label>

          <label className="text-sm font-bold text-ink-600 sm:col-span-2">
            Slug
            <input
              required
              value={form.slug}
              onChange={(e) => updateField('slug', e.target.value)}
              placeholder="mountain-hiking"
              className={adminFieldClass}
            />
          </label>

          <label className="text-sm font-bold text-ink-600 sm:col-span-2">
            English Description
            <textarea
              required
              rows={3}
              value={form.description_en}
              onChange={(e) => updateField('description_en', e.target.value)}
              placeholder="A scenic hiking activity."
              className={adminTextAreaClass}
            />
          </label>

          <label className="text-sm font-bold text-ink-600 sm:col-span-2">
            Amharic Description
            <textarea
              required
              lang="am"
              rows={3}
              value={form.description_am}
              onChange={(e) => updateField('description_am', e.target.value)}
              placeholder="የተራራ ጉልበት እና ዝናብ"
              className={adminTextAreaClass}
            />
          </label>

          <div className="sm:col-span-2">
            <label className="text-sm font-bold text-ink-600">
              Hero image{editingItem ? ' (leave empty to keep the current image)' : ''}
              <input
                required={!editingItem}
                type="file"
                accept="image/*"
                onChange={(event) => updateField('hero_image', event.target.files?.[0] ?? null)}
                className={`${adminFieldClass} py-2`}
              />
            </label>
            {heroPreview && (
              <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-3 py-2">
                  <span className="text-xs font-bold text-ink-500">{form.hero_image ? 'New image preview' : 'Current hero image'}</span>
                  {form.hero_image && <span className="max-w-[60%] truncate text-xs text-ink-400">{form.hero_image.name}</span>}
                </div>
                <div className="aspect-[16/9]"><img src={heroPreview} alt="Thing to do hero preview" className="h-full w-full object-cover" /></div>
              </div>
            )}
          </div>

          <label className="text-sm font-bold text-ink-600">
            Activity ID
            {activities.length > 0 ? (
              <select
                required
                value={form.activity}
                onChange={(e) => updateField('activity', e.target.value)}
                className={adminFieldClass}
              >
                <option value="">Select activity...</option>
                {activities.map((act) => {
                  const id = act._id ?? act.id ?? '';
                  return (
                    <option key={id} value={id}>
                      {act.name_en} ({act.name_am})
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                required
                value={form.activity}
                onChange={(e) => updateField('activity', e.target.value)}
                placeholder="643c2d5af2ee0a87a9d1e5cb"
                className={adminFieldClass}
              />
            )}
          </label>

          <label className="text-sm font-bold text-ink-600">
            City ID
            {cities.length > 0 ? (
              <select
                required
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                className={adminFieldClass}
              >
                <option value="">Select city...</option>
                {cities.map((c) => {
                  const id = c._id ?? c.id ?? '';
                  return (
                    <option key={id} value={id}>
                      {c.name_en} ({c.name_am})
                    </option>
                  );
                })}
              </select>
            ) : (
              <input
                required
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="643c2d5af2ee0a87a9d1e5cb"
                className={adminFieldClass}
              />
            )}
          </label>
        </AdminEditModal>
      )}
    </AdminLayout>
  );
}
