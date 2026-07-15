import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, ImagePlus, Plus, Save, Trash2, Upload } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFieldClass, adminTextAreaClass } from '@/components/admin/AdminEditModal';
import { Panel, PanelHeader } from '@/components/admin/AdminUi';
import { destinations } from '@/data/destinations';
import { getDestinationGuide } from '@/data/destinationGuides';
import { loadAdminCreated, loadAdminDrafts, saveAdminDraft } from '@/lib/adminDrafts';
import type { Destination, DestinationGuide } from '@/types';

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function EditDestinationPage() {
  const router = useRouter();
  const destinationId = typeof router.query.id === 'string' ? router.query.id : undefined;
  const [destination, setDestination] = useState<Destination | null>(null);
  const [guide, setGuide] = useState<DestinationGuide | null>(null);
  const [galleryUrl, setGalleryUrl] = useState('');

  useEffect(() => {
    if (!destinationId) return;
    const source = destinations.find((entry) => entry.id === destinationId)
      ?? loadAdminCreated<Destination>('destinations').find((entry) => entry.id === destinationId);
    if (!source) return;
    const destinationDraft = loadAdminDrafts<Destination>('destinations')[source.id];
    const guideDraft = loadAdminDrafts<DestinationGuide>('destinationGuides')[source.id];
    setDestination({ ...source, ...destinationDraft });
    setGuide({ sections: [], gallery: [], ...getDestinationGuide(source.slug), ...guideDraft });
  }, [destinationId]);

  async function uploadSingle(event: ChangeEvent<HTMLInputElement>, target: 'heroPhoto' | 'cardPhoto') {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setDestination((current) => current ? { ...current, [target]: dataUrl } : current);
  }

  async function uploadSectionImage(event: ChangeEvent<HTMLInputElement>, index: number) {
    const file = event.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setGuide((current) => current ? { ...current, sections: current.sections.map((section, sectionIndex) => sectionIndex === index ? { ...section, photo: dataUrl } : section) } : current);
  }

  async function uploadGallery(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    const dataUrls = await Promise.all(files.map(fileToDataUrl));
    setGuide((current) => current ? { ...current, gallery: [...current.gallery, ...dataUrls] } : current);
    event.target.value = '';
  }

  function addGalleryUrl() {
    const value = galleryUrl.trim();
    if (!value) return;
    setGuide((current) => current ? { ...current, gallery: [...current.gallery, value] } : current);
    setGalleryUrl('');
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!destination || !guide) return;
    const form = new FormData(event.currentTarget);
    const updatedGuide: DestinationGuide = {
      gallery: guide.gallery,
      sections: guide.sections.map((section, index) => ({
        ...section,
        title: {
          en: String(form.get(`section-${index}-title-en`)),
          am: String(form.get(`section-${index}-title-am`)),
        },
        body: {
          en: String(form.get(`section-${index}-body-en`)),
          am: String(form.get(`section-${index}-body-am`)),
        },
      })),
    };

    saveAdminDraft<Destination>('destinations', destination.id, {
      name: String(form.get('name')),
      region: String(form.get('region')),
      heroPhoto: destination.heroPhoto,
      cardPhoto: destination.cardPhoto,
      tagline: { en: String(form.get('tagline-en')), am: String(form.get('tagline-am')) },
      guide: { en: String(form.get('guide-en')), am: String(form.get('guide-am')) },
      bestTime: { en: String(form.get('bestTime-en')), am: String(form.get('bestTime-am')) },
      coords: { x: Number(form.get('coord-x')), y: Number(form.get('coord-y')) },
    });
    saveAdminDraft<DestinationGuide>('destinationGuides', destination.id, updatedGuide);
    void router.push('/admin/destinations');
  }

  if (!destination || !guide) return <AdminLayout title="Loading destination..." description="Opening the complete destination editor."><div /></AdminLayout>;

  return (
    <AdminLayout title={`Edit ${destination.name}`} description="Edit all destination content, guide sections, cover images, and gallery photography." eyebrow="Complete destination editor" actions={<Link href="/admin/destinations" className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-ink-600"><ArrowLeft size={16} /> Back</Link>}>
      <form onSubmit={save} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_0.62fr]">
          <Panel>
            <PanelHeader title="Destination content" description="English and Amharic copy used on public pages" />
            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <label className="text-xs font-bold text-ink-500">Destination name<input name="name" defaultValue={destination.name} required className={adminFieldClass} /></label>
              <label className="text-xs font-bold text-ink-500">Region<input name="region" defaultValue={destination.region} required className={adminFieldClass} /></label>
              <label className="text-xs font-bold text-ink-500">English tagline<textarea name="tagline-en" defaultValue={destination.tagline.en} required rows={3} className={adminTextAreaClass} /></label>
              <label className="text-xs font-bold text-ink-500">Amharic tagline<textarea name="tagline-am" defaultValue={destination.tagline.am} required rows={3} className={adminTextAreaClass} /></label>
              <label className="text-xs font-bold text-ink-500">English guide<textarea name="guide-en" defaultValue={destination.guide.en} required rows={7} className={adminTextAreaClass} /></label>
              <label className="text-xs font-bold text-ink-500">Amharic guide<textarea name="guide-am" defaultValue={destination.guide.am} required rows={7} className={adminTextAreaClass} /></label>
              <label className="text-xs font-bold text-ink-500">Best time — English<input name="bestTime-en" defaultValue={destination.bestTime.en} required className={adminFieldClass} /></label>
              <label className="text-xs font-bold text-ink-500">Best time — Amharic<input name="bestTime-am" defaultValue={destination.bestTime.am} required className={adminFieldClass} /></label>
              <label className="text-xs font-bold text-ink-500">Map X coordinate<input name="coord-x" type="number" min="0" max="100" defaultValue={destination.coords.x} required className={adminFieldClass} /></label>
              <label className="text-xs font-bold text-ink-500">Map Y coordinate<input name="coord-y" type="number" min="0" max="100" defaultValue={destination.coords.y} required className={adminFieldClass} /></label>
            </div>
          </Panel>

          <div className="space-y-6">
            {(['heroPhoto', 'cardPhoto'] as const).map((field) => (
              <Panel key={field}>
                <PanelHeader title={field === 'heroPhoto' ? 'Hero image' : 'Card image'} description={field === 'heroPhoto' ? 'Large destination header' : 'Destination grid thumbnail'} />
                <div className="p-5">
                  <div className="aspect-[16/9] overflow-hidden rounded-xl bg-neutral-100"><img src={destination[field]} alt="" className="h-full w-full object-cover" /></div>
                  <label className="mt-4 block text-xs font-bold text-ink-500">Image URL<input value={destination[field]} onChange={(event) => setDestination({ ...destination, [field]: event.target.value })} className={adminFieldClass} /></label>
                  <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary-300 bg-primary-50 px-4 py-3 text-xs font-bold text-primary-700 hover:bg-primary-100"><Upload size={15} /> Upload image<input type="file" accept="image/*" className="sr-only" onChange={(event) => void uploadSingle(event, field)} /></label>
                </div>
              </Panel>
            ))}
          </div>
        </div>

        <Panel>
          <PanelHeader title="Destination guide sections" description="Edit every story block and its related image" />
          <div className="space-y-5 p-5 sm:p-6">
            {guide.sections.map((section, index) => (
              <section key={index} className="grid gap-5 rounded-card border border-neutral-200 bg-neutral-100/45 p-4 lg:grid-cols-[0.68fr_1fr]">
                <div>
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-200"><img src={section.photo} alt="" className="h-full w-full object-cover" /></div>
                  <label className="mt-3 block text-xs font-bold text-ink-500">Section image URL<input value={section.photo} onChange={(event) => setGuide({ ...guide, sections: guide.sections.map((item, itemIndex) => itemIndex === index ? { ...item, photo: event.target.value } : item) })} className={adminFieldClass} /></label>
                  <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary-300 bg-white px-4 py-3 text-xs font-bold text-primary-700"><ImagePlus size={15} /> Replace image<input type="file" accept="image/*" className="sr-only" onChange={(event) => void uploadSectionImage(event, index)} /></label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-xs font-bold text-ink-500">English title<input name={`section-${index}-title-en`} defaultValue={section.title.en} required className={adminFieldClass} /></label>
                  <label className="text-xs font-bold text-ink-500">Amharic title<input name={`section-${index}-title-am`} defaultValue={section.title.am} required className={adminFieldClass} /></label>
                  <label className="text-xs font-bold text-ink-500">English body<textarea name={`section-${index}-body-en`} defaultValue={section.body.en} required rows={8} className={adminTextAreaClass} /></label>
                  <label className="text-xs font-bold text-ink-500">Amharic body<textarea name={`section-${index}-body-am`} defaultValue={section.body.am} required rows={8} className={adminTextAreaClass} /></label>
                </div>
              </section>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Destination gallery" description="Add images by URL or upload files from your device" />
          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input value={galleryUrl} onChange={(event) => setGalleryUrl(event.target.value)} placeholder="Paste an image URL" className={`${adminFieldClass} mt-0 flex-1`} />
              <button type="button" onClick={addGalleryUrl} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-800 px-4 py-2.5 text-sm font-bold text-white"><Plus size={16} /> Add URL</button>
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-ink-600 hover:bg-neutral-100"><Upload size={16} /> Upload<input type="file" multiple accept="image/*" className="sr-only" onChange={(event) => void uploadGallery(event)} /></label>
            </div>
            {guide.gallery.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {guide.gallery.map((photo, index) => (
                  <div key={`${photo}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100"><img src={photo} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => setGuide({ ...guide, gallery: guide.gallery.filter((_, itemIndex) => itemIndex !== index) })} className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-danger-500 opacity-0 shadow-soft transition group-hover:opacity-100" aria-label="Remove image"><Trash2 size={15} /></button></div>
                ))}
              </div>
            ) : <div className="mt-5 rounded-xl border border-dashed border-neutral-300 p-10 text-center text-sm text-ink-400">No gallery images yet.</div>}
          </div>
        </Panel>

        <div className="sticky bottom-4 z-20 flex justify-end gap-2 rounded-card-lg border border-neutral-200 bg-white/95 p-4 shadow-lift backdrop-blur"><Link href="/admin/destinations" className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-bold text-ink-500">Cancel</Link><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-primary-800 px-5 py-2.5 text-sm font-bold text-white"><Save size={16} /> Save all changes</button></div>
      </form>
    </AdminLayout>
  );
}
