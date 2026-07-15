import { useLanguage } from '@/lib/language';
import { destinations } from '@/data/destinations';
import { getHotelsByDestination } from '@/data/hotels';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import DestinationCard from '@/components/destination/DestinationCard';

export default function DestinationsIndexPage() {
  const { t } = useLanguage();

  return (
    <Layout
      seo={{
        title: t.navDestinations,
        description: 'Browse Ethiopia’s top travel destinations and discover hotels in each — Addis Ababa, Bahir Dar, Lalibela, Gondar, Hawassa, Axum, and Harar.',
        path: '/destinations',
      }}
    >
      <PageHero photo={destinations[2].heroPhoto} title={t.popularDestinationsTitle} subtitle={t.popularDestinationsSubtitle} />
      <PageShell className="py-8">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.navDestinations }]} />
        <p className="mt-6 max-w-3xl leading-relaxed text-ink-600">{t.destinationsOverviewText}</p>
        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {destinations.map((d, i) => (
            <DestinationCard key={d.slug} destination={d} revealIndex={i} />
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-400">
          {destinations.reduce((sum, d) => sum + getHotelsByDestination(d.slug).length, 0)} {t.hotelsCount}
        </p>
      </PageShell>
    </Layout>
  );
}
