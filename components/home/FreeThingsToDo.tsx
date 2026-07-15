import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/language';
import { experiences } from '@/data/experiences';
import { getDestination } from '@/data/destinations';
import SectionHeader from '@/components/ui/SectionHeader';
import Carousel from '@/components/ui/Carousel';
import RevealItem from '@/components/ui/RevealItem';
import PageShell from '@/components/layout/PageShell';

const FREE_EXPERIENCE_IDS = [
  'exp-addis-entoto',
  'exp-addis-mercato',
  'exp-lalibela-market',
  'exp-hawassa-fishmarket',
  'exp-bahirdar-zeghie',
  'exp-hawassa-birding',
];

export default function FreeThingsToDo() {
  const { t, pick } = useLanguage();

  const items = FREE_EXPERIENCE_IDS.map((id) => experiences.find((e) => e.id === id)).filter(
    (e): e is NonNullable<typeof e> => Boolean(e)
  );

  return (
    <section className="bg-white py-10 sm:py-12">
      <PageShell>
        <SectionHeader eyebrow={t.freeThingsEyebrow} title={t.freeThingsTitle} subtitle={t.freeThingsSubtitle} className="mb-6" />
        <Carousel>
          {items.map((item, i) => {
            const destination = getDestination(item.destinationSlug);
            return (
              <RevealItem key={item.id} index={i} className="w-64 shrink-0 snap-start sm:w-72">
              <Link
                href={`/destinations/${item.destinationSlug}`}
                className="group block overflow-hidden rounded-card-lg bg-white shadow-card transition-shadow hover:shadow-lift"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={item.photo}
                    alt={pick(item.name)}
                    fill
                    sizes="(max-width: 640px) 70vw, 288px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-2.5 top-2.5 rounded-pill bg-success-500 px-2.5 py-1 text-xs font-semibold text-white">
                    {t.freeBadgeLabel}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-base font-bold text-ink-900">{pick(item.name)}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-500">{pick(item.description)}</p>
                  {destination && <p className="mt-2 text-xs font-semibold text-primary-700">{destination.name}</p>}
                </div>
              </Link>
              </RevealItem>
            );
          })}
        </Carousel>
      </PageShell>
    </section>
  );
}
