import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Edit3, ImageIcon, Loader2, Plus, Search, Tags, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminEditModal, { adminFieldClass, adminTextAreaClass } from '@/components/admin/AdminEditModal';
import AdminPagination from '@/components/admin/AdminPagination';
import { AdminButton, Panel, StatusPill } from '@/components/admin/AdminUi';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import { categoriesApi, citiesApi, resolveApiAssetUrl, type Category, type City } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/lib/toast';

const PAGE_SIZE = 8;

function recordId(record?: { id?: string | number; _id?: string } | null) {
  const id = record?.id ?? record?._id;
  return id === undefined ? '' : String(id);
}

function categoryCityId(category: Category) {
  if (!category.city) return '';
  return typeof category.city === 'string' ? category.city : recordId(category.city);
}

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const { language } = useLanguage();
  const { show } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [query, setQuery] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState('');

  const cityNames = useMemo(
    () => new Map(cities.map((item) => [recordId(item), language === 'am' ? item.name_am : item.name_en])),
    [cities, language],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [categoryItems, cityItems] = await Promise.all([
        categoriesApi.list(token || undefined),
        citiesApi.list(token || undefined),
      ]);
      setCategories(categoryItems);
      setCities(cityItems);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load categories.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (!heroImage) {
      setHeroPreview(resolveApiAssetUrl(editing?.hero_image) || '');
      return;
    }
    const objectUrl = URL.createObjectURL(heroImage);
    setHeroPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [editing?.hero_image, heroImage]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return categories.filter((category) => {
      const matchesCity = !filterCity || categoryCityId(category) === filterCity;
      const matchesQuery = !normalized || `${category.title} ${category.description} ${cityNames.get(categoryCityId(category)) ?? ''}`.toLowerCase().includes(normalized);
      return matchesCity && matchesQuery;
    });
  }, [categories, cityNames, filterCity, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [filterCity, query]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);

  function openCreate() {
    setEditing(null);
    setSlug('');
    setTitle('');
    setDescription('');
    setCity(filterCity);
    setHeroImage(null);
    setModalOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setSlug(category.slug ?? '');
    setTitle(category.title);
    setDescription(category.description);
    setCity(categoryCityId(category));
    setHeroImage(null);
    setModalOpen(true);
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const editingId = recordId(editing);
    if (!editingId && !heroImage) {
      show('Please select a hero image.', 'error');
      return;
    }
    setSaving(true);
    try {
      const generatedSlug = slug.trim() || title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const values = {
        slug: generatedSlug,
        title: title.trim(),
        description: description.trim(),
        city,
      };
      const saved = editingId
        ? await categoriesApi.update(editingId, { ...values, ...(heroImage ? { hero_image: heroImage } : {}) }, token || undefined)
        : await categoriesApi.create({ ...values, hero_image: heroImage as File }, token || undefined);
      setCategories((current) => editingId
        ? current.map((category) => recordId(category) === editingId ? { ...category, ...saved } : category)
        : [saved, ...current]);
      setModalOpen(false);
      setEditing(null);
      setHeroImage(null);
      show(`${saved.title} was ${editingId ? 'updated' : 'created'} successfully.`, 'success');
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : `Unable to ${editing ? 'update' : 'create'} the category.`, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(category: Category) {
    const id = recordId(category);
    if (!id || !window.confirm(`Delete ${category.title}? This action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await categoriesApi.delete(id, token || undefined);
      setCategories((current) => current.filter((item) => recordId(item) !== id));
      show(`${category.title} was deleted successfully.`, 'success');
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : 'Unable to delete the category.', 'error');
    } finally {
      setDeletingId('');
    }
  }

  return (
    <AdminLayout
      title="Categories"
      description="Create destination categories and assign them to cities."
      eyebrow="Content library"
      actions={<AdminButton onClick={openCreate}><Plus size={16} /> Create category</AdminButton>}
    >
      <Panel>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:px-5">
          <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories..." className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white" /></div>
          <select value={filterCity} onChange={(event) => setFilterCity(event.target.value)} className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-ink-600 outline-none focus:border-primary-300">
            <option value="">All cities</option>
            {cities.map((item) => { const id = recordId(item); return id ? <option key={id} value={id}>{language === 'am' ? item.name_am : item.name_en}</option> : null; })}
          </select>
          <p className="ml-auto text-xs font-semibold text-ink-400">{filtered.length} categories</p>
        </div>

        {loading ? <div className="flex min-h-72 items-center justify-center"><Spinner /></div> : error ? <div className="p-5"><ErrorState title="Could not load categories" subtitle={error} retryLabel="Try again" onRetry={() => void load()} /></div> : paginated.length === 0 ? <div className="p-5"><EmptyState title="No categories found" subtitle="Create a category for a destination city." icon={Tags} action={<AdminButton onClick={openCreate}><Plus size={16} /> Create category</AdminButton>} /></div> : (
          <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-4">
            {paginated.map((category, index) => {
              const id = recordId(category);
              const image = resolveApiAssetUrl(category.hero_image);
              const populatedCityName = typeof category.city === 'object' && category.city
                ? language === 'am' ? category.city.name_am : category.city.name_en
                : '';
              const cityName = cityNames.get(categoryCityId(category)) || populatedCityName || 'Unknown city';
              return <article key={id || index} className="overflow-hidden rounded-card-lg border border-neutral-200 bg-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">{image ? <img src={image} alt={category.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" /> : <div className="flex h-full items-center justify-center text-ink-300"><ImageIcon size={38} /></div>}{category.status && <div className="absolute left-3 top-3"><StatusPill tone="green">{category.status}</StatusPill></div>}</div>
                <div className="p-4"><h2 className="font-heading font-extrabold text-primary-900">{category.title}</h2><p className="mt-1 text-xs font-semibold text-ink-400">{cityName}</p><p className="mt-2 line-clamp-2 text-sm text-ink-500">{category.description}</p>{id && <div className="mt-4 flex gap-2 border-t border-neutral-100 pt-4"><button type="button" onClick={() => openEdit(category)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-800 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-primary-700"><Edit3 size={14} /> Edit</button><button type="button" onClick={() => void deleteCategory(category)} disabled={deletingId === id} className="flex items-center justify-center rounded-xl border border-danger-500/25 px-3 text-danger-500 transition hover:bg-danger-500 hover:text-white disabled:cursor-wait disabled:opacity-60" aria-label={`Delete ${category.title}`}>{deletingId === id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}</button></div>}</div>
              </article>;
            })}
          </div>
        )}
        {!loading && !error && filtered.length > 0 && <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />}
      </Panel>

      {modalOpen && <AdminEditModal title={editing ? 'Edit category' : 'Create category'} description="Add a category and assign it to a destination city." onClose={() => { if (!saving) { setModalOpen(false); setEditing(null); } }} onSubmit={saveCategory} submitLabel={editing ? 'Save changes' : 'Create category'} submitting={saving} submittingLabel={editing ? 'Saving…' : 'Creating…'}>
        <label className="text-sm font-bold text-ink-600 sm:col-span-2">Slug<input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="historic-places" className={adminFieldClass} /></label>
        <label className="text-sm font-bold text-ink-600 sm:col-span-2">Title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Historic Places" className={adminFieldClass} /></label>
        <label className="text-sm font-bold text-ink-600 sm:col-span-2">Description<textarea required rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tourist spots in Addis Ababa." className={adminTextAreaClass} /></label>
        <label className="text-sm font-bold text-ink-600 sm:col-span-2">City<select required value={city} onChange={(event) => setCity(event.target.value)} className={adminFieldClass}><option value="">Select a city</option>{cities.map((item) => { const id = recordId(item); return id ? <option key={id} value={id}>{language === 'am' ? item.name_am : item.name_en}</option> : null; })}</select></label>
        <div className="sm:col-span-2"><label className="text-sm font-bold text-ink-600">Hero image{editing ? ' (leave empty to keep the current image)' : ''}<input required={!editing} type="file" accept="image/*" onChange={(event) => setHeroImage(event.target.files?.[0] ?? null)} className={`${adminFieldClass} py-2`} /></label>{heroPreview && <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"><div className="flex items-center justify-between border-b border-neutral-200 bg-white px-3 py-2"><span className="text-xs font-bold text-ink-500">{heroImage ? 'New image preview' : 'Current hero image'}</span><span className="max-w-[60%] truncate text-xs text-ink-400">{heroImage?.name}</span></div><div className="aspect-[16/9]"><img src={heroPreview} alt="Category hero preview" className="h-full w-full object-cover" /></div></div>}</div>
      </AdminEditModal>}
    </AdminLayout>
  );
}
