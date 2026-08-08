import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/lib/auth';
import { useAuthModal } from '@/lib/authModal';
import { getReviews } from '@/lib/reviewsService';
import { Skeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import RatingSummary from '@/components/reviews/RatingSummary';
import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewFilters, { DEFAULT_REVIEW_FILTERS, type ReviewFilterState } from '@/components/reviews/ReviewFilters';
import type { EntityReview, ReviewEntityRef } from '@/types';

const PAGE_SIZE = 5;

function applyFilters(reviews: EntityReview[], filters: ReviewFilterState): EntityReview[] {
  let result = reviews;
  if (filters.verifiedOnly) result = result.filter((r) => r.verified);
  if (filters.tripType !== 'all') result = result.filter((r) => r.tripType === filters.tripType);
  if (filters.language !== 'all') {
    result = result.filter((r) => (filters.language === 'en' ? Boolean(r.text.en.trim()) : Boolean(r.text.am.trim())));
  }
  const sorted = [...result];
  switch (filters.sort) {
    case 'highest':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'lowest':
      sorted.sort((a, b) => a.rating - b.rating);
      break;
    case 'helpful':
      sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
      break;
    default:
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return sorted;
}

type ReviewsSectionProps = {
  entity: ReviewEntityRef;
};

export default function ReviewsSection({ entity }: ReviewsSectionProps) {
  const { t } = useLanguage();
  const { user, hydrated } = useAuth();
  const { openSignIn } = useAuthModal();
  const [reviews, setReviews] = useState<EntityReview[] | null>(null);
  const [errored, setErrored] = useState(false);
  const [filters, setFilters] = useState<ReviewFilterState>(DEFAULT_REVIEW_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const writePath = `/reviews/${entity.type}/${entity.id}/write`;
  const reviewActionLabel = hydrated && !user ? `${t.signInButton} to write a review` : t.writeReviewCta;
  const reviewAction = user
    ? <Button href={writePath}>{reviewActionLabel}</Button>
    : <Button type="button" onClick={() => openSignIn(writePath)}>{reviewActionLabel}</Button>;

  async function load() {
    setReviews(null);
    setErrored(false);
    try {
      const data = await getReviews(entity.id, entity.type);
      setReviews(data);
    } catch {
      setErrored(true);
    }
  }

  useEffect(() => {
    load();
    setVisibleCount(PAGE_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity.id, entity.type]);

  const filtered = useMemo(() => (reviews ? applyFilters(reviews, filters) : []), [reviews, filters]);
  const visible = filtered.slice(0, visibleCount);

  return (
    <section id="reviews" className="scroll-mt-28">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-ink-900 sm:text-2xl">{t.hotelReviews}</h2>
          <p className="mt-1 text-sm text-ink-500">{t.reviewTrustLine}</p>
        </div>
        {reviewAction}
      </div>

      <div className="mt-5">
        {reviews === null && !errored ? (
          <div className="rounded-card-lg bg-white p-6 shadow-card">
            <Skeleton className="h-24 w-full" />
          </div>
        ) : errored ? (
          <ErrorState title={t.errorTitle} subtitle={t.errorSubtitle} retryLabel={t.retry} onRetry={load} />
        ) : (
          <RatingSummary reviews={reviews ?? []} type={entity.type} />
        )}
      </div>

      {reviews !== null && reviews.length > 0 && (
        <div className="mt-5">
          <ReviewFilters value={filters} onChange={setFilters} />
        </div>
      )}

      <div className="mt-4 space-y-4">
        {reviews === null && !errored ? (
          <div className="space-y-6 py-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2.5 border-b border-neutral-200 pb-6 last:border-b-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : errored ? null : reviews && reviews.length === 0 ? (
          <div className="py-4">
            <EmptyState title={t.reviewsEmptyTitle} subtitle={t.reviewsEmptySubtitle} action={reviewAction} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-4">
            <EmptyState title={t.emptyResultsTitle} subtitle={t.emptyResultsSubtitle} />
          </div>
        ) : (
          <>
            {visible.map((review, i) => (
              <ReviewCard key={review.id} review={review} revealIndex={i} standalone />
            ))}
            {visibleCount < filtered.length && (
              <div className="flex justify-center py-6">
                <Button variant="outline" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                  {t.showMore}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
