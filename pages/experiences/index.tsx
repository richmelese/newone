import { useLanguage } from '@/lib/language';
import { getDestinationCategoryPairs } from '@/data/experiences';
import { destinations, getDestination } from '@/data/destinations';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SectionHeader from '@/components/ui/SectionHeader';
import CategoryCard from '@/components/destination/CategoryCard';

export default function ExperiencesPage() {
  const { t } = useLanguage();

  const categoryPairs = [...getDestinationCategoryPairs()].sort((a, b) => {
    const destCompare = (getDestination(a.destinationSlug)?.name ?? '').localeCompare(getDestination(b.destinationSlug)?.name ?? '');
    return destCompare !== 0 ? destCompare : a.category.localeCompare(b.category);
  });

  const groups = new Map<string, typeof categoryPairs>();
  categoryPairs.forEach((pair) => {
    const list = groups.get(pair.destinationSlug) ?? [];
    list.push(pair);
    groups.set(pair.destinationSlug, list);
  });

  return (
    <Layout
      seo={{
        title: t.navExperiences,
        description: t.experiencesSubtitle,
        path: '/experiences',
      }}
    >
      <PageHero photo={destinations[3].heroPhoto} title={t.experiencesTitle} subtitle={t.experiencesSubtitle} />
      <PageShell className="py-8">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.navExperiences }]} />

        <div className="mt-8 space-y-10">
          {Array.from(groups.entries()).map(([destinationSlug, pairs]) => {
            const destination = getDestination(destinationSlug);
            if (!destination) return null;
            return (
              <div key={destinationSlug}>
                <SectionHeader title={destination.name} className="mb-5" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {pairs.map((pair, i) => (
                    <CategoryCard
                      key={`${pair.destinationSlug}-${pair.category}`}
                      destinationSlug={pair.destinationSlug}
                      category={pair.category}
                      revealIndex={i}
                      showDestinationBadge={false}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </PageShell>
    </Layout>
  );
}
