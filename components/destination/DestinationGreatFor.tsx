import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '@/lib/language';
import { slugify } from '@/lib/format';
import Carousel from '@/components/ui/Carousel';
import Reveal from '@/components/ui/Reveal';
import type { Destination, Experience } from '@/types';

function GreatForCard({ experience }: { experience: Experience }) {
  const { pick } = useLanguage();
  const [saved, setSaved] = useState(false);

  return (
    <Link href={`/experiences/${experience.id}`} className="group block w-40 shrink-0 snap-start sm:w-52">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card-lg shadow-card">
        <Image
          src={experience.photo}
          alt={pick(experience.name)}
          fill
          sizes="(max-width: 640px) 40vw, 208px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSaved((v) => !v);
          }}
          aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink-500 shadow-soft transition-colors hover:text-accent-500"
        >
          <Heart size={15} className={clsx(saved && 'fill-accent-500 text-accent-500')} />
        </button>
      </div>
      <h3 className="mt-2.5 line-clamp-1 font-heading text-base font-bold text-ink-900 group-hover:text-primary-700">
        {pick(experience.name)}
      </h3>
      <p className="mt-0.5 text-sm text-ink-500">{experience.category}</p>
    </Link>
  );
}

export default function DestinationGreatFor({
  destination,
  experiences,
}: {
  destination: Destination;
  experiences: Experience[];
}) {
  const { t } = useLanguage();

  const groups = useMemo(() => {
    const map = new Map<string, Experience[]>();
    experiences.forEach((exp) => {
      const list = map.get(exp.category) ?? [];
      list.push(exp);
      map.set(exp.category, list);
    });
    return Array.from(map.entries());
  }, [experiences]);

  if (groups.length === 0) return null;

  return (
    <div>
      <Reveal>
        <h2 className="font-heading text-2xl font-bold text-ink-900 sm:text-3xl">
          {destination.name} {t.destinationGreatForSuffix}
        </h2>
      </Reveal>

      <div className="mt-8 space-y-9">
        {groups.map(([category, items], i) => (
          <Reveal key={category} delay={i * 0.05}>
            <Link
              href={`/destinations/${destination.slug}/${slugify(category)}`}
              className="group mb-4 inline-flex items-center gap-1.5"
            >
              <h3 className="font-heading text-lg font-bold text-ink-800 group-hover:text-primary-700">{category}</h3>
              <ArrowRight size={16} className="text-ink-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary-700" />
            </Link>
            <Carousel alwaysShowArrows>
              {items.map((exp) => (
                <GreatForCard key={exp.id} experience={exp} />
              ))}
            </Carousel>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
