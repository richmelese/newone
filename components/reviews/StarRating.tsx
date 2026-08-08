import { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';
import clsx from 'clsx';

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
  label?: string;
  className?: string;
};

/** Read-only display and interactive 1-5 star input in one component. */
export default function StarRating({ value, onChange, readOnly = false, size = 20, label, className }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const interactive = Boolean(onChange) && !readOnly;

  if (!interactive) {
    const full = Math.floor(value);
    const hasHalf = value - full >= 0.5;
    const empty = 5 - full - (hasHalf ? 1 : 0);
    return (
      <span
        className={clsx('inline-flex items-center gap-0.5 text-amber-500', className)}
        aria-label={label ?? `${value.toFixed(1)} out of 5 stars`}
      >
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

  const displayValue = hoverValue ?? value;

  function commit(next: number) {
    onChange?.(next);
  }

  function handleKeyDown(e: React.KeyboardEvent, star: number) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      commit(Math.min(5, star + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      commit(Math.max(1, star - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      commit(1);
    } else if (e.key === 'End') {
      e.preventDefault();
      commit(5);
    } else if (/^[1-5]$/.test(e.key)) {
      e.preventDefault();
      commit(Number(e.key));
    }
  }

  return (
    <span
      role="radiogroup"
      aria-label={label ?? 'Star rating'}
      className={clsx('inline-flex items-center gap-1', className)}
      onMouseLeave={() => setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayValue;
        const checked = star === Math.round(value);
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            tabIndex={checked || (value === 0 && star === 1) ? 0 : -1}
            onClick={() => commit(star)}
            onMouseEnter={() => setHoverValue(star)}
            onFocus={() => setHoverValue(star)}
            onBlur={() => setHoverValue(null)}
            onKeyDown={(e) => handleKeyDown(e, star)}
            className="rounded-sm text-amber-500 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <Star size={size} className={filled ? 'text-amber-500' : 'text-neutral-300'} fill="currentColor" strokeWidth={0} />
          </button>
        );
      })}
    </span>
  );
}
