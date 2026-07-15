import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, ImagePlus, Plus, Save, Trash2, Upload } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFieldClass, adminTextAreaClass } from '@/components/admin/AdminEditModal';
import { Panel, PanelHeader } from '@/components/admin/AdminUi';
import { destinations } from '@/data/destinations';
import { experiences } from '@/data/experiences';
import { loadAdminCreated, loadAdminDrafts, saveAdminDraft } from '@/lib/adminDrafts';
import type { Experience, MenuItem, ScheduleItem, ServiceItem } from '@/types';

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const emptyMenuItem: MenuItem = { name: { en: '', am: '' }, description: { en: '', am: '' } };
const emptyService: ServiceItem = { name: { en: '', am: '' }, durationMinutes: 60 };
const emptySchedule: ScheduleItem = { day: { en: '', am: '' }, time: '', title: { en: '', am: '' } };

export default function EditThingToDoPage() {
  const router = useRouter();
  const activityId = typeof router.query.id === 'string' ? router.query.id : undefined;
  const [item, setItem] = useState<Experience | null>(null);
  const [galleryUrl, setGalleryUrl] = useState('');
  const categories = Array.from(new Set(experiences.map((experience) => experience.category))).sort();

  useEffect(() => {
    if (!activityId) return;
    const source = experiences.find((entry) => entry.id === activityId)
      ?? loadAdminCreated<Experience>('experiences').find((entry) => entry.id === activityId);
    if (!source) return;
    const draft = loadAdminDrafts<Experience>('experiences')[source.id];
    setItem({ ...source, ...draft });
  }, [activityId]);

  async function uploadHero(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !item) return;
    setItem({ ...item, photo: await fileToDataUrl(file) });
  }

  async function uploadGallery(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length || !item) return;
    const images = await Promise.all(files.map(fileToDataUrl));
    setItem({ ...item, gallery: [...(item.gallery ?? []), ...images] });
    event.target.value = '';
  }

  async function uploadServiceImage(event: ChangeEvent<HTMLInputElement>, index: number) {
    const file = event.target.files?.[0];
    if (!file || !item) return;
    const photo = await fileToDataUrl(file);
    setItem({ ...item, services: (item.services ?? []).map((service, serviceIndex) => serviceIndex === index ? { ...service, photo } : service) });
  }

  function addGalleryUrl() {
    if (!item || !galleryUrl.trim()) return;
    setItem({ ...item, gallery: [...(item.gallery ?? []), galleryUrl.trim()] });
    setGalleryUrl('');
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!item) return;
    saveAdminDraft<Experience>('experiences', item.id, item);
    void router.push('/admin/experiences');
  }

  if (!item) return <AdminLayout title="Loading activity..." description="Opening the complete things-to-do editor."><div /></AdminLayout>;

  const gallery = item.gallery ?? [];
  const menu = item.menu ?? [];
  const services = item.services ?? [];
  const schedule = item.schedule ?? [];

  return (
    <AdminLayout title={`Edit ${item.name.en}`} description="Edit all activity content, images, offerings, schedules, and booking information." eyebrow="Complete things to do editor" actions={<Link href="/admin/experiences" className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-ink-600"><ArrowLeft size={16} /> Back</Link>}>
      <form onSubmit={save} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.62fr]">
          <Panel>
            <PanelHeader title="Core content" description="Bilingual titles, descriptions, category, and location" />
            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <label className="text-xs font-bold text-ink-500">English name<input value={item.name.en} onChange={(event) => setItem({ ...item, name: { ...item.name, en: event.target.value } })} required className={adminFieldClass} /></label>
              <label className="text-xs font-bold text-ink-500">Amharic name<input value={item.name.am} onChange={(event) => setItem({ ...item, name: { ...item.name, am: event.target.value } })} required className={adminFieldClass} /></label>
              <label className="text-xs font-bold text-ink-500">Destination<select value={item.destinationSlug} onChange={(event) => setItem({ ...item, destinationSlug: event.target.value })} className={adminFieldClass}>{destinations.map((destination) => <option key={destination.slug} value={destination.slug}>{destination.name}</option>)}</select></label>
              <label className="text-xs font-bold text-ink-500">Category<select value={item.category} onChange={(event) => setItem({ ...item, category: event.target.value })} className={adminFieldClass}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label className="text-xs font-bold text-ink-500">English short description<textarea value={item.description.en} onChange={(event) => setItem({ ...item, description: { ...item.description, en: event.target.value } })} required rows={4} className={adminTextAreaClass} /></label>
              <label className="text-xs font-bold text-ink-500">Amharic short description<textarea value={item.description.am} onChange={(event) => setItem({ ...item, description: { ...item.description, am: event.target.value } })} required rows={4} className={adminTextAreaClass} /></label>
              <label className="text-xs font-bold text-ink-500">English full description<textarea value={item.longDescription?.en ?? ''} onChange={(event) => setItem({ ...item, longDescription: { en: event.target.value, am: item.longDescription?.am ?? '' } })} rows={7} className={adminTextAreaClass} /></label>
              <label className="text-xs font-bold text-ink-500">Amharic full description<textarea value={item.longDescription?.am ?? ''} onChange={(event) => setItem({ ...item, longDescription: { en: item.longDescription?.en ?? '', am: event.target.value } })} rows={7} className={adminTextAreaClass} /></label>
              <label className="text-xs font-bold text-ink-500">English address<input value={item.address?.en ?? ''} onChange={(event) => setItem({ ...item, address: { en: event.target.value, am: item.address?.am ?? '' } })} className={adminFieldClass} /></label>
              <label className="text-xs font-bold text-ink-500">Amharic address<input value={item.address?.am ?? ''} onChange={(event) => setItem({ ...item, address: { en: item.address?.en ?? '', am: event.target.value } })} className={adminFieldClass} /></label>
            </div>
          </Panel>

          <Panel className="h-fit">
            <PanelHeader title="Hero image" description="Primary card and page-header image" />
            <div className="p-5">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100"><img src={item.photo} alt="" className="h-full w-full object-cover" /></div>
              <label className="mt-4 block text-xs font-bold text-ink-500">Image URL<input value={item.photo} onChange={(event) => setItem({ ...item, photo: event.target.value })} required className={adminFieldClass} /></label>
              <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary-300 bg-primary-50 px-4 py-3 text-xs font-bold text-primary-700"><Upload size={15} /> Upload hero image<input type="file" accept="image/*" className="sr-only" onChange={(event) => void uploadHero(event)} /></label>
            </div>
          </Panel>
        </div>

        <Panel>
          <PanelHeader title="Image gallery" description="Add activity images using URLs or device uploads" />
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row"><input value={galleryUrl} onChange={(event) => setGalleryUrl(event.target.value)} placeholder="Paste an image URL" className={`${adminFieldClass} mt-0 flex-1`} /><button type="button" onClick={addGalleryUrl} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-800 px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} /> Add URL</button><label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-bold text-ink-600"><Upload size={16} /> Upload images<input type="file" multiple accept="image/*" className="sr-only" onChange={(event) => void uploadGallery(event)} /></label></div>
            {gallery.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{gallery.map((photo, index) => <div key={`${photo}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100"><img src={photo} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => setItem({ ...item, gallery: gallery.filter((_, photoIndex) => photoIndex !== index) })} className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-danger-500 opacity-0 shadow-soft transition group-hover:opacity-100" aria-label="Remove image"><Trash2 size={15} /></button></div>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-neutral-300 p-10 text-center text-sm text-ink-400">No gallery images yet.</div>}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Menu and offerings" description="Food, drink, tickets, products, or other priced items" action={<button type="button" onClick={() => setItem({ ...item, menu: [...menu, { ...emptyMenuItem, name: { ...emptyMenuItem.name }, description: { ...emptyMenuItem.description! } }] })} className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-2 text-xs font-bold text-primary-700"><Plus size={14} /> Add item</button>} />
          <div className="space-y-4 p-5 sm:p-6">
            {menu.map((menuItem, index) => <div key={index} className="grid gap-4 rounded-card border border-neutral-200 bg-neutral-100/40 p-4 sm:grid-cols-2 lg:grid-cols-4"><label className="text-xs font-bold text-ink-500">English name<input value={menuItem.name.en} onChange={(event) => setItem({ ...item, menu: menu.map((entry, entryIndex) => entryIndex === index ? { ...entry, name: { ...entry.name, en: event.target.value } } : entry) })} className={adminFieldClass} /></label><label className="text-xs font-bold text-ink-500">Amharic name<input value={menuItem.name.am} onChange={(event) => setItem({ ...item, menu: menu.map((entry, entryIndex) => entryIndex === index ? { ...entry, name: { ...entry.name, am: event.target.value } } : entry) })} className={adminFieldClass} /></label><label className="text-xs font-bold text-ink-500">Price from (ETB)<input type="number" min="0" value={menuItem.priceFromEtb ?? ''} onChange={(event) => setItem({ ...item, menu: menu.map((entry, entryIndex) => entryIndex === index ? { ...entry, priceFromEtb: event.target.value ? Number(event.target.value) : undefined } : entry) })} className={adminFieldClass} /></label><button type="button" onClick={() => setItem({ ...item, menu: menu.filter((_, entryIndex) => entryIndex !== index) })} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-danger-500/20 text-xs font-bold text-danger-500"><Trash2 size={14} /> Remove</button><label className="text-xs font-bold text-ink-500 sm:col-span-2">English description<textarea value={menuItem.description?.en ?? ''} onChange={(event) => setItem({ ...item, menu: menu.map((entry, entryIndex) => entryIndex === index ? { ...entry, description: { en: event.target.value, am: entry.description?.am ?? '' } } : entry) })} rows={3} className={adminTextAreaClass} /></label><label className="text-xs font-bold text-ink-500 sm:col-span-2">Amharic description<textarea value={menuItem.description?.am ?? ''} onChange={(event) => setItem({ ...item, menu: menu.map((entry, entryIndex) => entryIndex === index ? { ...entry, description: { en: entry.description?.en ?? '', am: event.target.value } } : entry) })} rows={3} className={adminTextAreaClass} /></label></div>)}
            {!menu.length && <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-ink-400">No menu items. Add one if this activity sells food, tickets, or products.</div>}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Services" description="Bookable services, treatments, tours, or packages" action={<button type="button" onClick={() => setItem({ ...item, services: [...services, { ...emptyService, name: { ...emptyService.name } }] })} className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-2 text-xs font-bold text-primary-700"><Plus size={14} /> Add service</button>} />
          <div className="space-y-4 p-5 sm:p-6">
            {services.map((service, index) => <div key={index} className="grid gap-4 rounded-card border border-neutral-200 bg-neutral-100/40 p-4 sm:grid-cols-2 lg:grid-cols-5"><label className="text-xs font-bold text-ink-500">English name<input value={service.name.en} onChange={(event) => setItem({ ...item, services: services.map((entry, entryIndex) => entryIndex === index ? { ...entry, name: { ...entry.name, en: event.target.value } } : entry) })} className={adminFieldClass} /></label><label className="text-xs font-bold text-ink-500">Amharic name<input value={service.name.am} onChange={(event) => setItem({ ...item, services: services.map((entry, entryIndex) => entryIndex === index ? { ...entry, name: { ...entry.name, am: event.target.value } } : entry) })} className={adminFieldClass} /></label><label className="text-xs font-bold text-ink-500">Duration (minutes)<input type="number" min="0" value={service.durationMinutes ?? ''} onChange={(event) => setItem({ ...item, services: services.map((entry, entryIndex) => entryIndex === index ? { ...entry, durationMinutes: event.target.value ? Number(event.target.value) : undefined } : entry) })} className={adminFieldClass} /></label><label className="text-xs font-bold text-ink-500">Price from (ETB)<input type="number" min="0" value={service.priceFromEtb ?? ''} onChange={(event) => setItem({ ...item, services: services.map((entry, entryIndex) => entryIndex === index ? { ...entry, priceFromEtb: event.target.value ? Number(event.target.value) : undefined } : entry) })} className={adminFieldClass} /></label><button type="button" onClick={() => setItem({ ...item, services: services.filter((_, entryIndex) => entryIndex !== index) })} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-danger-500/20 text-xs font-bold text-danger-500"><Trash2 size={14} /> Remove</button><div className="sm:col-span-2 lg:col-span-5"><div className="flex flex-col gap-2 sm:flex-row"><input value={service.photo ?? ''} onChange={(event) => setItem({ ...item, services: services.map((entry, entryIndex) => entryIndex === index ? { ...entry, photo: event.target.value } : entry) })} placeholder="Service image URL" className={`${adminFieldClass} mt-0 flex-1`} /><label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-bold text-ink-600"><ImagePlus size={14} /> Upload<input type="file" accept="image/*" className="sr-only" onChange={(event) => void uploadServiceImage(event, index)} /></label></div>{service.photo && <img src={service.photo} alt="" className="mt-3 h-24 w-32 rounded-lg object-cover" />}</div></div>)}
            {!services.length && <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-ink-400">No services have been added.</div>}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Schedule" description="Recurring opening times, performances, or tour departures" action={<button type="button" onClick={() => setItem({ ...item, schedule: [...schedule, { ...emptySchedule, day: { ...emptySchedule.day }, title: { ...emptySchedule.title! } }] })} className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-2 text-xs font-bold text-primary-700"><Plus size={14} /> Add time</button>} />
          <div className="space-y-4 p-5 sm:p-6">{schedule.map((slot, index) => <div key={index} className="grid gap-4 rounded-card border border-neutral-200 bg-neutral-100/40 p-4 sm:grid-cols-2 lg:grid-cols-5"><label className="text-xs font-bold text-ink-500">Day — English<input value={slot.day.en} onChange={(event) => setItem({ ...item, schedule: schedule.map((entry, entryIndex) => entryIndex === index ? { ...entry, day: { ...entry.day, en: event.target.value } } : entry) })} className={adminFieldClass} /></label><label className="text-xs font-bold text-ink-500">Day — Amharic<input value={slot.day.am} onChange={(event) => setItem({ ...item, schedule: schedule.map((entry, entryIndex) => entryIndex === index ? { ...entry, day: { ...entry.day, am: event.target.value } } : entry) })} className={adminFieldClass} /></label><label className="text-xs font-bold text-ink-500">Time<input value={slot.time} onChange={(event) => setItem({ ...item, schedule: schedule.map((entry, entryIndex) => entryIndex === index ? { ...entry, time: event.target.value } : entry) })} placeholder="09:00 – 17:00" className={adminFieldClass} /></label><label className="text-xs font-bold text-ink-500">Title<input value={slot.title?.en ?? ''} onChange={(event) => setItem({ ...item, schedule: schedule.map((entry, entryIndex) => entryIndex === index ? { ...entry, title: { en: event.target.value, am: entry.title?.am ?? '' } } : entry) })} className={adminFieldClass} /></label><button type="button" onClick={() => setItem({ ...item, schedule: schedule.filter((_, entryIndex) => entryIndex !== index) })} className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-danger-500/20 text-xs font-bold text-danger-500"><Trash2 size={14} /> Remove</button></div>)}{!schedule.length && <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-ink-400">No schedule has been added.</div>}</div>
        </Panel>

        <Panel>
          <PanelHeader title="Booking settings" description="External booking availability and partner information" />
          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <label className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 p-4 text-sm font-bold text-ink-700 sm:col-span-2">Allow external booking<button type="button" onClick={() => setItem({ ...item, bookable: !item.bookable })} className={`relative h-7 w-12 rounded-pill transition ${item.bookable ? 'bg-success-500' : 'bg-neutral-300'}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${item.bookable ? 'left-6' : 'left-1'}`} /></button></label>
            <label className="text-xs font-bold text-ink-500">Booking URL<input type="url" value={item.externalBookingUrl ?? ''} onChange={(event) => setItem({ ...item, externalBookingUrl: event.target.value })} className={adminFieldClass} /></label>
            <label className="text-xs font-bold text-ink-500">Booking website name<input value={item.externalSiteName ?? ''} onChange={(event) => setItem({ ...item, externalSiteName: event.target.value })} className={adminFieldClass} /></label>
          </div>
        </Panel>

        <div className="sticky bottom-4 z-20 flex justify-end gap-2 rounded-card-lg border border-neutral-200 bg-white/95 p-4 shadow-lift backdrop-blur"><Link href="/admin/experiences" className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-bold text-ink-500">Cancel</Link><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-primary-800 px-5 py-2.5 text-sm font-bold text-white"><Save size={16} /> Save all changes</button></div>
      </form>
    </AdminLayout>
  );
}
