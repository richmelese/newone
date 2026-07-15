import { hotels } from '@/data/hotels';
import type { FilterState, Hotel, SortOption } from '@/types';

export const RESULTS_PAGE_SIZE = 6;

export function sortHotels(list: Hotel[], sort: SortOption = 'recommended'): Hotel[] {
  const sorted = [...list];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.priceFromEtb - b.priceFromEtb);
    case 'price-desc':
      return sorted.sort((a, b) => b.priceFromEtb - a.priceFromEtb);
    case 'rating':
      return sorted.sort((a, b) => b.guestRating - a.guestRating);
    case 'recommended':
    default:
      return sorted.sort((a, b) => b.guestRating / b.priceFromEtb - a.guestRating / a.priceFromEtb);
  }
}

export function filterHotels(filters: FilterState): Hotel[] {
  let list = [...hotels];

  if (filters.destination) {
    list = list.filter((h) => h.destinationSlug === filters.destination);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter((h) => h.name.toLowerCase().includes(q) || h.destinationSlug.toLowerCase().includes(q));
  }
  if (filters.minPrice !== undefined) {
    list = list.filter((h) => h.priceFromEtb >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    list = list.filter((h) => h.priceFromEtb <= filters.maxPrice!);
  }
  if (filters.stars && filters.stars.length > 0) {
    list = list.filter((h) => filters.stars!.includes(h.starRating));
  }
  if (filters.minGuestRating !== undefined) {
    list = list.filter((h) => h.guestRating >= filters.minGuestRating!);
  }
  if (filters.amenities && filters.amenities.length > 0) {
    list = list.filter((h) => filters.amenities!.every((id) => h.amenityIds.includes(id)));
  }
  if (filters.propertyTypes && filters.propertyTypes.length > 0) {
    list = list.filter((h) => filters.propertyTypes!.includes(h.propertyType));
  }

  return sortHotels(list, filters.sort);
}

export function paginate<T>(list: T[], page: number, pageSize = RESULTS_PAGE_SIZE): T[] {
  const start = (Math.max(1, page) - 1) * pageSize;
  return list.slice(start, start + pageSize);
}
