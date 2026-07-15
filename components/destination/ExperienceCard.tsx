import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { getDestination } from '@/data/destinations';
import RevealItem from '@/components/ui/RevealItem';
import TiltSurface from '@/components/ui/TiltSurface';
import type { Experience } from '@/types';

export default function ExperienceCard({
  experience,
  className,
  revealIndex = 0,
}: {
  experience: Experience;
  className?: string;
  revealIndex?: number;
}) {
  const { pick } = useLanguage();
  const destination = getDestination(experience.destinationSlug);

  return (
    <RevealItem index={revealIndex} className={`h-full w-full ${className ?? ''}`}>
      <TiltSurface className="h-full w-full" innerClassName="h-full rounded-card-lg">
        <Link
          href={`/experiences/${experience.id}`}
          className="group flex h-full w-full flex-col rounded-card-lg bg-white shadow-card [transform-style:preserve-3d]"
        >
          <div className="depth-layer-sm relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-t-card-lg">
            <Image
              src={experience.photo}
              alt={pick(experience.name)}
              fill
              sizes="(max-width: 640px) 90vw, 288px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute left-2.5 top-2.5 rounded-pill bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink-700">
              {experience.category}
            </span>
            {destination && (
              <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-pill bg-black/35 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <MapPin size={11} />
                {destination.name}
              </span>
            )}
          </div>
          <div className="depth-layer flex flex-1 flex-col rounded-b-card-lg bg-white p-4">
            <h3 className="line-clamp-1 font-heading text-base font-bold text-ink-900 group-hover:text-primary-700">{pick(experience.name)}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-ink-500">{pick(experience.description)}</p>
          </div>
        </Link>
      </TiltSurface>
    </RevealItem>
  );
}
