import { hotels } from '@/data/hotels';
import type { Hotel } from '@/types';

export function featuredHotels(limit = 8): Hotel[] {
  return [...hotels]
    .filter((h) => h.badges.includes('featured'))
    .sort((a, b) => b.guestRating - a.guestRating || b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

export function topRatedHotels(limit = 8): Hotel[] {
  return [...hotels].sort((a, b) => b.guestRating - a.guestRating || b.reviewCount - a.reviewCount).slice(0, limit);
}

export function travelersFavorites(limit = 8): Hotel[] {
  return [...hotels].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, limit);
}

export function bestValueHotels(limit = 8): Hotel[] {
  return [...hotels]
    .filter((h) => h.guestRating >= 4)
    .sort((a, b) => b.guestRating / b.priceFromEtb - a.guestRating / a.priceFromEtb)
    .slice(0, limit);
}

export function similarHotels(hotel: Hotel, limit = 4): Hotel[] {
  const sameDestination = [...hotels]
    .filter((h) => h.id !== hotel.id && h.destinationSlug === hotel.destinationSlug)
    .sort((a, b) => b.guestRating - a.guestRating);

  if (sameDestination.length >= limit) return sameDestination.slice(0, limit);

  const others = [...hotels]
    .filter((h) => h.id !== hotel.id && h.destinationSlug !== hotel.destinationSlug)
    .sort(
      (a, b) =>
        b.guestRating - a.guestRating ||
        Math.abs(a.priceFromEtb - hotel.priceFromEtb) - Math.abs(b.priceFromEtb - hotel.priceFromEtb),
    );

  return [...sameDestination, ...others].slice(0, limit);
}
