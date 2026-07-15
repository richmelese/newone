import { Scale } from 'lucide-react';
import clsx from 'clsx';
import { useCompare } from '@/lib/compare';
import { useLanguage } from '@/lib/language';

type CompareButtonProps = {
  hotelId: string;
  variant?: 'floating' | 'inline';
  className?: string;
};

export default function CompareButton({ hotelId, variant = 'floating', className }: CompareButtonProps) {
  const { isComparing, toggleCompare, hydrated, atMax } = useCompare();
  const { t } = useLanguage();
  const active = hydrated && isComparing(hotelId);
  const disabled = hydrated && !active && atMax;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    toggleCompare(hotelId);
  };

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title={disabled ? t.compareMax : undefined}
        className={clsx(
          'inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-semibold transition-colors',
          active ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-neutral-300 text-ink-700 hover:border-primary-400',
          disabled && 'cursor-not-allowed opacity-50',
          className,
        )}
        aria-pressed={active}
      >
        <Scale size={16} />
        {active ? t.removeFromCompare : t.addToCompare}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={disabled ? t.compareMax : active ? t.removeFromCompare : t.addToCompare}
      aria-label={active ? t.removeFromCompare : t.addToCompare}
      aria-pressed={active}
      className={clsx(
        'flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-soft transition-colors hover:text-primary-700',
        active && 'bg-primary-600 text-white hover:text-white',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <Scale size={16} />
    </button>
  );
}
