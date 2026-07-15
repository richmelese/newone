import clsx from 'clsx';

type RatingCircleProps = {
  rating: number;
  reviewCount?: number;
  reviewsLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
};

function ratingColor(rating: number) {
  if (rating >= 4.5) return 'bg-primary-600';
  if (rating >= 4) return 'bg-primary-500';
  if (rating >= 3) return 'bg-amber-500';
  return 'bg-ink-400';
}

export default function RatingCircle({ rating, reviewCount, reviewsLabel = 'reviews', size = 'md', className }: RatingCircleProps) {
  return (
    <div className={clsx('inline-flex items-center gap-2.5', className)}>
      <div
        className={clsx(
          'flex items-center justify-center rounded-full font-heading font-bold text-white shrink-0',
          sizeClasses[size],
          ratingColor(rating),
        )}
      >
        {rating.toFixed(1)}
      </div>
      {reviewCount !== undefined && (
        <span className="text-sm text-ink-500">
          <span className="font-semibold text-ink-800">{reviewCount.toLocaleString()}</span> {reviewsLabel}
        </span>
      )}
    </div>
  );
}
