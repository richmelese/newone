import { History } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { useViewedHistory } from '@/lib/viewedHistory';
import { getHotel } from '@/data/hotels';
import HotelCard from '@/components/hotel/HotelCard';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

export default function HistoryList() {
  const { t } = useLanguage();
  const { history, hydrated } = useViewedHistory();

  if (!hydrated) return null;

  const hotels = history.map((h) => getHotel(h.hotelId)).filter((h): h is NonNullable<typeof h> => Boolean(h));

  if (hotels.length === 0) {
    return (
      <EmptyState
        icon={History}
        title={t.historyEmptyTitle}
        subtitle={t.historyEmptySubtitle}
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
