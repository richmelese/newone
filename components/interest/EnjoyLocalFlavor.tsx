import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '@/lib/language';
import { experiences } from '@/data/experiences';
import Carousel from '@/components/ui/Carousel';
import Reveal from '@/components/ui/Reveal';
import type { LocalFlavorMoment, LocalFlavorSection } from '@/types';

function getMomentHref(moment: LocalFlavorMoment): string | undefined {
  if (moment.experienceId) {
    const experience = experiences.find((entry) => entry.id === moment.experienceId);
    if (experience) return `/experiences/${experience.id}`;
  }
  if (moment.destinationSlug) return `/destinations/${moment.destinationSlug}`;
  return undefined;
}

function AuthorBadge({ author }: { author: string }) {
  const initial = author.replace('@', '').charAt(0).toUpperCase();

  return (
    <span className="inline-flex items-center gap-2 text-sm text-white/90">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-xs font-bold text-white backdrop-blur-sm">
        {initial}
      </span>
      {author}
    </span>
  );
}

function ThumbnailCard({ moment }: { moment: LocalFlavorMoment }) {
  const { pick } = useLanguage();
  const [saved, setSaved] = useState(false);
  const href = getMomentHref(moment);

  const card = (
    <div className="group relative aspect-square w-36 shrink-0 snap-start overflow-hidden rounded-card sm:w-40">
      <Image
        src={moment.photo}
        alt={pick(moment.title)}
        fill
        sizes="160px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setSaved((value) => !value);
        }}
        aria-label={saved ? 'Remove from favorites' : 'Save to favorites'}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink-500 shadow-soft transition-colors hover:text-accent-500"
      >
        <Heart size={16} className={clsx(saved && 'fill-accent-500 text-accent-500')} />
      </button>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {card}
      </Link>
    );
  }

  return card;
}

export default function EnjoyLocalFlavor({ section }: { section: LocalFlavorSection }) {
  const { pick } = useLanguage();
  const featuredHref = getMomentHref(section.featured);

  const featuredCard = (
    <div className="group relative aspect-[16/10] overflow-hidden rounded-card-lg sm:aspect-[2/1]">
      <Image
        src={section.featured.photo}
        alt={pick(section.featured.title)}
        fill
        sizes="(max-width: 1024px) 100vw, 960px"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <h3 className="font-heading text-xl font-bold text-white sm:text-2xl">{pick(section.featured.title)}</h3>
        <div className="mt-2">
          <AuthorBadge author={section.featured.author} />
        </div>
      </div>
    </div>
  );

  return (
    <Reveal className="mt-12">
      <section>
        <h2 className="font-heading text-2xl font-bold text-ink-900 sm:text-3xl">{pick(section.title)}</h2>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-500 sm:text-base">{pick(section.subtitle)}</p>

        <div className="mt-5">
          {featuredHref ? (
            <Link href={featuredHref} className="block">
              {featuredCard}
            </Link>
          ) : (
            featuredCard
          )}
        </div>

        <Carousel className="mt-4">
          {section.moments.map((moment) => (
            <ThumbnailCard key={moment.id} moment={moment} />
          ))}
        </Carousel>
      </section>
    </Reveal>
  );
}
