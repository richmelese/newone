import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Save, Star } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminFieldClass, adminTextAreaClass } from '@/components/admin/AdminEditModal';
import { Panel, PanelHeader, StatusPill } from '@/components/admin/AdminUi';
import { destinations } from '@/data/destinations';
import { hotels } from '@/data/hotels';
import { loadAdminDrafts, saveAdminDraft } from '@/lib/adminDrafts';
import type { Hotel } from '@/types';

export default function EditHotelPage() {
  const router = useRouter();
  const baseHotel = hotels.find((item) => item.id === router.query.id);
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    if (!baseHotel) return;
    const draft = loadAdminDrafts<Hotel>('hotels')[baseHotel.id];
    setHotel({ ...baseHotel, ...draft });
  }, [baseHotel]);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hotel) return;
    const form = new FormData(event.currentTarget);
    saveAdminDraft<Hotel>('hotels', hotel.id, {
      name: String(form.get('name')),
      destinationSlug: String(form.get('destination')),
      propertyType: String(form.get('propertyType')) as Hotel['propertyType'],
      starRating: Number(form.get('starRating')),
      guestRating: Number(form.get('guestRating')),
      priceFromEtb: Number(form.get('price')),
      shortDescription: { ...hotel.shortDescription, en: String(form.get('description')) },
    });
    void router.push('/admin/hotels');
  }

  if (!hotel) return <AdminLayout title="Loading hotel..." description="Opening the hotel editor."><div /></AdminLayout>;

  return (
    <AdminLayout title={`Edit ${hotel.name}`} description="Manage the property details used throughout search, hotel pages, and comparison cards." eyebrow="Hotel editor" actions={<Link href="/admin/hotels" className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-ink-600"><ArrowLeft size={16} /> Back</Link>}>
      <form onSubmit={save} className="grid gap-6 xl:grid-cols-[1fr_0.55fr]">
        <Panel>
          <PanelHeader title="Property information" description="Core listing and pricing details" />
          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <label className="text-xs font-bold text-ink-500 sm:col-span-2">Hotel name<input name="name" defaultValue={hotel.name} required className={adminFieldClass} /></label>
            <label className="text-xs font-bold text-ink-500">Destination<select name="destination" defaultValue={hotel.destinationSlug} className={adminFieldClass}>{destinations.map((destination) => <option key={destination.slug} value={destination.slug}>{destination.name}</option>)}</select></label>
            <label className="text-xs font-bold text-ink-500">Property type<select name="propertyType" defaultValue={hotel.propertyType} className={adminFieldClass}>{['Hotel', 'Resort', 'Guesthouse', 'Lodge', 'Boutique'].map((type) => <option key={type}>{type}</option>)}</select></label>
            <label className="text-xs font-bold text-ink-500">Price from (ETB)<input name="price" type="number" min="0" defaultValue={hotel.priceFromEtb} required className={adminFieldClass} /></label>
            <label className="text-xs font-bold text-ink-500">Star rating<input name="starRating" type="number" min="1" max="5" defaultValue={hotel.starRating} required className={adminFieldClass} /></label>
            <label className="text-xs font-bold text-ink-500">Guest rating<input name="guestRating" type="number" min="0" max="10" step="0.1" defaultValue={hotel.guestRating} required className={adminFieldClass} /></label>
            <label className="text-xs font-bold text-ink-500 sm:col-span-2">Short description<textarea name="description" defaultValue={hotel.shortDescription.en} rows={5} className={adminTextAreaClass} /></label>
          </div>
          <div className="flex justify-end gap-2 border-t border-neutral-200 p-5"><Link href="/admin/hotels" className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-bold text-ink-500">Cancel</Link><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-primary-800 px-5 py-2.5 text-sm font-bold text-white"><Save size={16} /> Save changes</button></div>
        </Panel>
        <Panel className="h-fit"><PanelHeader title="Listing preview" description="Current primary image and rating" /><div className="p-5"><div className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src={hotel.photos[0]} alt={hotel.name} fill sizes="420px" className="object-cover" /></div><h2 className="mt-4 font-heading text-lg font-extrabold">{hotel.name}</h2><div className="mt-2 flex items-center justify-between"><span className="flex items-center gap-1 text-sm font-bold"><Star size={14} className="fill-amber-500 text-amber-500" /> {hotel.guestRating}</span><StatusPill tone={hotel.bookingActive ? 'green' : 'amber'}>{hotel.bookingActive ? 'Published' : 'Draft'}</StatusPill></div></div></Panel>
      </form>
    </AdminLayout>
  );
}
