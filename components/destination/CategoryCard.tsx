import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { getDestination } from '@/data/destinations';
import { getExperiencesByDestinationAndCategory } from '@/data/experiences';
import { slugify } from '@/lib/format';
import RevealItem from '@/components/ui/RevealItem';
import TiltSurface from '@/components/ui/TiltSurface';

export default function CategoryCard({
  destinationSlug,
  category,
  className,
  revealIndex = 0,
  showDestinationBadge = true,
}: {
  destinationSlug: string;
  category: string;
  className?: string;
  revealIndex?: number;
  showDestinationBadge?: boolean;
}) {
  const destination = getDestination(destinationSlug);
  const items = getExperiencesByDestinationAndCategory(destinationSlug, category);

  if (!destination || items.length === 0) return null;

  return (
    <RevealItem index={revealIndex} className={`h-full w-full ${className ?? ''}`}>
      <TiltSurface className="h-full w-full" innerClassName="h-full rounded-card-lg">
        <Link
          href={`/destinations/${destinationSlug}/${slugify(category)}`}
          className="group flex h-full w-full flex-col rounded-card-lg bg-white shadow-card [transform-style:preserve-3d]"
        >
          <div className="depth-layer-sm relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-t-card-lg">
            <Image
              src={items[0].photo}
              alt={category}
              fill
              sizes="(max-width: 640px) 90vw, 288px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {showDestinationBadge && (
              <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-pill bg-black/35 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <MapPin size={11} />
                {destination.name}
              </span>
            )}
          </div>
          <div className="depth-layer flex flex-1 flex-col rounded-b-card-lg bg-white p-4">
            <h3 className="line-clamp-1 font-heading text-base font-bold text-ink-900 group-hover:text-primary-700">{category}</h3>
          </div>
        </Link>
      </TiltSurface>
    </RevealItem>
  );
}
