import { destinations } from '@/data/destinations';
import { useLanguage } from '@/lib/language';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import DestinationFeaturedCard from '@/components/home/DestinationFeaturedCard';
import PageShell from '@/components/layout/PageShell';

const featuredLayout = [
  { slug: 'lalibela', badgeKey: 'badgeTrending' as const, featured: true },
  { slug: 'addis-ababa', badgeKey: 'badgePopular' as const },
  { slug: 'bahir-dar', badgeKey: 'badgeNew' as const },
  { slug: 'gondar', badgeKey: 'badgeHot' as const },
  { slug: 'hawassa', badgeKey: 'badgeFeatured' as const },
];

export default function DestinationsRow() {
  const { t } = useLanguage();

  const cards = featuredLayout
    .map((item) => {
      const destination = destinations.find((d) => d.slug === item.slug);
      if (!destination) return null;
      return { ...item, destination };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const [hero, ...rest] = cards;

  return (
    <section className="bg-white py-10 sm:py-14">
      <PageShell>
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="font-heading text-2xl font-bold text-ink-900 sm:text-3xl lg:text-4xl">
            <TwoToneHeading text={t.popularDestinationsTitle} />
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-ink-500 sm:text-base">{t.popularDestinationsSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:gap-5 lg:min-h-[480px]">
          {hero && (
            <DestinationFeaturedCard
              destination={hero.destination}
              badge={t[hero.badgeKey]}
              featured
              revealIndex={0}
              className="lg:row-span-2"
            />
          )}
          {rest.map((item, i) => (
            <DestinationFeaturedCard
              key={item.slug}
              destination={item.destination}
              badge={t[item.badgeKey]}
              revealIndex={i + 1}
            />
          ))}
        </div>
      </PageShell>
    </section>
  );
}
