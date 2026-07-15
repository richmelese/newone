import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Edit3, Eye, ImageIcon, MapPin, MoreHorizontal, Plus, Search } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { AdminButton, Panel, StatusPill } from '@/components/admin/AdminUi';
import { destinations } from '@/data/destinations';
import { getExperiencesByDestination } from '@/data/experiences';
import { getHotelsByDestination } from '@/data/hotels';
import { loadAdminCreated, loadAdminDrafts, saveAdminCreated } from '@/lib/adminDrafts';
import { seededPhoto } from '@/lib/images';
import type { Destination } from '@/types';

const PAGE_SIZE = 6;

export default function AdminDestinationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Destination[]>(destinations);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const filtered = useMemo(
    () => items.filter((item) => `${item.name} ${item.region}`.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [query]);
  useEffect(() => {
    const created = loadAdminCreated<Destination>('destinations');
    const drafts = loadAdminDrafts<Destination>('destinations');
    const allItems = [...destinations, ...created.filter((item) => !destinations.some((destination) => destination.id === item.id))];
    setItems(allItems.map((item) => ({ ...item, ...drafts[item.id] })));
  }, []);

  function createDestination() {
    const stamp = Date.now();
    const id = `destination-${stamp}`;
    const destination: Destination = {
      id,
      slug: `new-destination-${stamp}`,
      name: 'Untitled destination',
      region: '',
      heroPhoto: seededPhoto(`${id}-hero`, 1600, 900),
      cardPhoto: seededPhoto(`${id}-card`, 900, 675),
      tagline: { en: '', am: '' },
      guide: { en: '', am: '' },
      bestTime: { en: '', am: '' },
      coords: { x: 50, y: 50 },
    };
    saveAdminCreated('destinations', destination);
    void router.push(`/admin/destinations/${id}/edit`);
  }

  return (
    <AdminLayout
      title="Destinations"
      description="Manage the cities and regions travelers discover across the public website."
      eyebrow="Content library"
      actions={<AdminButton onClick={createDestination}><Plus size={16} /> New destination</AdminButton>}
    >
      <Panel>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="relative w-full sm:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search destinations..." className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white" />
          </div>
          <p className="text-xs font-semibold text-ink-400">Showing {filtered.length} of {items.length} destinations</p>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
          {paginated.map((destination) => {
            const hotelCount = getHotelsByDestination(destination.slug).length;
            const experienceCount = getExperiencesByDestination(destination.slug).length;
            return (
              <article key={destination.id} className="group overflow-hidden rounded-card-lg border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-lift">
                <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                  <Image src={destination.cardPhoto} alt={destination.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/65 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3"><StatusPill tone="green"><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success-500" /> Published</span></StatusPill></div>
                  <div className="absolute right-3 top-3"><button className="rounded-lg bg-white/90 p-2 text-ink-600 shadow-soft backdrop-blur" aria-label="More options"><MoreHorizontal size={17} /></button></div>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h2 className="font-heading text-xl font-extrabold">{destination.name}</h2>
                    <p className="mt-1 flex items-center gap-1 text-xs text-white/80"><MapPin size={12} /> {destination.region}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-ink-500">{destination.tagline.en}</p>
                  <div className="mt-4 grid grid-cols-3 divide-x divide-neutral-200 rounded-xl bg-neutral-100 py-3 text-center">
                    <div><p className="font-heading text-lg font-extrabold text-primary-900">{hotelCount}</p><p className="text-[10px] font-semibold text-ink-400">Hotels</p></div>
                    <div><p className="font-heading text-lg font-extrabold text-primary-900">{experienceCount}</p><p className="text-[10px] font-semibold text-ink-400">Things to do</p></div>
                    <div><p className="font-heading text-lg font-extrabold text-primary-900">2</p><p className="text-[10px] font-semibold text-ink-400">Photos</p></div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/admin/destinations/${destination.id}/edit`} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-800 px-3 py-2.5 text-xs font-bold text-white hover:bg-primary-700"><Edit3 size={14} /> Edit</Link>
                    <Link href={`/destinations/${destination.slug}`} className="flex items-center justify-center rounded-xl border border-neutral-200 px-3 text-ink-500 hover:bg-neutral-100" aria-label={`Preview ${destination.name}`}><Eye size={16} /></Link>
                    <button type="button" className="flex items-center justify-center rounded-xl border border-neutral-200 px-3 text-ink-500 hover:bg-neutral-100" aria-label="Manage images"><ImageIcon size={16} /></button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </Panel>
    </AdminLayout>
  );
}
