import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { formatEtb } from '@/lib/format';
import { getAmenity } from '@/data/amenities';
import { getAmenityIcon } from '@/lib/amenityIcons';
import { getSaleInfo } from '@/lib/pricing';
import { ratingQuality, ratingScore10 } from '@/lib/rating';
import ImageCarousel from '@/components/ui/ImageCarousel';
import RatingStars from '@/components/ui/RatingStars';
import Button from '@/components/ui/Button';
import RevealItem from '@/components/ui/RevealItem';
import FavoriteButton from './FavoriteButton';
import type { Hotel } from '@/types';

const qualityLabelKey = {
  excellent: 'ratingExcellent',
  veryGood: 'ratingVeryGood',
  good: 'ratingGood',
  fair: 'ratingFair',
} as const;

type HotelListCardProps = {
  hotel: Hotel;
  revealIndex?: number;
};

export default function HotelListCard({ hotel, revealIndex = 0 }: HotelListCardProps) {
  const { t, pick } = useLanguage();
  const visibleAmenities = hotel.amenityIds.slice(0, 3).map((id) => getAmenity(id)).filter(Boolean);
  const sale = getSaleInfo(hotel);
  const hasFreeCancellation = /free cancellation|ነጻ ስረዛ/i.test(pick(hotel.policies.cancellation));
  const hasFreeBreakfast = hotel.amenityIds.includes('breakfast');
  const score = ratingScore10(hotel.guestRating);
  const cheapestRoom = [...hotel.roomTypes].sort((a, b) => a.priceFromEtb - b.priceFromEtb)[0];

  return (
    <RevealItem index={revealIndex}>
      <article className="flex flex-col gap-4 rounded-card-lg bg-white p-3 shadow-card ring-1 ring-black/5 transition-all duration-300 hover:shadow-lift hover:ring-accent-300 sm:flex-row">
        <div className="relative sm:w-56 sm:shrink-0">
          <Link href={`/hotels/${hotel.slug}`} className="block">
            <ImageCarousel photos={hotel.photos.slice(0, 5)} alt={hotel.name} aspectClassName="aspect-[4/3]" />
          </Link>
          <div className="absolute right-2 top-2">
            <FavoriteButton hotelId={hotel.id} />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:py-1">
          <div>
            <Link
              href={`/hotels/${hotel.slug}`}
              className="font-heading text-lg font-bold text-primary-700 hover:underline"
            >
              {hotel.name}
            </Link>
            <div className="mt-1">
              <RatingStars rating={hotel.starRating} size={13} />
            </div>
          </div>

          <p className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
            <MapPin size={14} className="shrink-0" />
            <span className="line-clamp-1">{pick(hotel.neighborhood)}</span>
            <Link href={`/hotels/${hotel.slug}#location`} className="font-semibold text-primary-700 hover:underline">
              {t.showOnMap}
            </Link>
          </p>

          {cheapestRoom && (
            <p className="text-sm font-semibold text-ink-800">{pick(cheapestRoom.name)}</p>
          )}

          {(hasFreeCancellation || hasFreeBreakfast) && (
            <div className="flex flex-col gap-0.5 text-sm font-medium text-success-500">
              {hasFreeCancellation && <span>✓ {t.freeCancellation}</span>}
              {hasFreeBreakfast && <span>✓ {t.freeBreakfast}</span>}
            </div>
          )}

          {visibleAmenities.length > 0 && (
            <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
              {visibleAmenities.map((amenity) => {
                const Icon = getAmenityIcon(amenity!.icon);
                return (
                  <span
                    key={amenity!.id}
                    title={pick(amenity!.label)}
                    className="inline-flex items-center gap-1 rounded-pill bg-neutral-100 px-2 py-1 text-xs font-medium text-ink-600"
                  >
                    <Icon size={12} />
                    {pick(amenity!.label)}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-row items-end justify-between gap-3 border-t border-neutral-200 pt-3 sm:w-40 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 sm:text-right">
          <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-1">
            <span className="text-sm font-semibold text-ink-800">{t[qualityLabelKey[ratingQuality(score)]]}</span>
            <span className="flex h-9 w-11 items-center justify-center rounded-lg bg-primary-600 font-heading text-sm font-bold text-white">
              {score.toFixed(1)}
            </span>
          </div>

          <div className="flex flex-col items-end">
            {sale && (
              <span className="text-xs font-normal text-ink-400 line-through">{formatEtb(sale.originalPriceEtb)}</span>
            )}
            <p className="font-heading text-lg font-bold leading-tight text-ink-900">{formatEtb(hotel.priceFromEtb)}</p>
            <span className="text-xs text-ink-400">{t.perNight}</span>
            <Button href={`/hotels/${hotel.slug}`} size="sm" className="mt-2">
              {t.checkAvailability}
            </Button>
          </div>
        </div>
      </article>
    </RevealItem>
  );
}
