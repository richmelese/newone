import { useEffect, useMemo, useState } from 'react';
import { Check, MessageSquare, Search, Star, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { AdminButton, MetricCard, Panel, StatusPill, TableEmpty } from '@/components/admin/AdminUi';
import { hotels } from '@/data/hotels';

const allReviews = hotels.flatMap((hotel) => hotel.reviews.map((review) => ({ ...review, key: `${hotel.id}:${review.id}`, hotelId: hotel.id, hotelName: hotel.name })));
const PAGE_SIZE = 8;

export default function AdminReviewsPage() {
  const [query, setQuery] = useState('');
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => allReviews.filter((review) => `${review.author} ${review.hotelName} ${review.comment.en}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const average = allReviews.length ? (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1) : '0.0';

  useEffect(() => setPage(1), [query]);

  function toggleSelected(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleHidden(id: string) {
    setHiddenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <AdminLayout
      title="Reviews"
      description="Monitor guest feedback and control which reviews are visible. Moderation changes are UI-only in this prototype."
      eyebrow="Trust and quality"
      actions={<AdminButton secondary><Check size={16} /> Approve selected ({selectedIds.size})</AdminButton>}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total reviews" value={allReviews.length} detail="Across all hotel listings" icon={<MessageSquare size={20} />} />
        <MetricCard label="Average rating" value={average} detail="Overall guest satisfaction" trend="up" icon={<Star size={20} />} tone="orange" />
        <MetricCard label="Visible" value={allReviews.length - hiddenIds.size} detail={`${hiddenIds.size} currently hidden`} icon={<Check size={20} />} tone="green" />
      </div>

      <Panel>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reviews..." className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white" /></div>
          <p className="text-xs font-semibold text-ink-400">{filtered.length} guest reviews</p>
        </div>

        <div className="divide-y divide-neutral-200">
          {paginated.map((review) => {
            const hidden = hiddenIds.has(review.key);
            const selected = selectedIds.has(review.key);
            return (
              <article key={review.key} className={`grid gap-4 px-5 py-5 transition sm:grid-cols-[auto_1fr_auto] ${hidden ? 'bg-neutral-100/70 opacity-65' : 'hover:bg-primary-50/30'}`}>
                <button type="button" onClick={() => toggleSelected(review.key)} className={`mt-1 flex h-5 w-5 items-center justify-center rounded border transition ${selected ? 'border-primary-700 bg-primary-700 text-white' : 'border-neutral-300 bg-white'}`} aria-label="Select review">{selected && <Check size={13} />}</button>
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-100 font-heading text-xs font-extrabold text-accent-700">{review.author.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
                    <div><h2 className="text-sm font-bold text-primary-900">{review.author}</h2><p className="text-xs text-ink-400">{review.hotelName}</p></div>
                    <div className="flex items-center gap-0.5 sm:ml-2">{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={13} className={index < review.rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-300'} />)}</div>
                    <span className="text-xs text-ink-400">{review.date}</span>
                    <StatusPill tone={hidden ? 'gray' : 'green'}>{hidden ? 'Hidden' : 'Visible'}</StatusPill>
                  </div>
                  <p className="mt-3 max-w-4xl text-sm leading-relaxed text-ink-600">{review.comment.en}</p>
                </div>
                <div className="flex items-start gap-2 sm:justify-end">
                  <button type="button" onClick={() => toggleHidden(review.key)} className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-bold text-ink-500 hover:bg-white">{hidden ? 'Restore' : 'Hide'}</button>
                  <button type="button" onClick={() => toggleHidden(review.key)} className="rounded-lg border border-neutral-200 p-2 text-danger-500 hover:bg-danger-500/5" aria-label="Remove review"><Trash2 size={15} /></button>
                </div>
              </article>
            );
          })}
          {filtered.length === 0 && <TableEmpty message="No reviews match your search." />}
        </div>
        <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </Panel>
    </AdminLayout>
  );
}
