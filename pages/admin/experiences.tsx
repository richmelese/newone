import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Edit3, Eye, ImageIcon, MapPin, Plus, Search } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminPagination from '@/components/admin/AdminPagination';
import { AdminButton, Panel, StatusPill, TableEmpty } from '@/components/admin/AdminUi';
import { destinations } from '@/data/destinations';
import { experiences } from '@/data/experiences';
import { loadAdminCreated, loadAdminDrafts, saveAdminCreated } from '@/lib/adminDrafts';
import { seededPhoto } from '@/lib/images';
import type { Experience } from '@/types';

const PAGE_SIZE = 9;

export default function AdminExperiencesPage() {
  const router = useRouter();
  const [items, setItems] = useState<Experience[]>(experiences);
  const categories = ['All', ...Array.from(new Set(items.map((item) => item.category))).sort()];
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => items.filter((experience) => {
    const destination = destinations.find((item) => item.slug === experience.destinationSlug)?.name ?? '';
    return (category === 'All' || experience.category === category)
      && `${experience.name.en} ${destination}`.toLowerCase().includes(query.toLowerCase());
  }), [category, items, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [category, query]);
  useEffect(() => {
    const created = loadAdminCreated<Experience>('experiences');
    const drafts = loadAdminDrafts<Experience>('experiences');
    const allItems = [...experiences, ...created.filter((item) => !experiences.some((experience) => experience.id === item.id))];
    setItems(allItems.map((item) => ({ ...item, ...drafts[item.id] })));
  }, []);

  function createActivity() {
    const stamp = Date.now();
    const id = `activity-${stamp}`;
    const activity: Experience = {
      id,
      destinationSlug: destinations[0].slug,
      name: { en: 'Untitled activity', am: '' },
      description: { en: '', am: '' },
      photo: seededPhoto(id, 1200, 800),
      category: 'Culture',
      gallery: [],
      bookable: false,
    };
    saveAdminCreated('experiences', activity);
    void router.push(`/admin/experiences/${id}/edit`);
  }

  return (
    <AdminLayout
      title="Things to do"
      description="Curate the activities, cultural moments, food, history, and local stories shown to travelers."
      eyebrow="Things to do catalog"
      actions={<AdminButton onClick={createActivity}><Plus size={16} /> New activity</AdminButton>}
    >
      <Panel>
        <div className="border-b border-neutral-200 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search things to do..." className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-9 pr-3 text-sm outline-none focus:border-primary-300 focus:bg-white" /></div>
            <p className="text-xs font-semibold text-ink-400">{filtered.length} of {items.length} activities</p>
          </div>
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-pill px-3.5 py-2 text-xs font-bold transition ${category === item ? 'bg-primary-800 text-white' : 'bg-neutral-100 text-ink-500 hover:bg-primary-50'}`}>{item}</button>)}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 p-4 md:grid-cols-2 2xl:grid-cols-3 sm:p-5">
            {paginated.map((experience) => {
              const destination = destinations.find((item) => item.slug === experience.destinationSlug);
              return (
                <article key={experience.id} className="flex gap-4 rounded-card border border-neutral-200 p-3 transition hover:border-primary-200 hover:shadow-soft">
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-36 sm:w-36">
                    <Image src={experience.photo} alt={experience.name.en} fill sizes="144px" className="object-cover" />
                    {experience.gallery?.length ? <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-pill bg-primary-900/75 px-2 py-1 text-[9px] font-bold text-white backdrop-blur"><ImageIcon size={10} /> {experience.gallery.length + 1}</span> : null}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col py-1">
                    <div className="flex items-start justify-between gap-2"><StatusPill tone="blue">{experience.category}</StatusPill><StatusPill tone="green">Published</StatusPill></div>
                    <h2 className="mt-3 line-clamp-2 font-heading text-base font-extrabold text-primary-900">{experience.name.en}</h2>
                    <p className="mt-1 flex items-center gap-1 text-xs text-ink-400"><MapPin size={11} /> {destination?.name}</p>
                    <div className="mt-auto flex gap-2 pt-3">
                      <Link href={`/admin/experiences/${experience.id}/edit`} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-800 px-2 py-2 text-[11px] font-bold text-white"><Edit3 size={12} /> Edit</Link>
                      <Link href={`/experiences/${experience.id}`} className="flex items-center justify-center rounded-lg border border-neutral-200 px-3 text-ink-500 hover:bg-neutral-100" aria-label="Preview"><Eye size={14} /></Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : <TableEmpty message="No activities match this category and search." />}
        <AdminPagination page={page} pageCount={pageCount} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </Panel>
    </AdminLayout>
  );
}
