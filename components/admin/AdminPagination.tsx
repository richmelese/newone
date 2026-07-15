import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminPagination({
  page,
  pageCount,
  totalItems,
  pageSize,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  if (totalItems === 0) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-semibold text-ink-400">Showing {start}–{end} of {totalItems}</p>
      <div className="flex items-center gap-1">
        <button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-ink-500 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Previous page"><ChevronLeft size={16} /></button>
        {pages.map((item) => (
          <button key={item} type="button" onClick={() => onPageChange(item)} className={`h-9 min-w-9 rounded-lg px-2 text-xs font-bold transition ${item === page ? 'bg-primary-800 text-white' : 'text-ink-500 hover:bg-primary-50'}`} aria-current={item === page ? 'page' : undefined}>{item}</button>
        ))}
        <button type="button" disabled={page === pageCount} onClick={() => onPageChange(page + 1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-ink-500 transition hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Next page"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}
