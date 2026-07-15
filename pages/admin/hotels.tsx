import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, MoreHorizontal, Plus, Search, Star } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { AdminButton, Panel, StatusPill, TableEmpty } from '@/components/admin/AdminUi';
import { destinations } from '@/data/destinations';
import { hotels } from '@/data/hotels';
import { loadAdminDrafts } from '@/lib/adminDrafts';
import type { Hotel } from '@/types';

type Filter = 'all' | 'active' | 'draft';
const PAGE_SIZE = 7;

export default function AdminHotelsPage() {
  const [items, setItems] = useState<Hotel[]>(hotels);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);
  const [activeIds, setActiveIds] = useState(() => new Set(hotels.filter((hotel) => hotel.bookingActive).map((hotel) => hotel.id)));

  const filtered = useMemo(() => items.filter((hotel) => {
    const destination = destinations.find((item) => item.slug === hotel.destinationSlug)?.name ?? '';
    const matchesQuery = `${hotel.name} ${destination} ${hotel.propertyType}`.toLowerCase().includes(query.toLowerCase());
    const active = activeIds.has(hotel.id);
    return matchesQuery && (filter === 'all' || (filter === 'active' ? active : !active));
  }), [activeIds, filter, items, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [filter, query]);
  useEffect(() => {
    const drafts = loadAdminDrafts<Hotel>('hotels');
    setItems((current) => current.map((item) => ({ ...item, ...drafts[item.id] })));
  }, []);

  function toggleActive(id: string) {
    setActiveIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <AdminLayout
      title="Hotels"
      description="Review property details, pricing, booking status, and photography used throughout Ethiopidia."
      eyebrow="Inventory"
      actions={<AdminButton><Plus size={16} /> Add hotel</AdminButton>}
    >
      <Panel>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search hotels..." className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'active', 'draft'] as Filter[]).map((item) => (
              <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-pill px-3.5 py-2 text-xs font-bold capitalize transition ${filter === item ? 'bg-primary-800 text-white' : 'bg-neutral-100 text-ink-500 hover:bg-primary-50'}`}>{item}</button>
            ))}
            <span className="ml-2 text-xs font-semibold text-ink-400">{filtered.length} results</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left">
            <thead className="bg-neutral-100/80 text-[10px] uppercase tracking-[0.14em] text-ink-400">
              <tr><th className="px-5 py-3.5 font-bold">Property</th><th className="px-4 py-3.5 font-bold">Location</th><th className="px-4 py-3.5 font-bold">Rating</th><th className="px-4 py-3.5 font-bold">From</th><th className="px-4 py-3.5 font-bold">Status</th><th className="px-4 py-3.5 font-bold">Booking</th><th className="px-5 py-3.5 text-right font-bold">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {paginated.map((hotel) => {
                const destination = destinations.find((item) => item.slug === hotel.destinationSlug);
                const active = activeIds.has(hotel.id);
                return (
                  <tr key={hotel.id} className="transition hover:bg-primary-50/40">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100"><Image src={hotel.photos[0]} alt="" fill sizes="56px" className="object-cover" /></div><div><p className="max-w-[250px] truncate text-sm font-bold text-primary-900">{hotel.name}</p><p className="mt-1 text-xs text-ink-400">{hotel.propertyType} · {hotel.starRating} star</p></div></div></td>
                    <td className="px-4 py-4"><p className="text-sm font-semibold text-ink-600">{destination?.name}</p><p className="mt-1 max-w-[180px] truncate text-xs text-ink-400">{hotel.neighborhood.en}</p></td>
                    <td className="px-4 py-4"><span className="inline-flex items-center gap-1 text-sm font-bold text-ink-700"><Star size={13} className="fill-amber-500 text-amber-500" /> {hotel.guestRating}</span><p className="mt-1 text-xs text-ink-400">{hotel.reviewCount} reviews</p></td>
                    <td className="px-4 py-4"><p className="text-sm font-bold text-ink-700">ETB {hotel.priceFromEtb.toLocaleString()}</p><p className="mt-1 text-xs text-ink-400">per night</p></td>
                    <td className="px-4 py-4"><StatusPill tone={active ? 'green' : 'amber'}>{active ? 'Published' : 'Draft'}</StatusPill></td>
                    <td className="px-4 py-4"><button type="button" onClick={() => toggleActive(hotel.id)} className={`relative h-6 w-11 rounded-pill transition ${active ? 'bg-success-500' : 'bg-neutral-300'}`} aria-label={`Toggle ${hotel.name} booking`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${active ? 'left-[22px]' : 'left-0.5'}`} /></button></td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-1"><Link href={`/hotels/${hotel.slug}`} className="rounded-lg p-2 text-ink-400 hover:bg-white hover:text-primary-700" aria-label="Preview"><Eye size={16} /></Link><button className="rounded-lg p-2 text-ink-400 hover:bg-white hover:text-primary-700" aria-label="More"><MoreHorizontal size={16} /></button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <TableEmpty message="No hotels match the current filters." />}
        </div>
        <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </Panel>
    </AdminLayout>
  );
}
