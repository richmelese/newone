import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Edit3, ImageIcon, Loader2, MapPin, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminEditModal, { adminFieldClass, adminTextAreaClass } from '@/components/admin/AdminEditModal';
import { AdminButton, Panel, StatusPill } from '@/components/admin/AdminUi';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Spinner from '@/components/ui/Spinner';
import { citiesApi, resolveApiAssetUrl, type City, type CreateCityPayload, type UpdateCityPayload } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { useLanguage } from '@/lib/language';

const PAGE_SIZE = 6;
type CityForm = Omit<CreateCityPayload, 'hero_image'> & { hero_image: File | null };

const EMPTY_FORM: CityForm = {
  name_en: '',
  name_am: '',
  description_en: '',
  description_am: '',
  region: '',
  hero_image: null,
  is_iconic: false,
};

export default function AdminDestinationsPage() {
  const { token } = useAuth();
  const { show } = useToast();
  const { language } = useLanguage();
  const [items, setItems] = useState<City[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [form, setForm] = useState<CityForm>(EMPTY_FORM);
  const [heroPreview, setHeroPreview] = useState('');

  useEffect(() => {
    if (!form.hero_image) {
      setHeroPreview(resolveApiAssetUrl(editingCity?.hero_image) || '');
      return;
    }

    const objectUrl = URL.createObjectURL(form.hero_image);
    setHeroPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.hero_image, editingCity?.hero_image]);

  const loadCities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await citiesApi.list(token || undefined));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load cities.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadCities();
  }, [loadCities]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;
    return items.filter((city) =>
      `${city.name_en} ${city.name_am} ${city.description_en} ${city.description_am}`
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

  function updateField<K extends keyof CityForm>(field: K, value: CityForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openCreateModal() {
    setForm(EMPTY_FORM);
    setEditingCity(null);
    setShowCreate(true);
  }

  function openEditModal(city: City) {
    setForm({
      name_en: city.name_en,
      name_am: city.name_am,
      description_en: city.description_en,
      description_am: city.description_am,
      region: city.region || '',
      hero_image: null,
      is_iconic: city.is_iconic,
    });
    setEditingCity(city);
    setShowCreate(true);
  }

  async function saveCity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const textPayload = {
        name_en: form.name_en.trim(),
        name_am: form.name_am.trim(),
        description_en: form.description_en.trim(),
        description_am: form.description_am.trim(),
        region: form.region.trim(),
        is_iconic: form.is_iconic,
      };
      const editingId = editingCity?.id ?? editingCity?._id;
      if (editingId === undefined && !form.hero_image) {
        show('Please select a hero image.', 'error');
        return;
      }
      const city = editingId === undefined
        ? await citiesApi.create({ ...textPayload, hero_image: form.hero_image as File }, token || undefined)
        : await citiesApi.update(
          editingId,
          { ...textPayload, ...(form.hero_image ? { hero_image: form.hero_image } : {}) } as UpdateCityPayload,
          token || undefined,
        );
      setItems((current) => editingId === undefined
        ? [city, ...current]
        : current.map((item) => (item.id ?? item._id) === editingId
          ? { ...item, ...city, id: city.id ?? item.id, _id: city._id ?? item._id }
          : item));
      setShowCreate(false);
      setEditingCity(null);
      setForm(EMPTY_FORM);
      show(`${language === 'am' ? city.name_am : city.name_en} was ${editingId === undefined ? 'created' : 'updated'} successfully.`, 'success');
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : `Unable to ${editingCity ? 'update' : 'create'} the city.`, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteCity(city: City) {
    const cityId = city.id ?? city._id;
    if (cityId === undefined) {
      show('This city cannot be deleted because it has no ID.', 'error');
      return;
    }
    const localizedName = language === 'am' ? city.name_am : city.name_en;
    if (!window.confirm(`Delete ${localizedName}? This action cannot be undone.`)) return;

    setDeletingId(cityId);
    try {
      await citiesApi.delete(cityId, token || undefined);
      setItems((current) => current.filter((item) => (item.id ?? item._id) !== cityId));
      show(`${localizedName} was deleted successfully.`, 'success');
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : 'Unable to delete the city.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminLayout
      title="Cities & destinations"
      description="Create and manage the cities travelers discover across the public website."
      eyebrow="Content library"
      actions={<AdminButton onClick={openCreateModal}><Plus size={16} /> Create city</AdminButton>}
    >
      <Panel>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="relative w-full sm:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cities..." className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white" />
          </div>
          <p className="text-xs font-semibold text-ink-400">Showing {filtered.length} of {items.length} cities</p>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center"><Spinner /></div>
        ) : error ? (
          <div className="p-5"><ErrorState title="Could not load cities" subtitle={error} retryLabel="Try again" onRetry={() => void loadCities()} /></div>
        ) : paginated.length === 0 ? (
          <div className="p-5"><EmptyState title={query ? 'No cities match your search' : 'No cities yet'} subtitle={query ? 'Try a different city name or description.' : 'Create your first city or destination to get started.'} icon={MapPin} action={!query ? <AdminButton onClick={openCreateModal}><Plus size={16} /> Create city</AdminButton> : undefined} /></div>
        ) : (
          <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {paginated.map((city, index) => {
              const cityId = city.id ?? city._id;
              const localizedName = language === 'am' ? city.name_am : city.name_en;
              const localizedDescription = language === 'am' ? city.description_am : city.description_en;
              const heroImage = resolveApiAssetUrl(city.hero_image);
              return (
              <article key={cityId ?? `${city.name_en}-${index}`} className="group overflow-hidden rounded-card-lg border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-lift">
                <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                  {heroImage ? (
                    <img src={heroImage} alt={localizedName} onError={(event) => { event.currentTarget.style.display = 'none'; }} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-300"><ImageIcon size={36} /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/75 via-transparent to-transparent" />
                  {city.is_iconic && <div className="absolute left-3 top-3"><StatusPill tone="amber"><span className="flex items-center gap-1"><Sparkles size={11} /> Iconic</span></StatusPill></div>}
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h2 lang={language} className="font-heading text-xl font-extrabold">{localizedName}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <p lang={language} className="line-clamp-2 min-h-10 text-sm leading-relaxed text-ink-500">{localizedDescription}</p>
                  {cityId !== undefined && (
                    <div className="mt-4 flex gap-2 border-t border-neutral-100 pt-4">
                      <button type="button" onClick={() => openEditModal(city)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-800 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-primary-700"><Edit3 size={14} /> Edit</button>
                      <button type="button" onClick={() => void deleteCity(city)} disabled={deletingId === cityId} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-danger-500/25 px-3 py-2.5 text-xs font-bold text-danger-500 transition hover:bg-danger-500 hover:text-white disabled:cursor-wait disabled:opacity-60">
                        {deletingId === cityId ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
              );
            })}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />}
      </Panel>

      {showCreate && (
        <AdminEditModal title={editingCity ? 'Edit city or destination' : 'Create city or destination'} description="Add the English and Amharic content shown to travelers." onClose={() => { if (!submitting) { setShowCreate(false); setEditingCity(null); } }} onSubmit={saveCity} submitLabel={editingCity ? 'Save changes' : 'Create city'} submitting={submitting} submittingLabel={editingCity ? 'Saving…' : 'Creating…'}>
          <label className="text-sm font-bold text-ink-600">English name<input required value={form.name_en} onChange={(event) => updateField('name_en', event.target.value)} placeholder="Addis Ababa" className={adminFieldClass} /></label>
          <label className="text-sm font-bold text-ink-600">Amharic name<input required lang="am" value={form.name_am} onChange={(event) => updateField('name_am', event.target.value)} placeholder="አዲስ አበባ" className={adminFieldClass} /></label>
          <label className="text-sm font-bold text-ink-600 sm:col-span-2">English description<textarea required rows={3} value={form.description_en} onChange={(event) => updateField('description_en', event.target.value)} placeholder="Capital city of Ethiopia" className={adminTextAreaClass} /></label>
          <label className="text-sm font-bold text-ink-600 sm:col-span-2">Amharic description<textarea required lang="am" rows={3} value={form.description_am} onChange={(event) => updateField('description_am', event.target.value)} placeholder="የኢትዮጵያ ዋና ከተማ" className={adminTextAreaClass} /></label>
          <label className="text-sm font-bold text-ink-600 sm:col-span-2">Region<input required value={form.region} onChange={(event) => updateField('region', event.target.value)} placeholder="Addis Ababa" className={adminFieldClass} /></label>
          <div className="sm:col-span-2">
            <label className="text-sm font-bold text-ink-600">Hero image{editingCity ? ' (leave empty to keep the current image)' : ''}<input required={!editingCity} type="file" accept="image/*" onChange={(event) => updateField('hero_image', event.target.files?.[0] ?? null)} className={`${adminFieldClass} py-2`} /></label>
            {heroPreview && (
              <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
                <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-3 py-2">
                  <span className="text-xs font-bold text-ink-500">{form.hero_image ? 'New image preview' : 'Current hero image'}</span>
                  {form.hero_image && <span className="max-w-[60%] truncate text-xs text-ink-400">{form.hero_image.name}</span>}
                </div>
                <div className="aspect-[16/9]">
                  <img src={heroPreview} alt="Hero image preview" className="h-full w-full object-cover" />
                </div>
              </div>
            )}
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 p-4 text-sm font-bold text-ink-600 sm:col-span-2">
            <input type="checkbox" checked={form.is_iconic} onChange={(event) => updateField('is_iconic', event.target.checked)} className="h-4 w-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-300" />
            Mark this city as iconic
          </label>
        </AdminEditModal>
      )}
    </AdminLayout>
  );
}
