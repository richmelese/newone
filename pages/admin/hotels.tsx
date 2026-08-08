import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle, Building2, Eye, EyeOff, MoonStar, MoreHorizontal, Palette, Plane, Plus, Search, Sparkles, Star, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { AdminButton, Panel, StatusPill, TableEmpty } from '@/components/admin/AdminUi';
import { destinations } from '@/data/destinations';
import { hotels } from '@/data/hotels';
import { experiences, getExperienceFromPrice } from '@/data/experiences';
import { getExperienceRating } from '@/lib/experienceMock';
import { loadAdminCreated, loadAdminDrafts } from '@/lib/adminDrafts';
import type { Experience, Hotel } from '@/types';

type StatusFilter = 'all' | 'visible' | 'hidden';
type PropertyTab = 'hotels' | 'beauty' | 'travel' | 'art' | 'nightlife';

type PropertyRow = {
  id: string;
  tab: PropertyTab;
  name: string;
  typeLabel: string;
  destinationSlug: string;
  address: string;
  photo: string;
  rating: number;
  reviewCount: number;
  price?: number;
  priceUnit: string;
  previewHref: string;
  editHref: string;
};

const PAGE_SIZE = 7;
const VISIBILITY_STORAGE_KEY = 'ethiopidia-admin-property-visibility';
const DELETED_STORAGE_KEY = 'ethiopidia-admin-deleted-properties';
const TABS: { id: PropertyTab; label: string; singular: string; icon: typeof Building2 }[] = [
  { id: 'hotels', label: 'Hotels', singular: 'hotel', icon: Building2 },
  { id: 'beauty', label: 'Beauty salons', singular: 'beauty salon', icon: Sparkles },
  { id: 'travel', label: 'Travel', singular: 'travel property', icon: Plane },
  { id: 'art', label: 'Art galleries', singular: 'art gallery', icon: Palette },
  { id: 'nightlife', label: 'Nightlife', singular: 'nightlife venue', icon: MoonStar },
];

function experienceTab(category: string): PropertyTab {
  if (category === 'Beauty Salon') return 'beauty';
  if (category === 'Art Gallery') return 'art';
  if (category === 'Nightlife') return 'nightlife';
  return 'travel';
}

