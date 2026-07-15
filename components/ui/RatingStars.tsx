import { Star, StarHalf } from 'lucide-react';

type RatingStarsProps = {
  rating: number;
  size?: number;
  className?: string;
};

export default function RatingStars({ rating, size = 16, className }: RatingStarsProps) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <span className={`inline-flex items-center gap-0.5 text-amber-500 ${className ?? ''}`} aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} size={size} fill="currentColor" strokeWidth={0} />
      ))}
      {hasHalf && <StarHalf size={size} fill="currentColor" strokeWidth={0} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} size={size} className="text-neutral-300" fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}
