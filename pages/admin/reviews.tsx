import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Loader2, MessageSquare, Search, Star, Trash2, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { AdminButton, MetricCard, Panel, StatusPill } from '@/components/admin/AdminUi';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import { reviewsApi, type ReviewResponse, type ReviewSubject } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';

const PAGE_SIZE = 8;

function reviewId(review: ReviewResponse) {
  return review.id ?? review._id;
}

function subjectName(subject?: ReviewSubject | null) {
  if (!subject) return 'Subject not assigned';
  if (typeof subject === 'string') return subject;
  return subject.name_en ?? subject.name ?? subject.title_en ?? subject.title ?? subject.external_hotel_id ?? subject._id ?? subject.id ?? 'Unknown subject';
}

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'ET';
}

export default function AdminReviewsPage() {
  const { token } = useAuth();
  const { show } = useToast();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setReviews(await reviewsApi.list(token || undefined));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load reviews.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { void loadReviews(); }, [loadReviews]);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return reviews;
    return reviews.filter((review) => `${review.user?.full_name ?? ''} ${review.user?.email ?? ''} ${review.title ?? ''} ${review.content ?? ''} ${subjectName(review.review_subject)} ${review.status ?? ''}`.toLowerCase().includes(value));
  }, [query, reviews]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const average = reviews.length ? (reviews.reduce((sum, review) => sum + (review.overall_rating ?? 0), 0) / reviews.length).toFixed(1) : '0.0';
  const approvedCount = reviews.filter((review) => ['APPROVED', 'PUBLISHED'].includes(review.status?.toUpperCase() ?? '')).length;

  useEffect(() => setPage(1), [query]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);

  function toggleSelected(id: string | number) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function moderate(review: ReviewResponse, status: 'APPROVED' | 'REJECTED') {
    const id = reviewId(review);
    if (id === undefined) return;
    setUpdatingId(id);
    try {
      const updated = await reviewsApi.updateStatus(id, status, token || undefined);
      setReviews((current) => current.map((item) => reviewId(item) === id ? { ...item, ...updated, status: updated.status ?? status } : item));
      setSelectedIds((current) => { const next = new Set(current); next.delete(id); return next; });
      show(`Review ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully.`, 'success');
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : 'Unable to update the review.', 'error');
    } finally {
      setUpdatingId(null);
    }
  }

  async function approveSelected() {
    const selected = reviews.filter((review) => { const id = reviewId(review); return id !== undefined && selectedIds.has(id); });
    for (const review of selected) await moderate(review, 'APPROVED');
  }

  async function deleteReview(review: ReviewResponse) {
    const id = reviewId(review);
    if (id === undefined) return;
    if (!window.confirm(`Delete “${review.title || 'this review'}”? This action cannot be undone.`)) return;
    setUpdatingId(id);
    try {
      await reviewsApi.delete(id, token || undefined);
      setReviews((current) => current.filter((item) => reviewId(item) !== id));
      setSelectedIds((current) => { const next = new Set(current); next.delete(id); return next; });
      show('Review deleted successfully.', 'success');
    } catch (caughtError) {
      show(caughtError instanceof Error ? caughtError.message : 'Unable to delete the review.', 'error');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminLayout
      title="Reviews"
      description="Monitor traveler feedback and moderate reviews returned by the Reviews API."
      eyebrow="Trust and quality"
      actions={<AdminButton secondary onClick={() => void approveSelected()}><Check size={16} /> Approve selected ({selectedIds.size})</AdminButton>}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total reviews" value={reviews.length} detail="All submitted reviews" icon={<MessageSquare size={20} />} />
        <MetricCard label="Average rating" value={average} detail="Overall traveler rating" icon={<Star size={20} />} tone="orange" />
        <MetricCard label="Approved" value={approvedCount} detail={`${reviews.length - approvedCount} awaiting or rejected`} icon={<Check size={20} />} tone="green" />
      </div>

      <Panel>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reviews..." className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white" /></div>
          <p className="text-xs font-semibold text-ink-400">{filtered.length} reviews</p>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center"><Spinner /></div>
        ) : error ? (
          <div className="p-5"><ErrorState title="Could not load reviews" subtitle={error} retryLabel="Try again" onRetry={() => void loadReviews()} /></div>
        ) : paginated.length === 0 ? (
          <div className="p-5"><EmptyState title={query ? 'No reviews match your search' : 'No reviews yet'} subtitle={query ? 'Try another traveler, title, subject, or status.' : 'Submitted reviews will appear here.'} icon={MessageSquare} /></div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {paginated.map((review, index) => {
              const id = reviewId(review);
              const selected = id !== undefined && selectedIds.has(id);
              const busy = id !== undefined && updatingId === id;
              const name = review.user?.full_name || 'Ethiopidia traveler';
              const status = review.status?.toUpperCase() ?? 'PENDING';
              const tone = status === 'APPROVED' || status === 'PUBLISHED' ? 'green' : status === 'REJECTED' ? 'red' : 'amber';
              return (
                <article key={id ?? `${review.title}-${index}`} className="grid gap-4 px-5 py-5 transition sm:grid-cols-[auto_1fr_auto] hover:bg-primary-50/30">
                  <button type="button" disabled={id === undefined} onClick={() => id !== undefined && toggleSelected(id)} className={`mt-1 flex h-5 w-5 items-center justify-center rounded border transition ${selected ? 'border-primary-700 bg-primary-700 text-white' : 'border-neutral-300 bg-white'}`} aria-label="Select review">{selected && <Check size={13} />}</button>
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-100 font-heading text-xs font-extrabold text-accent-700">{initials(name)}</span>
                      <div><h2 className="text-sm font-bold text-primary-900">{name}</h2><p className="text-xs text-ink-400">{subjectName(review.review_subject)}</p></div>
                      <div className="flex items-center gap-0.5 sm:ml-2">{Array.from({ length: 5 }).map((_, star) => <Star key={star} size={13} className={star < (review.overall_rating ?? 0) ? 'fill-amber-500 text-amber-500' : 'text-neutral-300'} />)}</div>
                      <span className="text-xs text-ink-400">{formatDate(review.created_at)}</span>
                      <StatusPill tone={tone}>{status}</StatusPill>
                      {review.trip_type && <StatusPill tone="blue">{review.trip_type}</StatusPill>}
                    </div>
                    {review.title && <h3 className="mt-3 text-sm font-extrabold text-primary-900">{review.title}</h3>}
                    <p className="mt-1 max-w-4xl text-sm leading-relaxed text-ink-600">{review.content}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-semibold text-ink-400">
                      <span>Cleanliness {review.cleanliness_rating ?? '—'}/5</span><span>Service {review.service_rating ?? '—'}/5</span><span>Location {review.location_rating ?? '—'}/5</span><span>Value {review.value_rating ?? '—'}/5</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:justify-end">
                    {busy ? <span className="p-2 text-primary-700"><Loader2 size={17} className="animate-spin" /></span> : <>
                      {status !== 'APPROVED' && <button type="button" onClick={() => void moderate(review, 'APPROVED')} className="rounded-lg border border-success-500/30 p-2 text-success-500 hover:bg-success-500/10" aria-label="Approve review"><Check size={15} /></button>}
                      {status !== 'REJECTED' && <button type="button" onClick={() => void moderate(review, 'REJECTED')} className="rounded-lg border border-neutral-200 p-2 text-ink-500 hover:bg-neutral-100" aria-label="Reject review"><X size={15} /></button>}
                      <button type="button" onClick={() => void deleteReview(review)} className="rounded-lg border border-neutral-200 p-2 text-danger-500 hover:bg-danger-500/5" aria-label="Delete review"><Trash2 size={15} /></button>
                    </>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        {!loading && !error && filtered.length > 0 && <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />}
      </Panel>
    </AdminLayout>
  );
}
