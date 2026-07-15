import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { formatEtb } from '@/lib/format';
import { getAmenity } from '@/data/amenities';
import { getAmenityIcon } from '@/lib/amenityIcons';
import { getSaleInfo } from '@/lib/pricing';
import ImageCarousel from '@/components/ui/ImageCarousel';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import RevealItem from '@/components/ui/RevealItem';
import TiltSurface from '@/components/ui/TiltSurface';
import FavoriteButton from './FavoriteButton';
import CompareButton from './CompareButton';
import type { Hotel } from '@/types';

type HotelCardProps = {
  hotel: Hotel;
  variant?: 'compact' | 'detailed';
  showFeaturedBadge?: boolean;
  revealIndex?: number;
};

export default function HotelCard({ hotel, variant = 'compact', showFeaturedBadge = false, revealIndex = 0 }: HotelCardProps) {
  const { t, pick } = useLanguage();
  const detailed = variant === 'detailed';
  const visibleAmenities = hotel.amenityIds.slice(0, 3).map((id) => getAmenity(id)).filter(Boolean);
  const extraAmenityCount = Math.max(0, hotel.amenityIds.length - visibleAmenities.length);
  const sale = detailed ? getSaleInfo(hotel) : null;
  const hasFreeCancellation = /free cancellation|ነጻ ስረዛ/i.test(pick(hotel.policies.cancellation));
  const hasFreeBreakfast = hotel.amenityIds.includes('breakfast');

  return (
    <RevealItem index={revealIndex} className="h-full">
      <TiltSurface className="h-full" innerClassName="h-full rounded-card-lg" maxTilt={5}>
        <article className="group relative flex h-full flex-col rounded-card-lg bg-white shadow-card ring-1 ring-black/5 transition-[box-shadow,ring-color] duration-300 hover:shadow-lift hover:ring-accent-300 [transform-style:preserve-3d]">
          <div className="depth-layer-sm relative overflow-hidden rounded-t-card-lg">
            <Link href={`/hotels/${hotel.slug}`} className="block">
              <ImageCarousel photos={hotel.photos.slice(0, 5)} alt={hotel.name} aspectClassName="aspect-[6/5]" />
            </Link>
            <div className="absolute right-3 top-3 flex flex-col items-end gap-2">
              <FavoriteButton hotelId={hotel.id} />
              <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <CompareButton hotelId={hotel.id} />
              </span>
            </div>
            <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
              {sale && (
                <span className="rounded-pill bg-accent-500 px-2.5 py-1 text-xs font-bold text-white shadow-soft">
                  {t.saleLabel} -{sale.percentOff}%
                </span>
              )}
              {showFeaturedBadge && <Badge kind="featured" label={t.badgeFeatured} />}
            </div>
          </div>

          <div className="depth-layer flex flex-1 flex-col gap-2 rounded-b-card-lg bg-white p-5">
            <Link
              href={`/hotels/${hotel.slug}`}
              className="line-clamp-1 font-heading text-lg font-bold leading-snug text-ink-900 transition-colors hover:text-accent-600"
            >
              {hotel.name}
            </Link>

            {detailed && (
              <>
                <p className="flex items-center gap-1.5 text-sm text-ink-500">
                  <MapPin size={14} className="shrink-0" />
                  <span className="line-clamp-1">{pick(hotel.neighborhood)}</span>
                </p>
                {(hasFreeCancellation || hasFreeBreakfast) && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-medium text-success-600">
                    {hasFreeCancellation && <span>{t.freeCancellation}</span>}
                    {hasFreeCancellation && hasFreeBreakfast && <span className="text-ink-300">·</span>}
                    {hasFreeBreakfast && <span>{t.freeBreakfast}</span>}
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-between gap-2">
              <StarRating rating={hotel.guestRating} reviewCount={hotel.reviewCount} />
              {sale ? (
                <span className="flex shrink-0 flex-col items-end leading-tight">
                  <span className="text-xs font-normal text-ink-400 line-through">{formatEtb(sale.originalPriceEtb)}</span>
                  <span className="text-sm font-semibold text-ink-800">
                    {formatEtb(hotel.priceFromEtb)} <span className="font-normal text-ink-400">{t.perNight}</span>
                  </span>
                </span>
              ) : (
                <span className="shrink-0 text-sm font-semibold text-ink-800">
                  {formatEtb(hotel.priceFromEtb)} <span className="font-normal text-ink-400">{t.perNight}</span>
                </span>
              )}
            </div>

            {detailed && visibleAmenities.length > 0 && (
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
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
                {extraAmenityCount > 0 && (
                  <span className="rounded-pill bg-neutral-100 px-2 py-1 text-xs font-medium text-ink-500">
                    +{extraAmenityCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </article>
      </TiltSurface>
    </RevealItem>
  );
}
