import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useAuthModal } from '@/lib/authModal';
import { useLanguage } from '@/lib/language';
import { getReviewsSync } from '@/lib/reviewsService';
import { formatDate } from '@/lib/format';
import { hotels } from '@/data/hotels';
import Button from '@/components/ui/Button';
import Carousel from '@/components/ui/Carousel';
import StarRating from '@/components/reviews/StarRating';
import VerifiedBadge from '@/components/reviews/VerifiedBadge';
import ReviewPageForm from '@/components/reviews/ReviewPageForm';
import type { EntityReview, ReviewEntityRef } from '@/types';

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

export default function RecentReviewsCard({ entity }: { entity: ReviewEntityRef }) {
  const { t, language } = useLanguage();
  const { user, hydrated } = useAuth();
  const { openSignIn } = useAuthModal();
  const reviewsPath = `/reviews/${entity.type}/${entity.id}`;
  const [reviews, setReviews] = useState<EntityReview[]>([]);
  const [reviewRequested, setReviewRequested] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (user && reviewRequested) {
      setShowReviewForm(true);
      setReviewRequested(false);
    }
  }, [reviewRequested, user]);

  useEffect(() => {
    const unifiedReviews = getReviewsSync(entity.id, entity.type);
    const hotel = entity.type === 'hotel' ? hotels.find((item) => item.id === entity.id) : undefined;
    const listingReviews: EntityReview[] = (hotel?.reviews ?? []).map((review) => ({
      id: `listing-${entity.id}-${review.id}`,
      entityId: entity.id,
      entityType: entity.type,
      entityName: entity.name,
      author: { name: review.author, email: '' },
      rating: review.rating,
      subRatings: {},
      title: { en: '', am: '' },
      text: review.comment,
      tripType: 'couple',
      visitDate: review.date,
      photos: [],
      verified: true,
      status: 'published',
      helpfulCount: 0,
      createdAt: review.date,
    }));

    setReviews([...unifiedReviews, ...listingReviews]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [entity.id, entity.name.am, entity.name.en, entity.type]);

  return (
    <section id="reviews" className="h-full scroll-mt-28">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-ink-900">{t.hotelReviews}</h2>
          <p className="mt-1 text-sm text-ink-500">Recent traveler experiences</p>
        </div>
        {hydrated && (user ? (
          <Button type="button" size="sm" variant={showReviewForm ? 'outline' : 'primary'} onClick={() => setShowReviewForm((current) => !current)}>
            {showReviewForm ? 'Close review form' : t.writeReviewCta}
          </Button>
        ) : (
          language === 'en' ? (
            <p className="text-sm text-ink-500">
              You must{' '}
              <button type="button" onClick={() => { setReviewRequested(true); openSignIn(); }} className="font-extrabold text-primary-700 hover:underline">
                sign in
              </button>{' '}
              to write a review
            </p>
          ) : (
            <button type="button" onClick={() => { setReviewRequested(true); openSignIn(); }} className="text-sm font-bold text-primary-700 hover:underline">
              {t.writeReviewSignInPrompt}
            </button>
          )
        ))}
      </div>

      {user && showReviewForm && (
        <div className="mt-5">
          <ReviewPageForm entity={entity} returnHref={reviewsPath} onSubmitted={() => setShowReviewForm(false)} />
        </div>
      )}

      {reviews.length > 0 ? (
        <Carousel className="mt-4" autoPlay={reviews.length > 4} autoPlayInterval={5500} alwaysShowArrows>
          {reviews.map((review) => {
            const title = review.title[language] || review.title.en || review.title.am;
            const text = review.text[language] || review.text.en || review.text.am;
            return (
              <article key={review.id} className="flex min-h-[250px] w-[88%] shrink-0 snap-start flex-col rounded-card-lg border border-neutral-200 bg-white p-5 shadow-card sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.7rem)] xl:w-[calc(25%-0.75rem)]">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-700 text-xs font-extrabold text-white shadow-soft">{initials(review.author.name)}</span>
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-1.5 text-sm font-bold text-ink-900">
                      {review.author.name}
                      {review.verified && <VerifiedBadge />}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-400">{formatDate(review.visitDate, language)}</p>
                  </div>
                </div>
                <StarRating value={review.rating} readOnly size={16} className="mt-4" />
                {title && <h3 className="mt-3 line-clamp-1 font-heading text-sm font-bold text-ink-900">{title}</h3>}
                <p className="mt-1.5 line-clamp-4 text-sm leading-6 text-ink-600">{text}</p>
                <a href={reviewsPath} className="mt-auto inline-flex items-center gap-1 self-start pt-3 text-sm font-bold text-primary-700 hover:underline">
                  Read more <ArrowRight size={14} />
                </a>
              </article>
            );
          })}
        </Carousel>
      ) : (
        <div className="mt-4 rounded-card-lg border border-neutral-200 bg-white p-6 text-sm text-ink-500 shadow-card">{t.reviewsEmptySubtitle}</div>
      )}

      <a href={reviewsPath} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:underline">
        View all reviews <ArrowRight size={15} />
      </a>
    </section>
  );
}
