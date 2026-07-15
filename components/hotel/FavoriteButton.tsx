import { Heart } from 'lucide-react';
import clsx from 'clsx';
import { useFavorites } from '@/lib/favorites';
import { useLanguage } from '@/lib/language';

type FavoriteButtonProps = {
  hotelId: string;
  variant?: 'floating' | 'inline';
  className?: string;
};

export default function FavoriteButton({ hotelId, variant = 'floating', className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const { t } = useLanguage();
  const active = hydrated && isFavorite(hotelId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(hotelId);
  };

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={clsx(
          'inline-flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-semibold transition-colors',
          active ? 'border-danger-500 bg-danger-500/10 text-danger-500' : 'border-neutral-300 text-ink-700 hover:border-danger-500 hover:text-danger-500',
          className,
        )}
        aria-pressed={active}
      >
        <Heart size={16} fill={active ? 'currentColor' : 'none'} />
        {active ? t.removeFromFavorites : t.addToFavorites}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? t.removeFromFavorites : t.addToFavorites}
      aria-pressed={active}
      className={clsx(
        'flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-soft transition-colors hover:text-danger-500',
        active && 'text-danger-500',
        className,
      )}
    >
      <Heart size={17} fill={active ? 'currentColor' : 'none'} />
    </button>
  );
}
