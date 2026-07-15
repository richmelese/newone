import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/language';
import { getDestination } from '@/data/destinations';
import { experiences } from '@/data/experiences';
import Carousel from '@/components/ui/Carousel';
import Reveal from '@/components/ui/Reveal';
import RevealItem from '@/components/ui/RevealItem';
import type { InterestHighlightItem, InterestHighlightSection } from '@/types';

function getItemHref(item: InterestHighlightItem): string | undefined {
  if (item.experienceId) {
    const experience = experiences.find((entry) => entry.id === item.experienceId);
    if (experience) return `/experiences/${experience.id}`;
  }
  if (item.destinationSlug) return `/destinations/${item.destinationSlug}`;
  return undefined;
}

function HighlightCard({ item, index }: { item: InterestHighlightItem; index: number }) {
  const { pick } = useLanguage();
  const href = getItemHref(item);
  const experience = item.experienceId ? experiences.find((entry) => entry.id === item.experienceId) : undefined;
  const destination = experience ? getDestination(experience.destinationSlug) : item.destinationSlug ? getDestination(item.destinationSlug) : undefined;

  const content = (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card-lg">
        <Image
          src={item.photo}
          alt={pick(item.title)}
          fill
          sizes="(max-width: 640px) 70vw, 288px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <h3 className="font-heading text-base font-bold text-ink-900 group-hover:text-primary-700">{pick(item.title)}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-500">{pick(item.description)}</p>
        {destination && <p className="mt-2 text-xs font-semibold text-primary-700">{destination.name}</p>}
      </div>
    </>
  );

  return (
    <RevealItem index={index} className="w-64 shrink-0 snap-start sm:w-72">
      {href ? (
        <Link href={href} className="group block">
          {content}
        </Link>
      ) : (
        <div className="group block">{content}</div>
      )}
    </RevealItem>
  );
}

export default function InterestHighlightSections({ sections }: { sections: InterestHighlightSection[] }) {
  if (sections.length === 0) return null;

  return (
    <div className="mt-10 space-y-12">
      {sections.map((section, sectionIndex) => (
        <Reveal key={section.title.en}>
          <section>
            <InterestSectionHeader section={section} />
            <Carousel className="mt-5">
              {section.items.map((item, itemIndex) => (
                <HighlightCard key={item.title.en} item={item} index={sectionIndex * 4 + itemIndex} />
              ))}
            </Carousel>
          </section>
        </Reveal>
      ))}
    </div>
  );
}

function InterestSectionHeader({ section }: { section: InterestHighlightSection }) {
  const { pick } = useLanguage();

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-ink-900 sm:text-3xl">{pick(section.title)}</h2>
      <p className="mt-1.5 max-w-2xl text-sm text-ink-500 sm:text-base">{pick(section.subtitle)}</p>
    </div>
  );
}
