import { useMemo, useState } from 'react';
import { useLanguage } from '@/lib/language';
import { hotels } from '@/data/hotels';
import { destinations } from '@/data/destinations';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FilterChip from '@/components/ui/FilterChip';
import ReviewCard from '@/components/hotel/ReviewCard';
import EmptyState from '@/components/ui/EmptyState';
import Reveal from '@/components/ui/Reveal';

export default function ReviewsPage() {
  const { t } = useLanguage();
  const [minStar, setMinStar] = useState<number | null>(null);

  const allReviews = useMemo(
    () =>
      hotels
        .flatMap((hotel) => hotel.reviews.map((review) => ({ review, hotel })))
        .sort((a, b) => new Date(b.review.date).getTime() - new Date(a.review.date).getTime()),
    [],
  );

  const filtered = minStar ? allReviews.filter((r) => r.review.rating >= minStar) : allReviews;

  return (
    <Layout
      seo={{
        title: t.navReviews,
        description: 'Real guest reviews from travelers who stayed at hotels across Ethiopia.',
        path: '/reviews',
      }}
    >
      <PageHero photo={destinations[6].heroPhoto} title={t.reviewsStripTitle} subtitle={t.reviewsStripSubtitle} />
      <PageShell className="py-8">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.navReviews }]} />

        <Reveal className="mb-6 mt-6 flex flex-wrap gap-2">
          <FilterChip label={t.categoryAll} active={minStar === null} onClick={() => setMinStar(null)} />
          {[5, 4, 3].map((star) => (
            <FilterChip key={star} label={`${star}+ ★`} active={minStar === star} onClick={() => setMinStar(star)} />
          ))}
        </Reveal>

        {filtered.length === 0 ? (
          <EmptyState title={t.emptyResultsTitle} subtitle={t.emptyResultsSubtitle} />
        ) : (
          <div className="grid gap-x-10 rounded-card-lg bg-white px-5 shadow-card sm:grid-cols-2 sm:px-6">
            {filtered.map(({ review, hotel }, i) => (
              <ReviewCard key={review.id} review={review} hotelName={hotel.name} hotelHref={`/hotels/${hotel.slug}`} revealIndex={i} />
            ))}
          </div>
        )}
      </PageShell>
    </Layout>
  );
}
