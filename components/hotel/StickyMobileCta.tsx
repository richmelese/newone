import { useLanguage } from '@/lib/language';
import PriceDisplay from '@/components/ui/PriceDisplay';
import Button from '@/components/ui/Button';
import type { Hotel } from '@/types';

export default function StickyMobileCta({ hotel }: { hotel: Hotel }) {
  const { t } = useLanguage();

  if (!hotel.bookingActive) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-neutral-200 bg-white/97 px-4 py-3 shadow-lift backdrop-blur-sm lg:hidden">
      <PriceDisplay amount={hotel.priceFromEtb} fromLabel={t.fromLabel} perNightLabel={t.perNight} size="sm" />
      <Button href={`/redirect/${hotel.slug}`} size="md">
        {t.checkAvailability}
      </Button>
    </div>
  );
}
