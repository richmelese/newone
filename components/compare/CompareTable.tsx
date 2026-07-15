import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { getAmenity } from '@/data/amenities';
import { getDestination } from '@/data/destinations';
import RatingCircle from '@/components/ui/RatingCircle';
import PriceDisplay from '@/components/ui/PriceDisplay';
import Button from '@/components/ui/Button';
import RevealItem from '@/components/ui/RevealItem';
import { useCompare } from '@/lib/compare';
import type { Hotel } from '@/types';

export default function CompareTable({ hotels }: { hotels: Hotel[] }) {
  const { t, pick } = useLanguage();
  const { removeFromCompare } = useCompare();

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[720px] gap-4" style={{ gridTemplateColumns: `repeat(${hotels.length}, minmax(220px, 1fr))` }}>
        {hotels.map((hotel, i) => {
          const destination = getDestination(hotel.destinationSlug);
          return (
            <RevealItem
              key={hotel.id}
              index={i}
              className="flex flex-col rounded-card-lg bg-white shadow-card transition-shadow duration-300 hover:shadow-lift"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-card-lg">
                <Image src={hotel.photos[0]} alt={hotel.name} fill sizes="260px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeFromCompare(hotel.id)}
                  aria-label={`${t.compareRemoveRow} ${hotel.name}`}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-soft hover:text-danger-500"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-4">
                <Link href={`/hotels/${hotel.slug}`} className="font-heading text-base font-bold text-ink-900 hover:text-primary-700">
                  {hotel.name}
                </Link>

                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">{t.compareLocationRow}</p>
                  <p className="text-sm text-ink-700">{destination?.name}</p>
                  <p className="text-xs text-ink-400">{pick(hotel.neighborhood)}</p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">{t.compareRating}</p>
                  <RatingCircle rating={hotel.guestRating} reviewCount={hotel.reviewCount} reviewsLabel={t.reviewsSuffix} size="sm" />
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">{t.compareAmenitiesRow}</p>
                  <ul className="space-y-1">
                    {hotel.amenityIds.slice(0, 5).map((id) => {
                      const amenity = getAmenity(id);
                      return amenity ? (
                        <li key={id} className="text-sm text-ink-600">
                          {pick(amenity.label)}
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>

                <div className="mt-auto border-t border-neutral-200 pt-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">{t.comparePrice}</p>
                  <PriceDisplay amount={hotel.priceFromEtb} fromLabel={t.fromLabel} perNightLabel={t.perNight} size="md" />
                  <Button href={hotel.bookingActive ? `/redirect/${hotel.slug}` : `/hotels/${hotel.slug}`} fullWidth className="mt-3">
                    {hotel.bookingActive ? t.checkAvailability : t.viewHotel}
                  </Button>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </div>
    </div>
  );
}
