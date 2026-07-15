import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Compass, Eye, Hotel as HotelIcon, Map, MessageSquare, Star } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { MetricCard, Panel, PanelHeader, StatusPill } from '@/components/admin/AdminUi';
import { destinations } from '@/data/destinations';
import { hotels } from '@/data/hotels';
import { experiences } from '@/data/experiences';

const monthlyTraffic = [42, 55, 48, 70, 62, 78, 69, 86, 74, 91, 82, 96];
const monthLabels = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

export default function AdminDashboardPage() {
  const reviewCount = hotels.reduce((total, hotel) => total + hotel.reviews.length, 0);
  const activeHotels = hotels.filter((hotel) => hotel.bookingActive).length;
  const latestHotels = hotels.slice(-4).reverse();
  const totalContent = destinations.length + hotels.length + experiences.length;
  const destinationShare = (destinations.length / totalContent) * 100;
  const hotelShare = (hotels.length / totalContent) * 100;

  return (
    <AdminLayout
      title="Good afternoon, Admin"
      description="A clear view of the content powering Ethiopidia. All changes in this prototype stay in the browser—no server is connected."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Destinations" value={destinations.length} detail="All public and discoverable" trend="up" icon={<Map size={21} />} />
        <MetricCard label="Hotels" value={hotels.length} detail={`${activeHotels} booking links active`} trend="up" icon={<HotelIcon size={21} />} tone="orange" />
        <MetricCard label="Things to do" value={experiences.length} detail="Across all destination guides" trend="up" icon={<Compass size={21} />} tone="purple" />
        <MetricCard label="Guest reviews" value={reviewCount} detail="From published hotel listings" trend="flat" icon={<MessageSquare size={21} />} tone="green" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <Panel>
          <PanelHeader
            title="Website reach"
            description="Illustrative frontend analytics for the last 12 months"
            action={<StatusPill tone="blue">+18.4% this year</StatusPill>}
          />
          <div className="p-5 sm:p-6">
            <div className="mb-7 flex flex-wrap gap-8">
              <div>
                <p className="text-xs font-semibold text-ink-400">Page views</p>
                <p className="mt-1 font-heading text-2xl font-extrabold">128,420</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-400">Unique visitors</p>
                <p className="mt-1 font-heading text-2xl font-extrabold">46,890</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-400">Average stay</p>
                <p className="mt-1 font-heading text-2xl font-extrabold">4m 12s</p>
              </div>
            </div>
            <div className="flex h-56 items-end gap-2 sm:gap-3">
              {monthlyTraffic.map((height, index) => (
                <div key={monthLabels[index]} className="flex h-full flex-1 flex-col justify-end gap-2">
                  <div className="group relative flex-1">
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-t-lg bg-gradient-to-t from-primary-700 to-primary-400 transition-all group-hover:from-accent-600 group-hover:to-accent-400"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-center text-[9px] font-semibold text-ink-400 sm:text-[10px]">{monthLabels[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Content health" description="Coverage across the website" />
          <div className="grid items-center gap-5 border-b border-neutral-200 p-5 sm:grid-cols-[auto_1fr] sm:p-6 xl:grid-cols-1 2xl:grid-cols-[auto_1fr]">
            <div className="relative mx-auto h-36 w-36 shrink-0">
              <div
                className="absolute inset-0 rounded-full shadow-[0_14px_30px_rgba(11,36,54,0.14)]"
                style={{ background: `conic-gradient(#2a5580 0 ${destinationShare}%, #f97316 ${destinationShare}% ${destinationShare + hotelShare}%, #8b5cf6 ${destinationShare + hotelShare}% 100%)` }}
              />
              <div className="absolute inset-[18px] flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
                <span className="font-heading text-2xl font-extrabold text-primary-900">{totalContent}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-ink-400">Total items</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Destinations', value: destinations.length, color: 'bg-primary-600' },
                { label: 'Hotels', value: hotels.length, color: 'bg-accent-500' },
                { label: 'Things to do', value: experiences.length, color: 'bg-violet-500' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl bg-neutral-100 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-xs font-bold text-ink-600"><span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />{item.label}</span>
                  <span className="font-heading text-sm font-extrabold text-primary-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            {[
              { label: 'Destination guides', value: 100, note: `${destinations.length}/${destinations.length} complete` },
              { label: 'Hotel photography', value: 92, note: '2 listings need review' },
              { label: 'Things to do details', value: 84, note: 'Descriptions can improve' },
              { label: 'Booking links', value: 76, note: `${activeHotels} currently active` },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-4 text-xs">
                  <span className="font-bold text-ink-600">{item.label}</span>
                  <span className="text-ink-400">{item.note}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-pill bg-neutral-100">
                  <div className="h-full rounded-pill bg-accent-500" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel>
          <PanelHeader
            title="Recently added hotels"
            description="Listings sourced from the public website data"
            action={<Link href="/admin/hotels" className="text-xs font-bold text-primary-700 hover:text-accent-600">View all</Link>}
          />
          <div className="divide-y divide-neutral-200">
            {latestHotels.map((hotel) => {
              const destination = destinations.find((item) => item.slug === hotel.destinationSlug);
              return (
                <div key={hotel.id} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                  <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    <Image src={hotel.photos[0]} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-primary-900">{hotel.name}</p>
                    <p className="mt-1 truncate text-xs text-ink-400">{destination?.name} · {hotel.propertyType}</p>
                  </div>
                  <div className="hidden items-center gap-1 text-xs font-bold text-ink-600 sm:flex"><Star size={13} className="fill-amber-500 text-amber-500" /> {hotel.guestRating}</div>
                  <StatusPill tone={hotel.bookingActive ? 'green' : 'amber'}>{hotel.bookingActive ? 'Active' : 'Draft'}</StatusPill>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Quick actions" description="Common content tasks" />
          <div className="grid gap-3 p-5">
            {[
              { href: '/admin/hotels', label: 'Review hotel listings', detail: `${hotels.length} total properties`, icon: BedDouble },
              { href: '/admin/experiences', label: 'Curate things to do', detail: `${experiences.length} activities`, icon: Compass },
              { href: '/admin/reviews', label: 'Moderate reviews', detail: `${reviewCount} guest responses`, icon: MessageSquare },
              { href: '/', label: 'Preview public website', detail: 'Open the visitor experience', icon: Eye },
            ].map(({ href, label, detail, icon: Icon }) => (
              <Link key={label} href={href} className="group flex items-center gap-3 rounded-xl border border-neutral-200 p-3.5 transition hover:border-primary-200 hover:bg-primary-50">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 group-hover:bg-white"><Icon size={18} /></span>
                <div>
                  <p className="text-sm font-bold text-ink-800">{label}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{detail}</p>
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </AdminLayout>
  );
}
