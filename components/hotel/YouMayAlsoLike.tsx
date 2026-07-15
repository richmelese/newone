import { useLanguage } from '@/lib/language';
import { similarHotels } from '@/lib/curation';
import HotelCard from '@/components/hotel/HotelCard';
import Reveal from '@/components/ui/Reveal';
import type { Hotel } from '@/types';

export default function YouMayAlsoLike({ hotel }: { hotel: Hotel }) {
  const { t } = useLanguage();
  const suggestions = similarHotels(hotel);

  if (suggestions.length === 0) return null;

  return (
    <Reveal className="border-t border-neutral-200 pt-8">
      <h2 className="font-heading text-xl font-bold text-ink-900 sm:text-2xl">{t.youMayAlsoLike}</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {suggestions.map((h, i) => (
          <HotelCard key={h.id} hotel={h} variant="detailed" revealIndex={i} />
        ))}
      </div>
    </Reveal>
  );
}
