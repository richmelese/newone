import { useLanguage } from '@/lib/language';
import { estimateRatingBreakdown, ratingQuality, ratingScore10 } from '@/lib/rating';

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

export default function RatingBreakdown({ guestRating, reviewCount }: { guestRating: number; reviewCount: number }) {
  const { t } = useLanguage();
  const breakdown = estimateRatingBreakdown(guestRating, reviewCount);
  const qualityLabel = t[QUALITY_LABEL_KEY[ratingQuality(ratingScore10(guestRating))]];

  return (
    <div className="rounded-card-lg bg-white p-5 shadow-card">
      <h3 className="mb-4 font-heading text-base font-bold text-ink-800">{t.ratingBreakdownTitle}</h3>

      <div className="flex flex-col items-start gap-1 rounded-card bg-primary-50 px-6 py-5">
        <div className="font-heading text-4xl font-extrabold leading-none text-primary-700">
          {guestRating.toFixed(1)}
          <span className="text-lg font-semibold text-primary-400">/5</span>
        </div>
        <div className="font-heading text-sm font-bold text-ink-800">{qualityLabel}</div>
        <div className="text-xs text-ink-500">
          {t.basedOnReviewsPrefix} {reviewCount.toLocaleString()} {t.reviewsSuffix}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {breakdown.map(({ star, percent, count }) => (
          <div key={star} className="flex items-center gap-3 text-sm">
            <span className="w-10 shrink-0 text-ink-600">{star} ★</span>
            <div className="h-3 flex-1 overflow-hidden rounded-pill bg-neutral-200">
              <div className={`h-full rounded-pill ${STAR_BAR_COLOR[star]}`} style={{ width: `${percent}%` }} />
            </div>
            <span className="w-10 shrink-0 text-right font-semibold text-ink-500">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
