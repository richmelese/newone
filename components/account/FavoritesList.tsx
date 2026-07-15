import { useLanguage } from '@/lib/language';
import { useFavorites } from '@/lib/favorites';
import { getHotel } from '@/data/hotels';
import HotelCard from '@/components/hotel/HotelCard';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { Heart } from 'lucide-react';

export default function FavoritesList() {
  const { t } = useLanguage();
  const { favorites, hydrated } = useFavorites();

  if (!hydrated) return null;

  const hotels = favorites.map((f) => getHotel(f.hotelId)).filter((h): h is NonNullable<typeof h> => Boolean(h));

  if (hotels.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title={t.favoritesEmptyTitle}
        subtitle={t.favoritesEmptySubtitle}
        action={<Button href="/search">{t.compareBrowse}</Button>}
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {hotels.map((hotel, i) => (
        <HotelCard key={hotel.id} hotel={hotel} revealIndex={i} />
      ))}
    </div>
  );
}
