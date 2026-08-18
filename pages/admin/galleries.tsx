import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Edit3, Images, Loader2, Plus, Search, Trash2, Upload } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminEditModal, { adminFieldClass, adminTextAreaClass } from '@/components/admin/AdminEditModal';
import AdminPagination from '@/components/admin/AdminPagination';
import { AdminButton, Panel } from '@/components/admin/AdminUi';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import { citiesApi, galleriesApi, resolveApiAssetUrl, type City, type Gallery } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/lib/toast';

const PAGE_SIZE = 8;

function recordId(record?: { id?: string | number; _id?: string } | null) {
  if (!record) return undefined;
  const id = record.id ?? record._id;
  return id === undefined ? undefined : String(id);
}

function cityId(gallery: Gallery) {
  if (!gallery.city) return '';
  return typeof gallery.city === 'string' ? gallery.city : String(recordId(gallery.city) ?? '');
}

function imageUrl(image: NonNullable<Gallery['images']>[number]) {
  return resolveApiAssetUrl(typeof image === 'string' ? image : image.url ?? image.path ?? image.filename ?? '');
}

export default function AdminGalleriesPage() {
  const { token } = useAuth();
  const { language } = useLanguage();
  const { show } = useToast();
  const [items, setItems] = useState<Gallery[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filterCity, setFilterCity] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Gallery | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const cityNames = useMemo(() => new Map(cities.map((city) => [String(recordId(city)), language === 'am' ? city.name_am : city.name_en])), [cities, language]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setFilePreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [galleries, cityItems] = await Promise.all([
        filterCity ? galleriesApi.listByCity(filterCity, token || undefined) : galleriesApi.list(token || undefined),
        citiesApi.list(token || undefined),
      ]);
      setItems(galleries);
      setCities(cityItems);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load galleries.');
    } finally {
      setLoading(false);
    }
  }, [filterCity, token]);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return items;
    return items.filter((gallery) => `${gallery.title ?? ''} ${gallery.description ?? ''} ${cityNames.get(cityId(gallery)) ?? cityId(gallery)} ${recordId(gallery) ?? ''}`.toLowerCase().includes(value));
  }, [cityNames, items, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [filterCity, query]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);

  function openCreate() {
    setEditing(null);
    setTitle('');
    setDescription('');
    setSelectedCity(filterCity);
    setFiles([]);
    setModalOpen(true);
  }

  function openEdit(gallery: Gallery) {
    setEditing(gallery);
    setTitle(gallery.title ?? '');
    setDescription(gallery.description ?? '');
    setSelectedCity(cityId(gallery));
    setFiles([]);
    setModalOpen(true);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !description.trim() || !selectedCity || (!editing && files.length === 0)) return;
    setSaving(true);
    try {
      const body = new FormData();
      body.append('title', title.trim());
      body.append('description', description.trim());
      body.append('city', selectedCity);
      files.forEach((file) => body.append('images', file));
      const id = editing ? recordId(editing) : undefined;
      const saved = id ? await galleriesApi.update(id, body, token || undefined) : await galleriesApi.create(body, token || undefined);
      setItems((current) => id
        ? current.map((gallery) => recordId(gallery) === id ? { ...gallery, ...saved } : gallery)
        : [saved, ...current]);
      setModalOpen(false);
      setEditing(null);
      setTitle('');
      setDescription('');
      setFiles([]);
      show(`Gallery ${id ? 'updated' : 'created'} successfully.`, 'success');
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : 'Unable to save the gallery.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function remove(gallery: Gallery) {
    const id = recordId(gallery);
    if (!id || !window.confirm('Delete this gallery? This action cannot be undone.')) return;
    setDeletingId(id);
    try {
      await galleriesApi.delete(id, token || undefined);
      setItems((current) => current.filter((item) => recordId(item) !== id));
      show('Gallery deleted successfully.', 'success');
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : 'Unable to delete the gallery.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminLayout title="Galleries" description="Upload and manage destination photography grouped by city." eyebrow="Media library" actions={<AdminButton onClick={openCreate}><Plus size={16} /> New gallery</AdminButton>}>
      <Panel>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search galleries..." className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white" /></div>
          <select value={filterCity} onChange={(event) => setFilterCity(event.target.value)} className="h-10 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-ink-600 outline-none focus:border-primary-300">
            <option value="">All cities</option>
            {cities.map((city) => { const id = recordId(city); return id ? <option key={id} value={id}>{language === 'am' ? city.name_am : city.name_en}</option> : null; })}
          </select>
          <p className="text-xs font-semibold text-ink-400">{filtered.length} galleries</p>
        </div>
        {loading ? <div className="flex min-h-72 items-center justify-center"><Spinner /></div> : error ? <div className="p-5"><ErrorState title="Could not load galleries" subtitle={error} retryLabel="Try again" onRetry={() => void load()} /></div> : paginated.length === 0 ? <div className="p-5"><EmptyState title="No galleries found" subtitle="Create a gallery and upload destination images." icon={Images} action={<AdminButton onClick={openCreate}><Plus size={16} /> New gallery</AdminButton>} /></div> : (
          <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-4">
            {paginated.map((gallery, index) => { const id = recordId(gallery); const images = gallery.images ?? []; const first = images[0] ? imageUrl(images[0]) : ''; return <article key={id ?? index} className="overflow-hidden rounded-card-lg border border-neutral-200 bg-white">
              <div className="relative aspect-[4/3] bg-neutral-100">{first ? <img src={first} alt="Gallery cover" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-ink-300"><Images size={38} /></div>}<span className="absolute bottom-3 right-3 rounded-pill bg-black/65 px-2.5 py-1 text-xs font-bold text-white">{images.length} images</span></div>
              <div className="p-4"><h2 className="font-heading font-extrabold text-primary-900">{gallery.title || 'Untitled gallery'}</h2><p className="mt-1 text-xs font-semibold text-ink-400">{cityNames.get(cityId(gallery)) ?? cityId(gallery) ?? 'Unknown city'}</p>{gallery.description && <p className="mt-2 line-clamp-2 text-sm text-ink-500">{gallery.description}</p>}<div className="mt-4 flex gap-2"><button type="button" onClick={() => openEdit(gallery)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-800 px-3 py-2.5 text-xs font-bold text-white"><Edit3 size={14} /> Edit</button><button type="button" disabled={deletingId === id} onClick={() => void remove(gallery)} className="rounded-xl border border-danger-500/25 px-3 text-danger-500 hover:bg-danger-500 hover:text-white">{deletingId === id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}</button></div></div>
            </article>; })}
          </div>
        )}
        {!loading && !error && filtered.length > 0 && <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />}
      </Panel>
      {modalOpen && <AdminEditModal title={editing ? 'Edit gallery' : 'Create gallery'} description="Choose a city and upload one or more JPEG, PNG, or WebP images." onClose={() => { if (!saving) setModalOpen(false); }} onSubmit={save} submitLabel={editing ? 'Save changes' : 'Create gallery'} submitting={saving} submittingLabel="Uploading…">
        <label className="text-sm font-bold text-ink-600 sm:col-span-2">Title<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Historic Landmarks" className={adminFieldClass} /></label>
        <label className="text-sm font-bold text-ink-600 sm:col-span-2">Description<textarea required rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="A collection of beautiful landmarks" className={adminTextAreaClass} /></label>
        <label className="text-sm font-bold text-ink-600 sm:col-span-2">City<select required value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)} className={adminFieldClass}><option value="">Select a city</option>{cities.map((city) => { const id = recordId(city); return id ? <option key={id} value={id}>{language === 'am' ? city.name_am : city.name_en}</option> : null; })}</select></label>
        {editing && (editing.images?.length ?? 0) > 0 && <div className="sm:col-span-2"><p className="mb-2 text-xs font-bold text-ink-500">Current images</p><div className="grid grid-cols-3 gap-2">{editing.images?.map((image, index) => <img key={index} src={imageUrl(image)} alt={`Existing gallery image ${index + 1}`} className="aspect-square w-full rounded-xl object-cover" />)}</div></div>}
        <label className="rounded-xl border-2 border-dashed border-neutral-300 p-6 text-center text-sm font-bold text-ink-600 sm:col-span-2"><Upload className="mx-auto mb-2 text-primary-600" /><span>{editing ? 'Upload replacement or additional images' : 'Upload gallery images'}</span><input required={!editing} multiple type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFiles(Array.from(event.target.files ?? []))} className="mt-4 block w-full text-sm font-medium file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-primary-700" />{files.length > 0 && <span className="mt-3 block text-xs text-success-500">{files.length} file{files.length === 1 ? '' : 's'} selected</span>}</label>
        {filePreviews.length > 0 && <div className="sm:col-span-2"><p className="mb-2 text-xs font-bold text-ink-500">New image previews</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{filePreviews.map((preview, index) => <div key={preview} className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"><img src={preview} alt={`Selected image ${index + 1}`} className="aspect-square w-full object-cover" /><p className="truncate px-2 py-1.5 text-xs text-ink-400">{files[index]?.name}</p></div>)}</div></div>}
      </AdminEditModal>}
    </AdminLayout>
  );
}
