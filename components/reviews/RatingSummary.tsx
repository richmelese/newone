import { useLanguage } from '@/lib/language';
import { ratingQuality, ratingScore10 } from '@/lib/rating';
import { computeAverage, computeDistribution, computeSubRatingAverages } from '@/lib/reviewStats';
import { serviceConfig } from '@/data/serviceConfig';
import type { EntityReview, ServiceType } from '@/types';

const STAR_BAR_COLOR: Record<5 | 4 | 3 | 2 | 1, string> = {
  5: 'bg-success-500',
  4: 'bg-primary-500',
  3: 'bg-amber-500',
  2: 'bg-primary-500',
  1: 'bg-danger-500',
};

const QUALITY_LABEL_KEY = {
  excellent: 'ratingExcellent',
  veryGood: 'ratingVeryGood',
  good: 'ratingGood',
  fair: 'ratingFair',
} as const;

type RatingSummaryProps = {
  reviews: EntityReview[];
  type: ServiceType;
};

export default function RatingSummary({ reviews, type }: RatingSummaryProps) {
  const { t, pick } = useLanguage();
  const average = computeAverage(reviews);
  const distribution = computeDistribution(reviews);
  const subRatings = computeSubRatingAverages(reviews, type);
  const config = serviceConfig[type];
  const qualityLabel = t[QUALITY_LABEL_KEY[ratingQuality(ratingScore10(average))]];

  return (
    <div className="rounded-card-lg bg-white p-5 shadow-card sm:p-6">
      <div className="grid gap-6 sm:grid-cols-[220px_1fr]">
        <div>
          <div className="flex flex-col items-start gap-1 rounded-card bg-primary-50 px-6 py-5">
            <div className="font-heading text-4xl font-extrabold leading-none text-primary-700">
              {average.toFixed(1)}
              <span className="text-lg font-semibold text-primary-400">/5</span>
            </div>
            <div className="font-heading text-sm font-bold text-ink-800">{reviews.length > 0 ? qualityLabel : ''}</div>
            <div className="text-xs text-ink-500">
              {t.basedOnReviewsPrefix} {reviews.length.toLocaleString()} {t.reviewsSuffix}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {distribution.map(({ star, percent, count }) => (
              <div key={star} className="flex items-center gap-3 text-sm">
                <span className="w-10 shrink-0 text-ink-600">{star} ★</span>
                <div className="h-3 flex-1 overflow-hidden rounded-pill bg-neutral-200">
                  <div className={`h-full rounded-pill ${STAR_BAR_COLOR[star]}`} style={{ width: `${percent}%` }} />
                </div>
                <span className="w-8 shrink-0 text-right font-semibold text-ink-500">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-heading text-base font-bold text-ink-800">{t.subRatingsTitle}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {config.subRatings.map((sub) => {
              const entry = subRatings.find((s) => s.key === sub.key);
              const value = entry?.average ?? 0;
              return (
                <div key={sub.key} className="flex items-center justify-between gap-3 rounded-lg bg-neutral-100 px-3.5 py-2.5 text-sm">
                  <span className="font-medium text-ink-700">{pick(sub.label)}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 overflow-hidden rounded-pill bg-neutral-200">
                      <div className="h-full rounded-pill bg-accent-500" style={{ width: `${(value / 5) * 100}%` }} />
                    </div>
                    <span className="w-7 shrink-0 text-right font-semibold text-ink-600">{value > 0 ? value.toFixed(1) : '–'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
