import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { CalendarDays, Edit3, Eye, ImageIcon, Loader2, Newspaper, Plus, Search, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminEditModal, { adminFieldClass, adminTextAreaClass } from '@/components/admin/AdminEditModal';
import { AdminButton, Panel } from '@/components/admin/AdminUi';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import { activitiesApi, blogsApi, citiesApi, resolveApiAssetUrl, type Activity, type Blog, type BlogPayload, type City } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { useLanguage } from '@/lib/language';

const PAGE_SIZE = 6;
const EMPTY_FORM: BlogPayload = { title: '', description: '', picture: '', city_id: '', activity_id: '' };

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
}

export default function AdminBlogsPage() {
  const { token } = useAuth();
  const { show } = useToast();
  const { language } = useLanguage();
  const [items, setItems] = useState<Blog[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [lookupsLoading, setLookupsLoading] = useState(true);
  const [lookupsError, setLookupsError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [form, setForm] = useState<BlogPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await blogsApi.list(token || undefined));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load blogs.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { void loadBlogs(); }, [loadBlogs]);

  const loadLookups = useCallback(async () => {
    setLookupsLoading(true);
    setLookupsError('');
    try {
      const [cityItems, activityItems] = await Promise.all([
        citiesApi.list(token || undefined),
        activitiesApi.list(token || undefined),
      ]);
      setCities(cityItems);
      setActivities(activityItems);
    } catch (caughtError) {
      setLookupsError(caughtError instanceof Error ? caughtError.message : 'Unable to load cities and activities.');
    } finally {
      setLookupsLoading(false);
    }
  }, [token]);

  useEffect(() => { void loadLookups(); }, [loadLookups]);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return items;
    return items.filter((blog) => `${blog.title} ${blog.description}`.toLowerCase().includes(value));
  }, [items, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [query]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);

  function updateField<K extends keyof BlogPayload>(field: K, value: BlogPayload[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openCreate() {
    setEditingBlog(null);
    setForm(EMPTY_FORM);
    setPictureFile(null);
    setModalOpen(true);
  }

  function openEdit(blog: Blog) {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      description: blog.description,
      picture: blog.picture,
      city_id: blog.city_id ?? '',
      activity_id: blog.activity_id ?? '',
    });
    setPictureFile(null);
    setModalOpen(true);
  }

  async function saveBlog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const payload: BlogPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      picture: form.picture.trim(),
      ...(form.city_id?.trim() ? { city_id: form.city_id.trim() } : {}),
      ...(form.activity_id?.trim() ? { activity_id: form.activity_id.trim() } : {}),
    };
    const editingId = editingBlog?.id ?? editingBlog?._id;
    try {
      let saved: Blog;
      if (pictureFile) {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('picture', pictureFile);
        if (payload.city_id) formData.append('city_id', payload.city_id);
        if (payload.activity_id) formData.append('activity_id', payload.activity_id);
        saved = editingId === undefined
          ? await blogsApi.createFormData(formData, token || undefined)
          : await blogsApi.updateFormData(editingId, formData, token || undefined);
      } else {
        saved = editingId === undefined
          ? await blogsApi.create(payload, token || undefined)
          : await blogsApi.update(editingId, payload, token || undefined);
      }
      setItems((current) => editingId === undefined
        ? [saved, ...current]
        : current.map((item) => (item.id ?? item._id) === editingId
          ? { ...item, ...saved, id: saved.id ?? item.id, _id: saved._id ?? item._id }
          : item));
      setModalOpen(false);
      setEditingBlog(null);
      setForm(EMPTY_FORM);
      setPictureFile(null);
      show(`Blog ${editingId === undefined ? 'created' : 'updated'} successfully.`, 'success');
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : 'Unable to save the blog.', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function deleteBlog(blog: Blog) {
    const id = blog.id ?? blog._id;
    if (id === undefined) {
      show('This blog cannot be deleted because it has no ID.', 'error');
      return;
    }
    if (!window.confirm(`Delete “${blog.title}”? This action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await blogsApi.delete(id, token || undefined);
      setItems((current) => current.filter((item) => (item.id ?? item._id) !== id));
      show('Blog deleted successfully.', 'success');
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : 'Unable to delete the blog.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminLayout
      title="Blogs"
      description="Create and manage travel stories, destination guides, and editorial content."
      eyebrow="Editorial content"
      actions={<AdminButton onClick={openCreate}><Plus size={16} /> New blog</AdminButton>}
    >
      <Panel>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="relative w-full sm:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search blogs..." className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white" />
          </div>
          <p className="text-xs font-semibold text-ink-400">Showing {filtered.length} of {items.length} blogs</p>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center"><Spinner /></div>
        ) : error ? (
          <div className="p-5"><ErrorState title="Could not load blogs" subtitle={error} retryLabel="Try again" onRetry={() => void loadBlogs()} /></div>
        ) : paginated.length === 0 ? (
          <div className="p-5"><EmptyState title={query ? 'No blogs match your search' : 'No blogs yet'} subtitle={query ? 'Try a different title or keyword.' : 'Create the first travel story for your readers.'} icon={Newspaper} action={!query ? <AdminButton onClick={openCreate}><Plus size={16} /> New blog</AdminButton> : undefined} /></div>
        ) : (
          <div className="grid gap-5 p-5 md:grid-cols-2 xl:grid-cols-3">
            {paginated.map((blog, index) => {
              const id = blog.id ?? blog._id;
              const image = resolveApiAssetUrl(blog.picture);
              return (
                <article key={id ?? `${blog.title}-${index}`} className="group overflow-hidden rounded-card-lg border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-lift">
                  <div className="aspect-[16/9] overflow-hidden bg-neutral-100">
                    {image ? <img src={image} alt={blog.title} onError={(event) => { event.currentTarget.style.display = 'none'; }} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-ink-300"><ImageIcon size={36} /></div>}
                  </div>
                  <div className="p-4">
                    {formatDate(blog.created_at) && <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-400"><CalendarDays size={12} /> {formatDate(blog.created_at)}</p>}
                    <h2 className="mt-2 line-clamp-2 font-heading text-lg font-extrabold text-primary-900">{blog.title}</h2>
                    <p className="mt-2 line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-ink-500">{blog.description}</p>
                    {id !== undefined && (
                      <div className="mt-4 flex gap-2 border-t border-neutral-100 pt-4">
                        <button type="button" onClick={() => openEdit(blog)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-800 px-3 py-2.5 text-xs font-bold text-white hover:bg-primary-700"><Edit3 size={14} /> Edit</button>
                        <Link href={`/blogs/${id}`} className="flex items-center justify-center rounded-xl border border-neutral-200 px-3 text-ink-500 hover:bg-neutral-100" aria-label={`Preview ${blog.title}`}><Eye size={15} /></Link>
                        <button type="button" onClick={() => void deleteBlog(blog)} disabled={deletingId === id} className="flex items-center justify-center gap-2 rounded-xl border border-danger-500/25 px-3 py-2.5 text-xs font-bold text-danger-500 hover:bg-danger-500 hover:text-white disabled:cursor-wait disabled:opacity-60">
                          {deletingId === id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
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

      {modalOpen && (
        <AdminEditModal
          title={editingBlog ? 'Edit blog' : 'Create blog'}
          description="Add the story content and optional destination/activity relationships."
          onClose={() => { if (!saving) { setModalOpen(false); setEditingBlog(null); setPictureFile(null); } }}
          onSubmit={saveBlog}
          submitLabel={editingBlog ? 'Save changes' : 'Create blog'}
          submitting={saving}
          submittingLabel={editingBlog ? 'Saving…' : 'Creating…'}
        >
          <label className="text-sm font-bold text-ink-600 sm:col-span-2">Title<input required value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="Discovering Ethiopia's Historic Route" className={adminFieldClass} /></label>
          <label className="text-sm font-bold text-ink-600 sm:col-span-2">Description<textarea required rows={6} value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="Write the blog description..." className={adminTextAreaClass} /></label>
          <label className="text-sm font-bold text-ink-600 sm:col-span-2">Upload picture <span className="font-normal text-ink-400">(JPEG, PNG or WebP)</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPictureFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm font-medium text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-primary-700" /></label>
          <label className="text-sm font-bold text-ink-600 sm:col-span-2">Picture URL or existing upload path <span className="font-normal text-ink-400">({pictureFile ? 'uploaded file will be used' : 'required when no file is selected'})</span><input required={!pictureFile} value={form.picture} onChange={(event) => updateField('picture', event.target.value)} placeholder="/uploads/blogs/picture.jpg or https://..." className={adminFieldClass} /></label>
          {(pictureFile || form.picture) && <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 sm:col-span-2"><img src={pictureFile ? URL.createObjectURL(pictureFile) : resolveApiAssetUrl(form.picture)} alt="Blog preview" onError={(event) => { event.currentTarget.style.display = 'none'; }} className="max-h-56 w-full object-cover" /></div>}
          {lookupsError && <div role="alert" className="rounded-xl bg-danger-500/10 px-4 py-3 text-sm font-medium text-danger-500 sm:col-span-2">{lookupsError} <button type="button" onClick={() => void loadLookups()} className="ml-1 font-bold underline">Try again</button></div>}
          <label className="text-sm font-bold text-ink-600">City *
            <select required disabled={lookupsLoading || Boolean(lookupsError)} value={form.city_id ?? ''} onChange={(event) => updateField('city_id', event.target.value)} className={adminFieldClass}>
              <option value="">{lookupsLoading ? 'Loading cities…' : 'Select a city'}</option>
              {cities.map((city) => {
                const id = city.id ?? city._id;
                if (id === undefined) return null;
                return <option key={id} value={id}>{language === 'am' ? city.name_am : city.name_en}</option>;
              })}
            </select>
          </label>
          <label className="text-sm font-bold text-ink-600">Activity *
            <select required disabled={lookupsLoading || Boolean(lookupsError)} value={form.activity_id ?? ''} onChange={(event) => updateField('activity_id', event.target.value)} className={adminFieldClass}>
              <option value="">{lookupsLoading ? 'Loading activities…' : 'Select an activity'}</option>
              {activities.map((activity) => {
                const id = activity.id ?? activity._id;
                if (id === undefined) return null;
                return <option key={id} value={id}>{language === 'am' ? activity.name_am : activity.name_en}</option>;
              })}
            </select>
          </label>
        </AdminEditModal>
      )}
    </AdminLayout>
  );
}
