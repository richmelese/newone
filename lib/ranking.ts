import type { Hotel } from '@/types';
import { hotels } from '@/data/hotels';

export function rankWithinDestination(hotel: Hotel): { rank: number; total: number } {
  const peers = hotels
    .filter((h) => h.destinationSlug === hotel.destinationSlug)
    .sort((a, b) => b.guestRating - a.guestRating || b.reviewCount - a.reviewCount);
  const rank = peers.findIndex((h) => h.id === hotel.id) + 1;
  return { rank: rank || 1, total: peers.length };
}
