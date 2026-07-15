import { Star } from 'lucide-react';

type StarRatingProps = {
  rating: number;
  reviewCount: number;
};

export default function StarRating({ rating, reviewCount }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Star size={15} className="shrink-0 text-accent-500" fill="currentColor" strokeWidth={0} />
      <span className="text-sm font-semibold text-ink-800">{rating.toFixed(1)}</span>
      <span className="text-sm text-ink-500">({reviewCount.toLocaleString()})</span>
    </div>
  );
}
