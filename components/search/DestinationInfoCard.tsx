import Image from 'next/image';
import Link from 'next/link';
import { CalendarClock, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import Reveal from '@/components/ui/Reveal';
import RevealItem from '@/components/ui/RevealItem';
import type { Destination, Experience } from '@/types';

type DestinationInfoCardProps = {
  destination: Destination;
  experiences: Experience[];
};

export default function DestinationInfoCard({ destination, experiences }: DestinationInfoCardProps) {
  const { t, pick } = useLanguage();

  return (
    <Reveal className="mb-8 overflow-hidden rounded-card-lg bg-white shadow-card">
      <div className="relative h-48 w-full sm:h-56">
        <Image src={destination.heroPhoto} alt={destination.name} fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-hero-scrim" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-accent-300">
            <MapPin size={14} /> {destination.region}
          </p>
          <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">{destination.name}</h2>
          <p className="mt-1 max-w-xl text-sm text-white/90">{pick(destination.tagline)}</p>
        </div>
      </div>

      <div className="p-5">
        <p className="max-w-3xl leading-relaxed text-ink-600">{pick(destination.guide)}</p>
        <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-primary-700">
          <CalendarClock size={16} /> {t.bestTimeToVisit}: {pick(destination.bestTime)}
        </p>

        {experiences.length > 0 && (
          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-heading text-base font-bold text-ink-900">{t.navExperiences}</h3>
              <Link href={`/destinations/${destination.slug}`} className="shrink-0 text-sm font-semibold text-primary-700 hover:underline">
                {destination.name} →
              </Link>
            </div>
            <p className="mt-1 text-sm text-ink-500">{t.experiencesSubtitle}</p>

            <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
              {experiences.map((exp, i) => (
                <RevealItem key={exp.id} index={i} className="w-56 shrink-0">
                  <Link href={`/destinations/${destination.slug}`} className="block overflow-hidden rounded-card bg-neutral-50 shadow-card">
                    <div className="relative aspect-[4/3] w-full">
                      <Image src={exp.photo} alt={pick(exp.name)} fill sizes="224px" className="object-cover" />
                      <span className="absolute left-2 top-2 rounded-pill bg-white/90 px-2 py-0.5 text-xs font-semibold text-ink-700">
                        {exp.category}
                      </span>
                    </div>
                    <div className="p-3">
                      <h4 className="line-clamp-1 text-sm font-semibold text-ink-900">{pick(exp.name)}</h4>
                      <p className="mt-1 line-clamp-2 text-xs text-ink-500">{pick(exp.description)}</p>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}
