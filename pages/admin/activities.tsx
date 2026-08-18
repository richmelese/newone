import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Edit3, ImageIcon, Languages, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminEditModal, { adminFieldClass } from '@/components/admin/AdminEditModal';
import AdminPagination from '@/components/admin/AdminPagination';
import { AdminButton, Panel } from '@/components/admin/AdminUi';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import { activitiesApi, resolveApiAssetUrl, thingsToDoApi, type Activity, type ThingsToDo } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

const PAGE_SIZE = 10;

function recordId(record: Activity) {
  const id = record.id ?? record._id;
  return id === undefined ? '' : String(id);
}

function activityImage(activity: Activity) {
  return resolveApiAssetUrl(activity.hero_image || activity.image_url || activity.image || activity.cover_image);
}

function thingActivityId(item: ThingsToDo) {
  if (typeof item.activity === 'string') return item.activity;
  const id = item.activity.id ?? item.activity._id;
  return id === undefined ? '' : String(id);
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
  const [nameEn, setNameEn] = useState('');
  const [nameAm, setNameAm] = useState('');

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
      `${activity.name_en} ${activity.name_am}`.toLowerCase().includes(normalized),
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
    setModalOpen(true);
  }

  async function openEdit(activity: Activity) {
    const id = recordId(activity);
    if (!id) return;
    setLoadingEditId(id);
    try {
      const current = await activitiesApi.getById(id, token || undefined);
      setEditing(current);
      setNameEn(current.name_en);
      setNameAm(current.name_am);
      setModalOpen(true);
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : 'Unable to load the activity.', 'error');
    } finally {
      setLoadingEditId('');
    }
  }

  async function createActivity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const editingId = editing ? recordId(editing) : '';
      const payload = {
        name_en: nameEn.trim(),
        name_am: nameAm.trim(),
      };
      const saved = editingId
        ? await activitiesApi.update(editingId, payload, token || undefined)
        : await activitiesApi.create(payload, token || undefined);
      setActivities((current) => editingId
        ? current.map((activity) => recordId(activity) === editingId ? { ...activity, ...saved } : activity)
        : [saved, ...current]);
      setModalOpen(false);
      setEditing(null);
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
              placeholder="Search activities..."
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
                <article key={id || `${activity.name_en}-${index}`} className="grid gap-4 px-5 py-4 transition hover:bg-neutral-50 sm:grid-cols-[5rem_1fr_1fr_minmax(8rem,1fr)_auto] sm:items-center sm:px-6">
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
          description="Add the English and Amharic names for this activity type."
          onClose={() => { if (!saving) { setModalOpen(false); setEditing(null); } }}
          onSubmit={createActivity}
          submitLabel={editing ? 'Save changes' : 'Create activity'}
          submitting={saving}
          submittingLabel={editing ? 'Saving...' : 'Creating...'}
        >
          <label className="text-sm font-bold text-ink-600 sm:col-span-2">
            English name
            <input required value={nameEn} onChange={(event) => setNameEn(event.target.value)} placeholder="Hiking" className={adminFieldClass} />
          </label>
          <label className="text-sm font-bold text-ink-600 sm:col-span-2">
            Amharic name
            <input required lang="am" value={nameAm} onChange={(event) => setNameAm(event.target.value)} placeholder="የተራራ ጉዞ" className={adminFieldClass} />
          </label>
        </AdminEditModal>
      )}
    </AdminLayout>
  );
}
