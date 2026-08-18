import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Plus, Search, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminEditModal, { adminFieldClass, adminTextAreaClass } from '@/components/admin/AdminEditModal';
import AdminPagination from '@/components/admin/AdminPagination';
import { AdminButton, Panel, TableEmpty } from '@/components/admin/AdminUi';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/components/ui/ErrorState';
import { activitiesApi, citiesApi, resolveApiAssetUrl, thingsToDoApi, type Activity, type City, type CreateThingsToDoPayload, type ThingsToDo } from '@/lib/api';
import { useAuth } from '@/lib/auth';

const PAGE_SIZE = 9;
type ExperienceForm = Omit<CreateThingsToDoPayload, 'hero_image'> & { hero_image: string };
const EMPTY_FORM: ExperienceForm = { slug: '', name_en: '', name_am: '', description_en: '', description_am: '', hero_image: '', activity: '', city: '' };
const recordId = (record: { id?: string | number; _id?: string }) => record.id ?? record._id;

export default function AdminExperiencesPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<ThingsToDo[]>([]); const [cities, setCities] = useState<City[]>([]); const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [query, setQuery] = useState(''); const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false); const [saving, setSaving] = useState(false); const [deletingId, setDeletingId] = useState(''); const [form, setForm] = useState(EMPTY_FORM);
  const load = useCallback(async () => { setLoading(true); setError(''); try { const [things, cityItems, activityItems] = await Promise.all([thingsToDoApi.list(token || undefined), citiesApi.list(token || undefined), activitiesApi.list(token || undefined)]); setItems(things); setCities(cityItems); setActivities(activityItems); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load things to do.'); } finally { setLoading(false); } }, [token]);
  useEffect(() => { void load(); }, [load]); useEffect(() => setPage(1), [query]);
  const filtered = useMemo(() => items.filter(item => `${item.name_en} ${item.name_am} ${item.slug}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)); const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const update = (field: keyof ExperienceForm, value: string) => setForm(current => ({ ...current, [field]: value }));
  async function create(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSaving(true); try { const saved = await thingsToDoApi.create(form, token || undefined); setItems(current => [saved, ...current]); setModalOpen(false); setForm(EMPTY_FORM); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to create this activity.'); } finally { setSaving(false); } }
  async function remove(item: ThingsToDo) { const id = recordId(item); if (!id || !window.confirm(`Delete “${item.name_en}”?`)) return; setDeletingId(String(id)); try { await thingsToDoApi.delete(id, token || undefined); setItems(current => current.filter(entry => recordId(entry) !== id)); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to delete this activity.'); } finally { setDeletingId(''); } }

  return <AdminLayout title="Things to do" description="Create and manage traveler activities from the Ethiopidia API." eyebrow="Things to do catalog" actions={<AdminButton onClick={() => { setForm(EMPTY_FORM); setModalOpen(true); }}><Plus size={16} /> New activity</AdminButton>}>
    <Panel><div className="border-b border-neutral-200 p-5"><div className="relative max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search things to do..." className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none" /></div></div>
      {loading ? <div className="flex min-h-72 items-center justify-center"><Spinner /></div> : error && items.length === 0 ? <div className="p-5"><ErrorState title="Could not load things to do" subtitle={error} retryLabel="Try again" onRetry={() => void load()} /></div> : paginated.length === 0 ? <TableEmpty message="No things to do found." /> : <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">{paginated.map(item => { const id = recordId(item); const image = resolveApiAssetUrl(item.hero_image); return <article key={id ?? item.slug} className="overflow-hidden rounded-card border border-neutral-200"><div className="relative aspect-[16/9] bg-neutral-100">{image && <Image src={image} alt={item.name_en} fill unoptimized sizes="400px" className="object-cover" />}</div><div className="p-4"><h2 className="font-heading font-extrabold text-primary-900">{item.name_en}</h2><p className="mt-1 text-xs text-ink-400">/{item.slug}</p><div className="mt-4 flex gap-2"><Link href={`/things-to-do/${item.slug}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-800 px-3 py-2.5 text-xs font-bold text-white"><Eye size={14} /> View</Link><button type="button" disabled={!id || deletingId === String(id)} onClick={() => void remove(item)} className="rounded-xl border border-danger-500/25 px-3 text-danger-500 hover:bg-danger-500 hover:text-white disabled:opacity-50"><Trash2 size={14} /></button></div></div></article>; })}</div>}
      <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
    </Panel>
    {modalOpen && <AdminEditModal title="Create Things To Do" description="Add bilingual content and connect it to an activity and city." onClose={() => !saving && setModalOpen(false)} onSubmit={create} submitLabel="Create activity" submitting={saving} submittingLabel="Creating…">
      <label className="text-sm font-bold text-ink-600">Slug<input required value={form.slug} onChange={e => update('slug', e.target.value)} placeholder="mountain-hiking" className={adminFieldClass} /></label>
      <label className="text-sm font-bold text-ink-600">Hero image URL<input required type="url" value={form.hero_image} onChange={e => update('hero_image', e.target.value)} className={adminFieldClass} /></label>
      <label className="text-sm font-bold text-ink-600">English name<input required value={form.name_en} onChange={e => update('name_en', e.target.value)} className={adminFieldClass} /></label>
      <label className="text-sm font-bold text-ink-600">Amharic name<input required value={form.name_am} onChange={e => update('name_am', e.target.value)} className={adminFieldClass} /></label>
      <label className="text-sm font-bold text-ink-600">English description<textarea required rows={4} value={form.description_en} onChange={e => update('description_en', e.target.value)} className={adminTextAreaClass} /></label>
      <label className="text-sm font-bold text-ink-600">Amharic description<textarea required rows={4} value={form.description_am} onChange={e => update('description_am', e.target.value)} className={adminTextAreaClass} /></label>
      <label className="text-sm font-bold text-ink-600">Activity<select required value={form.activity} onChange={e => update('activity', e.target.value)} className={adminFieldClass}><option value="">Select activity</option>{activities.map(item => { const id = recordId(item); return id ? <option key={id} value={id}>{item.name_en}</option> : null; })}</select></label>
      <label className="text-sm font-bold text-ink-600">City<select required value={form.city} onChange={e => update('city', e.target.value)} className={adminFieldClass}><option value="">Select city</option>{cities.map(item => { const id = recordId(item); return id ? <option key={id} value={id}>{item.name_en}</option> : null; })}</select></label>
    </AdminEditModal>}
  </AdminLayout>;
}
