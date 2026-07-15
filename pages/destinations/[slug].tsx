import Image from 'next/image';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { destinations, getDestination } from '@/data/destinations';
import { getDestinationGuide } from '@/data/destinationGuides';
import { getHotelsByDestination } from '@/data/hotels';
import { getExperiencesByDestination } from '@/data/experiences';
import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SectionHeader from '@/components/ui/SectionHeader';
import HotelCard from '@/components/hotel/HotelCard';
import DestinationGreatFor from '@/components/destination/DestinationGreatFor';
import Reveal from '@/components/ui/Reveal';
import DestinationGuide from '@/components/destination/DestinationGuide';
import EmptyState from '@/components/ui/EmptyState';
import type { Destination } from '@/types';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: destinations.map((d) => ({ params: { slug: d.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ destination: Destination }> = async ({ params }) => {
  const destination = getDestination(params?.slug as string);
  if (!destination) return { notFound: true };
  return { props: { destination } };
};

export default function DestinationDetailPage({ destination }: { destination: Destination }) {
  const { t, pick } = useLanguage();
  const hotels = getHotelsByDestination(destination.slug);
  const experiences = getExperiencesByDestination(destination.slug);
  const guide = getDestinationGuide(destination.slug);

  return (
    <Layout
      seo={{
        title: `Hotels in ${destination.name}`,
        description: pick(destination.guide),
        image: destination.heroPhoto,
        path: `/destinations/${destination.slug}`,
      }}
    >
      <section className="relative flex min-h-[380px] items-end overflow-hidden sm:min-h-[440px]">
        <Image
          src={destination.heroPhoto}
          alt={destination.name}
          fill
          priority
          unoptimized={destination.heroPhoto.includes('commons.wikimedia.org')}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-hero-scrim" />
        <PageShell className="relative pb-10 pt-32 text-white">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-300">{destination.region}</p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">{destination.name}</h1>
            <p className="mt-2 max-w-xl text-white/90">{pick(destination.tagline)}</p>
          </Reveal>
        </PageShell>
      </section>

      <PageShell className="py-8">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: t.navDestinations, href: '/destinations' },
            { label: destination.name },
          ]}
        />

        <Reveal className="mt-6">
          {guide ? (
            <DestinationGuide destination={destination} guide={guide} />
          ) : (
            <div className="max-w-3xl">
              <p className="leading-relaxed text-ink-600">{pick(destination.guide)}</p>
              <p className="mt-2 text-sm font-semibold text-primary-700">
                {t.bestTimeToVisit}: {pick(destination.bestTime)}
              </p>
            </div>
          )}
        </Reveal>

        <Reveal className="mt-10">
          <SectionHeader title={`${t.navHotels} — ${destination.name}`} subtitle={`${hotels.length} ${t.hotelsCount}`} className="mb-6" />
          {hotels.length === 0 ? (
            <EmptyState title={t.emptyResultsTitle} subtitle={t.emptyResultsSubtitle} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {hotels.map((hotel, i) => (
                <HotelCard key={hotel.id} hotel={hotel} revealIndex={i} />
              ))}
            </div>
          )}
        </Reveal>

        {experiences.length > 0 && (
          <div className="mt-12">
            <DestinationGreatFor destination={destination} experiences={experiences} />
          </div>
        )}
      </PageShell>
    </Layout>
  );
}
