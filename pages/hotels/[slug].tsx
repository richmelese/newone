import { useEffect } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { getHotel, hotels } from '@/data/hotels';
import { getDestination } from '@/data/destinations';
import { useLanguage } from '@/lib/language';
import { useViewedHistory } from '@/lib/viewedHistory';
import { useAuth } from '@/lib/auth';
import { useAuthModal } from '@/lib/authModal';
import { hotelSchema } from '@/lib/structuredData';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import HotelGallery from '@/components/hotel/HotelGallery';
import RatingStars from '@/components/ui/RatingStars';
import StickyMobileCta from '@/components/hotel/StickyMobileCta';
import HotelAmenitySections from '@/components/hotel/HotelAmenitySections';
import YouMayAlsoLike from '@/components/hotel/YouMayAlsoLike';
import RoomAvailabilityTable from '@/components/hotel/RoomAvailabilityTable';
import LocationSection from '@/components/hotel/LocationSection';
import RatingBreakdown from '@/components/hotel/RatingBreakdown';
import RecentReviewsCard from '@/components/reviews/RecentReviewsCard';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import type { Hotel } from '@/types';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: hotels.map((h) => ({ params: { slug: h.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ hotel: Hotel }> = async ({ params }) => {
  const hotel = getHotel(params?.slug as string);
  if (!hotel) return { notFound: true };
  return { props: { hotel } };
};

export default function HotelDetailPage({ hotel }: { hotel: Hotel }) {
  const { t, pick } = useLanguage();
  const { recordView } = useViewedHistory();
  const { user, hydrated } = useAuth();
  const { openSignIn } = useAuthModal();

  useEffect(() => {
    recordView(hotel.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel.id]);

  const destination = getDestination(hotel.destinationSlug);
  const writeReviewPath = `/reviews/hotel/${hotel.id}/write`;

  return (
    <Layout
      seo={{
        title: hotel.name,
        description: pick(hotel.shortDescription),
        image: hotel.photos[0],
        path: `/hotels/${hotel.slug}`,
        jsonLd: hotelSchema(hotel, pick(hotel.longDescription), pick(hotel.neighborhood), destination?.name ?? 'Ethiopia'),
      }}
    >
      <PageShell className="py-6 pb-24 lg:pb-6">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: t.navDestinations, href: '/destinations' },
            ...(destination ? [{ label: destination.name, href: `/destinations/${destination.slug}` }] : []),
            { label: hotel.name },
          ]}
        />

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <RatingStars rating={hotel.starRating} size={14} />
            <h1 className="mt-1 font-heading text-2xl font-bold text-ink-900">{hotel.name}</h1>
            <p className="mt-1 text-sm text-ink-500">{pick(hotel.neighborhood)}</p>
          </div>
          {hydrated && (
            user ? (
              <Button href={writeReviewPath} variant="outline">{t.writeReviewCta}</Button>
            ) : (
              <Button type="button" onClick={() => openSignIn(writeReviewPath)} variant="outline">{t.signInButton} to write a review</Button>
            )
          )}
        </div>

        <Reveal className="mt-4">
          <HotelGallery photos={hotel.photos} alt={hotel.name} />
        </Reveal>

        <div className="mt-8 space-y-10">
          <section className="space-y-10">
            <RoomAvailabilityTable hotel={hotel} />
            <RecentReviewsCard entity={{ id: hotel.id, type: 'hotel', name: { en: hotel.name, am: hotel.name }, photo: hotel.photos[0] }} />
          </section>

          <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <RatingBreakdown guestRating={hotel.guestRating} reviewCount={hotel.reviewCount} title={t.hotelReviews} />
            <HotelAmenitySections hotel={hotel} />
          </section>

          <Reveal>
            <section>
              <h2 className="font-heading text-xl font-bold text-ink-900">{t.hotelLocation}</h2>
              <div className="mt-4">
                <LocationSection hotel={hotel} />
              </div>
            </section>
          </Reveal>

          <YouMayAlsoLike hotel={hotel} />
        </div>
      </PageShell>

      <StickyMobileCta hotel={hotel} />
    </Layout>
  );
}
