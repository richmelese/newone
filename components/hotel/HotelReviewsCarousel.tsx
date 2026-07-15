import { Star, ThumbsUp } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { formatDate } from '@/lib/format';
import { helpfulCountFor } from '@/lib/rating';
import Carousel from '@/components/ui/Carousel';
import RatingStars from '@/components/ui/RatingStars';
import RevealItem from '@/components/ui/RevealItem';
import type { Review } from '@/types';

const AVATAR_COLORS = ['bg-primary-600', 'bg-primary-500', 'bg-ink-700', 'bg-primary-400'];

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

type HotelReviewsCarouselProps = {
  reviews: Review[];
  guestRating: number;
  reviewCount: number;
};

export default function HotelReviewsCarousel({ reviews, guestRating, reviewCount }: HotelReviewsCarouselProps) {
  const { language, pick, t } = useLanguage();

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-bold text-ink-900">{t.hotelReviews}</h2>
        <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink-700">
          <Star size={15} className="fill-accent-500 text-accent-500" />
          {guestRating.toFixed(1)}
          <span className="font-normal text-ink-400">
            ({reviewCount.toLocaleString()} {t.reviewsSuffix})
          </span>
        </span>
      </div>

      <Carousel className="mt-4">
        {reviews.map((review, i) => {
          const colorIndex = review.id.charCodeAt(review.id.length - 1) % AVATAR_COLORS.length;
          return (
            <RevealItem
              key={review.id}
              index={i}
              className="w-[280px] shrink-0 snap-start rounded-card-lg border border-neutral-200 bg-white p-5 shadow-card sm:w-[320px]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${AVATAR_COLORS[colorIndex]}`}>
                    {initials(review.author)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{review.author}</p>
                    <p className="text-xs text-ink-400">{formatDate(review.date, language)}</p>
                  </div>
                </div>
                <RatingStars rating={review.rating} size={14} className="shrink-0" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{pick(review.comment)}</p>
              <button type="button" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 hover:text-primary-700">
                <ThumbsUp size={14} />
                {t.reviewHelpfulPrefix} ({helpfulCountFor(review.id)})
              </button>
            </RevealItem>
          );
        })}
      </Carousel>
    </div>
  );
}
