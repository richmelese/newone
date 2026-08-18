import { useCallback, useEffect, useMemo, useState, type FormEvent, type ChangeEvent } from 'react';
import { Edit3, ImageIcon, Languages, Loader2, Plus, Search, Trash2, UploadCloud, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminEditModal, { adminFieldClass } from '@/components/admin/AdminEditModal';
import AdminPagination from '@/components/admin/AdminPagination';
import { AdminButton, Panel } from '@/components/admin/AdminUi';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import { activitiesApi, resolveApiAssetUrl, thingsToDoApi, type Activity, type CreateActivityPayload, type ThingsToDo } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

const PAGE_SIZE = 10;

function recordId(record: Activity) {
  const id = record.id ?? record._id;
  return id === undefined ? '' : String(id);
}

function activityImage(activity: Activity) {
  return resolveApiAssetUrl(activity.image || activity.hero_image || activity.image_url || activity.cover_image);
}

function thingActivityId(item: ThingsToDo) {
  if (typeof item.activity === 'string') return item.activity;
  const id = item.activity?.id ?? item.activity?._id;
  return id === undefined ? '' : String(id);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminActivitiesPage() {
  const { token } = useAuth();
  const { show } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [thingsToDo, setThingsToDo] = useState<ThingsToDo[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [loadingEditId, setLoadingEditId] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [saving, setSaving] = useState(false);

  // Form state
  const [nameEn, setNameEn] = useState('');
  const [nameAm, setNameAm] = useState('');
  const [slug, setSlug] = useState('');
  const [slugCustomized, setSlugCustomized] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [activityItems, thingsToDoItems] = await Promise.all([
        activitiesApi.list(token || undefined),
        thingsToDoApi.list(token || undefined),
      ]);
      setActivities(activityItems);
      setThingsToDo(thingsToDoItems);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load activities.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return activities;
    return activities.filter((activity) =>
      `${activity.name_en} ${activity.name_am} ${activity.slug || ''}`.toLowerCase().includes(normalized),
    );
  }, [activities, query]);

  const thingsToDoByActivity = useMemo(() => {
    const grouped = new Map<string, ThingsToDo[]>();
    thingsToDo.forEach((item) => {
      const activityId = thingActivityId(item);
      if (!activityId) return;
      grouped.set(activityId, [...(grouped.get(activityId) ?? []), item]);
    });
    return grouped;
  }, [thingsToDo]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [query]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);

  function openCreate() {
    setEditing(null);
    setNameEn('');
    setNameAm('');
    setSlug('');
    setSlugCustomized(false);
    setImageFile(null);
    setImagePreview('');
    setModalOpen(true);
  }

  async function openEdit(activity: Activity) {
    const id = recordId(activity);
    if (!id) return;
    setLoadingEditId(id);
    try {
      const current = await activitiesApi.getById(id, token || undefined);
      setEditing(current);
      setNameEn(current.name_en || '');
      setNameAm(current.name_am || '');
      setSlug(current.slug || slugify(current.name_en || ''));
      setSlugCustomized(true);
      setImageFile(null);
      setImagePreview(activityImage(current) || '');
      setModalOpen(true);
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : 'Unable to load the activity.', 'error');
    } finally {
      setLoadingEditId('');
    }
  }

  function handleNameEnChange(val: string) {
    setNameEn(val);
    if (!slugCustomized && !editing) {
      setSlug(slugify(val));
    }
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSaveActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const editingId = editing ? recordId(editing) : '';

    if (!editingId && !imageFile) {
      show('Please select an image for this activity.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload: CreateActivityPayload = {
        slug: slug.trim() || slugify(nameEn),
        name_en: nameEn.trim(),
        name_am: nameAm.trim(),
        ...(imageFile ? { image: imageFile } : {}),
      };

      const saved = editingId
        ? await activitiesApi.update(editingId, payload, token || undefined)
        : await activitiesApi.create(payload, token || undefined);

      setActivities((current) => editingId
        ? current.map((activity) => recordId(activity) === editingId ? { ...activity, ...saved } : activity)
        : [saved, ...current]);

      setModalOpen(false);
      setEditing(null);
      setImageFile(null);
      setImagePreview('');
      show(`${saved.name_en} was ${editingId ? 'updated' : 'created'} successfully.`, 'success');
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : `Unable to ${editing ? 'update' : 'create'} the activity.`, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function deleteActivity(activity: Activity) {
    const id = recordId(activity);
    if (!id || !window.confirm(`Delete “${activity.name_en}”? This action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await activitiesApi.delete(id, token || undefined);
      setActivities((current) => current.filter((item) => recordId(item) !== id));
      show(`${activity.name_en} was deleted successfully.`, 'success');
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : 'Unable to delete the activity.', 'error');
    } finally {
      setDeletingId('');
    }
  }

  return (
    <AdminLayout
      title="Activities"
      description="Create the bilingual activity types used by things to do and blog content."
      eyebrow="Content library"
      actions={<AdminButton onClick={openCreate}><Plus size={16} /> Create activity</AdminButton>}
    >
      <Panel>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:px-5">
          <div className="relative w-full sm:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search activities by name or slug..."
              className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white"
            />
          </div>
          <p className="ml-auto text-xs font-semibold text-ink-400">{filtered.length} activities</p>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center"><Spinner /></div>
        ) : error ? (
          <div className="p-5"><ErrorState title="Could not load activities" subtitle={error} retryLabel="Try again" onRetry={() => void load()} /></div>
        ) : paginated.length === 0 ? (
          <div className="p-5"><EmptyState title="No activities found" subtitle={query ? 'Try a different search.' : 'Create your first bilingual activity.'} icon={Languages} action={!query ? <AdminButton onClick={openCreate}><Plus size={16} /> Create activity</AdminButton> : undefined} /></div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {paginated.map((activity, index) => {
              const id = recordId(activity);
              const image = activityImage(activity);
              const relatedThings = id ? thingsToDoByActivity.get(id) ?? [] : [];
              return (
                <article key={id || `${activity.name_en}-${index}`} className="grid gap-4 px-5 py-4 transition hover:bg-neutral-50 sm:grid-cols-[5.5rem_1fr_1fr_minmax(8rem,1fr)_auto] sm:items-center sm:px-6">
                  <div className="h-20 w-20 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                    {image ? (
                      <img src={image} alt={activity.name_en} className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink-300" title="No activity image"><ImageIcon size={25} /></div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-300">English</p>
                    <h2 className="mt-1 font-heading font-extrabold text-primary-900">{activity.name_en}</h2>
                    {activity.slug && (
                      <p className="mt-0.5 font-mono text-[11px] text-ink-400">/{activity.slug}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-300">Amharic</p>
                    <p className="mt-1 font-bold text-ink-600" lang="am">{activity.name_am}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-300">Things to do</p>
                    {relatedThings.length > 0 ? (
                      <div className="mt-2 flex items-center">
                        {relatedThings.slice(0, 4).map((item, itemIndex) => {
                          const thingImage = resolveApiAssetUrl(item.hero_image);
                          const thingId = item.id ?? item._id ?? `${item.slug}-${itemIndex}`;
                          return thingImage ? (
                            <img
                              key={thingId}
                              src={thingImage}
                              alt={item.name_en}
                              title={item.name_en}
                              className={`h-10 w-10 rounded-lg border-2 border-white object-cover shadow-sm ${itemIndex > 0 ? '-ml-2' : ''}`}
                              onError={(event) => { event.currentTarget.style.display = 'none'; }}
                            />
                          ) : null;
                        })}
                        <span className="ml-2 text-xs font-semibold text-ink-400">{relatedThings.length} item{relatedThings.length === 1 ? '' : 's'}</span>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs font-semibold text-ink-400">No linked items</p>
                    )}
                  </div>
                  {id && (
                    <div className="flex items-center gap-2 sm:justify-end">
                      <button
                        type="button"
                        onClick={() => void openEdit(activity)}
                        disabled={loadingEditId === id || Boolean(deletingId)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 text-xs font-bold text-ink-600 transition hover:border-primary-200 hover:bg-primary-50 disabled:cursor-wait disabled:opacity-50"
                      >
                        {loadingEditId === id ? <Loader2 size={14} className="animate-spin" /> : <Edit3 size={14} />}
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteActivity(activity)}
                        disabled={deletingId === id || Boolean(loadingEditId)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-danger-500/25 text-danger-500 transition hover:bg-danger-500 hover:text-white disabled:cursor-wait disabled:opacity-50"
                        aria-label={`Delete ${activity.name_en}`}
                      >
                        {deletingId === id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
        )}
      </Panel>

      {modalOpen && (
        <AdminEditModal
          title={editing ? 'Edit activity' : 'Create activity'}
          description="Fill in the activity details, slug, and photo."
          onClose={() => { if (!saving) { setModalOpen(false); setEditing(null); } }}
          onSubmit={handleSaveActivity}
          submitLabel={editing ? 'Save changes' : 'Create activity'}
          submitting={saving}
          submittingLabel={editing ? 'Saving...' : 'Creating...'}
        >
          <label className="text-sm font-bold text-ink-600 sm:col-span-1">
            English name
            <input
              required
              value={nameEn}
              onChange={(event) => handleNameEnChange(event.target.value)}
              placeholder="Hiking & Trekking"
              className={adminFieldClass}
            />
          </label>

          <label className="text-sm font-bold text-ink-600 sm:col-span-1">
            Amharic name
            <input
              required
              lang="am"
              value={nameAm}
              onChange={(event) => setNameAm(event.target.value)}
              placeholder="የተራራ ጉዞ"
              className={adminFieldClass}
            />
          </label>

          <label className="text-sm font-bold text-ink-600 sm:col-span-2">
            Slug
            <input
              required
              value={slug}
              onChange={(event) => {
                setSlug(event.target.value);
                setSlugCustomized(true);
              }}
              placeholder="hiking-trekking"
              className={`${adminFieldClass} font-mono`}
            />
            <span className="mt-1 block text-[11px] font-normal text-ink-400">
              Unique URL identifier (e.g. hiking-trekking)
            </span>
          </label>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-bold text-ink-600">
              Activity image {!editing && <span className="text-danger-500">*</span>}
            </label>

            {imagePreview ? (
              <div className="relative mt-2 aspect-[16/9] w-full max-w-sm overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                <img src={imagePreview} alt="Activity preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-6 py-8 text-center transition hover:border-primary-300 hover:bg-primary-50/20">
                <UploadCloud size={32} className="text-ink-400" />
                <p className="mt-2 text-sm font-semibold text-ink-700">
                  Click to upload activity image
                </p>
                <p className="mt-1 text-xs text-ink-400">PNG, JPG, WEBP up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            )}
            {imagePreview && (
              <label className="mt-2 inline-block cursor-pointer text-xs font-semibold text-primary-700 hover:underline">
                Replace image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            )}
          </div>
        </AdminEditModal>
      )}
    </AdminLayout>
  );
}