export default function AdminPropertiesPage() {
  const [hotelItems, setHotelItems] = useState<Hotel[]>(hotels);
  const [experienceItems, setExperienceItems] = useState<Experience[]>(experiences);
  const [tab, setTab] = useState<PropertyTab>('hotels');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [visibleIds, setVisibleIds] = useState(() => new Set([
    ...hotels.filter((hotel) => hotel.bookingActive).map((hotel) => hotel.id),
    ...experiences.map((experience) => experience.id),
  ]));
  const [pendingStatus, setPendingStatus] = useState<PropertyRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PropertyRow | null>(null);
  const [actionMenu, setActionMenu] = useState<{ property: PropertyRow; top: number; left: number } | null>(null);

  useEffect(() => {
    let deletedIds = new Set<string>();
    try {
      deletedIds = new Set(JSON.parse(window.localStorage.getItem(DELETED_STORAGE_KEY) ?? '[]') as string[]);
    } catch {
      deletedIds = new Set();
    }
    const hotelDrafts = loadAdminDrafts<Hotel>('hotels');
    setHotelItems((current) => current.filter((item) => !deletedIds.has(item.id)).map((item) => ({ ...item, ...hotelDrafts[item.id] })));

    const created = loadAdminCreated<Experience>('experiences');
    const experienceDrafts = loadAdminDrafts<Experience>('experiences');
    const allExperiences = [...experiences, ...created.filter((item) => !experiences.some((existing) => existing.id === item.id))]
      .filter((item) => !deletedIds.has(item.id))
      .map((item) => ({ ...item, ...experienceDrafts[item.id] }));
    setExperienceItems(allExperiences);
    try {
      const storedVisibility = window.localStorage.getItem(VISIBILITY_STORAGE_KEY);
      if (storedVisibility) setVisibleIds(new Set(JSON.parse(storedVisibility) as string[]));
      else setVisibleIds((current) => new Set([...current, ...allExperiences.map((item) => item.id)]));
    } catch {
      setVisibleIds((current) => new Set([...current, ...allExperiences.map((item) => item.id)]));
    }
  }, []);

  useEffect(() => {
    const closeMenu = () => setActionMenu(null);
    window.addEventListener('resize', closeMenu);
    window.addEventListener('scroll', closeMenu, true);
    return () => {
      window.removeEventListener('resize', closeMenu);
      window.removeEventListener('scroll', closeMenu, true);
    };
  }, []);

  const properties = useMemo<PropertyRow[]>(() => {
    const hotelRows: PropertyRow[] = hotelItems.map((hotel) => ({
      id: hotel.id,
      tab: 'hotels',
      name: hotel.name,
      typeLabel: `${hotel.propertyType} · ${hotel.starRating} star`,
      destinationSlug: hotel.destinationSlug,
      address: hotel.neighborhood.en,
      photo: hotel.photos[0],
      rating: hotel.guestRating,
      reviewCount: hotel.reviewCount,
      price: hotel.priceFromEtb,
      priceUnit: 'per night',
      previewHref: `/hotels/${hotel.slug}`,
      editHref: `/admin/hotels/${hotel.id}/edit`,
    }));

    const experienceRows: PropertyRow[] = experienceItems.map((experience) => {
      const rating = getExperienceRating(experience.id);
      return {
        id: experience.id,
        tab: experienceTab(experience.category),
        name: experience.name.en,
        typeLabel: experience.category,
        destinationSlug: experience.destinationSlug,
        address: experience.address?.en ?? experience.description.en,
        photo: experience.photo,
        rating: rating.guestRating,
        reviewCount: rating.reviewCount,
        price: getExperienceFromPrice(experience),
        priceUnit: experience.services?.length ? 'starting price' : 'from',
        previewHref: `/experiences/${experience.id}`,
        editHref: `/admin/experiences/${experience.id}/edit`,
      };
    });

    return [...hotelRows, ...experienceRows];
  }, [experienceItems, hotelItems]);

  const tabItems = properties.filter((property) => property.tab === tab);
  const filtered = tabItems.filter((property) => {
    const destination = destinations.find((item) => item.slug === property.destinationSlug)?.name ?? '';
    const matchesQuery = `${property.name} ${destination} ${property.typeLabel}`.toLowerCase().includes(query.toLowerCase());
    const visible = visibleIds.has(property.id);
    return matchesQuery && (filter === 'all' || (filter === 'visible' ? visible : !visible));
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeTab = TABS.find((item) => item.id === tab) ?? TABS[0];

  useEffect(() => setPage(1), [filter, query, tab]);

  function confirmStatusChange() {
    if (!pendingStatus) return;
    setVisibleIds((current) => {
      const next = new Set(current);
      if (next.has(pendingStatus.id)) next.delete(pendingStatus.id);
      else next.add(pendingStatus.id);
      window.localStorage.setItem(VISIBILITY_STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
    setPendingStatus(null);
  }

  function openActionMenu(event: React.MouseEvent<HTMLButtonElement>, property: PropertyRow) {
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 220;
    const left = Math.max(12, Math.min(window.innerWidth - menuWidth - 12, rect.right - menuWidth));
    const estimatedHeight = 96;
    const top = rect.bottom + estimatedHeight > window.innerHeight
      ? Math.max(12, rect.top - estimatedHeight - 6)
      : rect.bottom + 6;
    setActionMenu((current) => current?.property.id === property.id ? null : { property, top, left });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    if (pendingDelete.tab === 'hotels') setHotelItems((current) => current.filter((item) => item.id !== pendingDelete.id));
    else setExperienceItems((current) => current.filter((item) => item.id !== pendingDelete.id));

    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(window.localStorage.getItem(DELETED_STORAGE_KEY) ?? '[]') as string[];
    } catch {
      deletedIds = [];
    }
    window.localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(Array.from(new Set([...deletedIds, pendingDelete.id]))));
    setVisibleIds((current) => {
      const next = new Set(current);
      next.delete(pendingDelete.id);
      window.localStorage.setItem(VISIBILITY_STORAGE_KEY, JSON.stringify(Array.from(next)));
      return next;
    });
    setPendingDelete(null);
  }

  return (
    <AdminLayout
      title="Properties"
      description="Manage hotels, salons, travel experiences, galleries, and nightlife listings across Ethiopidia."
      eyebrow="Property inventory"
      actions={<AdminButton><Plus size={16} /> Add {activeTab.singular}</AdminButton>}
    >
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
        {TABS.map(({ id, label, icon: Icon }) => {
          const count = properties.filter((property) => property.tab === id).length;
          return (
            <button key={id} type="button" onClick={() => setTab(id)} className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${tab === id ? 'border-primary-800 bg-primary-800 text-white shadow-soft' : 'border-neutral-200 bg-white text-ink-600 hover:border-primary-200 hover:bg-primary-50'}`}>
              <Icon size={16} /> {label}<span className={`rounded-pill px-2 py-0.5 text-[10px] ${tab === id ? 'bg-white/15 text-white' : 'bg-neutral-100 text-ink-400'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <Panel>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${activeTab.label.toLowerCase()}...`} className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'visible', 'hidden'] as StatusFilter[]).map((item) => (
              <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-pill px-3.5 py-2 text-xs font-bold capitalize transition ${filter === item ? 'bg-primary-800 text-white' : 'bg-neutral-100 text-ink-500 hover:bg-primary-50'}`}>{item}</button>
            ))}
            <span className="ml-2 text-xs font-semibold text-ink-400">{filtered.length} results</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left">
            <thead className="bg-neutral-100/80 text-[10px] uppercase tracking-[0.14em] text-ink-400">
              <tr><th className="px-5 py-3.5 font-bold">Property</th><th className="px-4 py-3.5 font-bold">Location</th><th className="px-4 py-3.5 font-bold">Rating</th><th className="px-4 py-3.5 font-bold">From</th><th className="px-4 py-3.5 font-bold">Status</th><th className="px-5 py-3.5 text-right font-bold">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {paginated.map((property) => {
                const destination = destinations.find((item) => item.slug === property.destinationSlug);
                const visible = visibleIds.has(property.id);
                return (
                  <tr key={property.id} className="transition hover:bg-primary-50/40">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100"><Image src={property.photo} alt="" fill sizes="56px" className="object-cover" /></div><div><p className="max-w-[250px] truncate text-sm font-bold text-primary-900">{property.name}</p><p className="mt-1 text-xs text-ink-400">{property.typeLabel}</p></div></div></td>
                    <td className="px-4 py-4"><p className="text-sm font-semibold text-ink-600">{destination?.name}</p><p className="mt-1 max-w-[180px] truncate text-xs text-ink-400">{property.address}</p></td>
                    <td className="px-4 py-4"><span className="inline-flex items-center gap-1 text-sm font-bold text-ink-700"><Star size={13} className="fill-amber-500 text-amber-500" /> {property.rating}</span><p className="mt-1 text-xs text-ink-400">{property.reviewCount} reviews</p></td>
                    <td className="px-4 py-4">{property.price ? <><p className="text-sm font-bold text-ink-700">ETB {property.price.toLocaleString()}</p><p className="mt-1 text-xs text-ink-400">{property.priceUnit}</p></> : <span className="text-sm text-ink-300">—</span>}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setPendingStatus(property)} className={`relative h-6 w-11 shrink-0 rounded-pill transition ${visible ? 'bg-success-500' : 'bg-neutral-300'}`} aria-label={`${visible ? 'Hide' : 'Show'} ${property.name}`} aria-pressed={visible}>
                          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${visible ? 'left-[22px]' : 'left-0.5'}`} />
                        </button>
                        <StatusPill tone={visible ? 'green' : 'gray'}>{visible ? 'Visible' : 'Hidden'}</StatusPill>
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-1"><Link href={property.previewHref} className="rounded-lg p-2 text-ink-400 hover:bg-white hover:text-primary-700" aria-label={`Preview ${property.name}`}><Eye size={16} /></Link><button type="button" onClick={(event) => openActionMenu(event, property)} className="rounded-lg p-2 text-ink-400 hover:bg-white hover:text-primary-700" aria-label={`More actions for ${property.name}`} aria-expanded={actionMenu?.property.id === property.id}><MoreHorizontal size={16} /></button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <TableEmpty message={`No ${activeTab.label.toLowerCase()} match the current filters.`} />}
        </div>
        <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </Panel>

      {actionMenu && (
        <>
          <button type="button" className="fixed inset-0 z-40 cursor-default" onClick={() => setActionMenu(null)} aria-label="Close actions menu" />
          <div role="menu" aria-label={`Actions for ${actionMenu.property.name}`} className="fixed z-50 w-[220px] overflow-hidden rounded-xl border border-neutral-200 bg-white p-1.5 shadow-[0_18px_45px_rgba(11,36,54,0.2)]" style={{ top: actionMenu.top, left: actionMenu.left }}>
            <Link role="menuitem" href={actionMenu.property.editHref} onClick={() => setActionMenu(null)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-primary-50">Edit {TABS.find((item) => item.id === actionMenu.property.tab)?.singular}</Link>
            <button role="menuitem" type="button" onClick={() => { setPendingDelete(actionMenu.property); setActionMenu(null); }} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-danger-500 hover:bg-danger-500/5">Delete</button>
          </div>
        </>
      )}

      {pendingStatus && (() => {
        const willShow = !visibleIds.has(pendingStatus.id);
        return (
          <div className="fixed inset-0 z-50 grid place-items-center px-5 py-8" role="dialog" aria-modal="true" aria-labelledby="status-confirm-title">
            <button type="button" className="absolute inset-0 bg-primary-950/55 backdrop-blur-sm" onClick={() => setPendingStatus(null)} aria-label="Cancel status change" />
            <div className="relative w-full max-w-md rounded-card-lg border border-neutral-200 bg-white p-6 shadow-hero sm:p-7">
              <span className={`grid h-12 w-12 place-items-center rounded-full ${willShow ? 'bg-success-500/10 text-success-500' : 'bg-amber-500/10 text-amber-600'}`}>
                {willShow ? <Eye size={22} /> : <EyeOff size={22} />}
              </span>
              <h2 id="status-confirm-title" className="mt-4 font-heading text-xl font-extrabold text-primary-900">
                {willShow ? 'Make this property visible?' : 'Hide this property?'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink-500">
                {willShow
                  ? `${pendingStatus.name} will appear to visitors across Ethiopidia.`
                  : `${pendingStatus.name} will no longer appear to visitors, but its content will remain in the admin.`}
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <AdminButton secondary onClick={() => setPendingStatus(null)}>Cancel</AdminButton>
                <AdminButton onClick={confirmStatusChange}>
                  <AlertTriangle size={15} /> {willShow ? 'Confirm visible' : 'Confirm hidden'}
                </AdminButton>
              </div>
            </div>
          </div>
        );
      })()}

      {pendingDelete && (
        <div className="fixed inset-0 z-[70] grid place-items-center px-5 py-8" role="dialog" aria-modal="true" aria-labelledby="delete-property-title">
          <button type="button" className="absolute inset-0 bg-primary-950/55 backdrop-blur-sm" onClick={() => setPendingDelete(null)} aria-label="Cancel deletion" />
          <div className="relative w-full max-w-md rounded-card-lg border border-neutral-200 bg-white p-6 shadow-hero sm:p-7">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-danger-500/10 text-danger-500"><Trash2 size={22} /></span>
            <h2 id="delete-property-title" className="mt-4 font-heading text-xl font-extrabold text-primary-900">Delete this property?</h2>
            <p className="mt-2 text-sm leading-6 text-ink-500"><strong className="text-ink-700">{pendingDelete.name}</strong> will be removed from this property list. This action cannot be undone from the dashboard.</p>
            <div className="mt-6 flex justify-end gap-3">
              <AdminButton secondary onClick={() => setPendingDelete(null)}>Cancel</AdminButton>
              <button type="button" onClick={confirmDelete} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-danger-500 px-4 text-sm font-bold text-white transition hover:bg-danger-500/90"><Trash2 size={15} /> Delete property</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
