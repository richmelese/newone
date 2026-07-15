import Link from 'next/link';
import { Landmark } from 'lucide-react';
import { hotels } from '@/data/hotels';
import { useLanguage } from '@/lib/language';
import SectionHeader from '@/components/ui/SectionHeader';
import PageShell from '@/components/layout/PageShell';

export default function PartnerHotelsMarquee() {
  const { t } = useLanguage();
  const track = [...hotels, ...hotels];

  return (
    <section className="py-10 sm:py-12">
      <PageShell>
        <SectionHeader title={t.partnerHotelsTitle} subtitle={t.partnerHotelsSubtitle} className="mb-6" />
      </PageShell>

      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track flex w-max animate-marquee gap-4">
          {track.map((hotel, i) => (
            <Link
              key={`${hotel.id}-${i}`}
              href={`/hotels/${hotel.slug}`}
              className="group flex h-20 w-52 shrink-0 items-center gap-3 rounded-card-lg border border-neutral-200 bg-white px-4 shadow-soft grayscale transition-all hover:grayscale-0 hover:shadow-card"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-ink-400 transition-colors group-hover:bg-primary-50 group-hover:text-primary-600">
                <Landmark size={18} />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-heading text-sm font-bold text-ink-700 group-hover:text-ink-900">{hotel.name}</span>
                <span className="block text-xs text-ink-400">{hotel.propertyType}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
