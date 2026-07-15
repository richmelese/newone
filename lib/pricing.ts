import type { Hotel } from '@/types';

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

export function getSaleInfo(hotel: Hotel): { percentOff: number; originalPriceEtb: number } | null {
  if (!hotel.badges.includes('featured')) return null;
  const percentOff = 10 + (hashString(hotel.id) % 4) * 5;
  const originalPriceEtb = Math.round(hotel.priceFromEtb / (1 - percentOff / 100) / 100) * 100;
  return { percentOff, originalPriceEtb };
}
