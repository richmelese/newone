import { serviceConfig } from '@/data/serviceConfig';
import type { EntityReview, ServiceType } from '@/types';

export function computeAverage(reviews: EntityReview[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export type StarDistribution = { star: 5 | 4 | 3 | 2 | 1; count: number; percent: number }[];

export function computeDistribution(reviews: EntityReview[]): StarDistribution {
  const counts: Record<5 | 4 | 3 | 2 | 1, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 5 | 4 | 3 | 2 | 1;
    counts[star] += 1;
  });
  const total = reviews.length || 1;
  return [5, 4, 3, 2, 1].map((star) => {
    const count = counts[star as 5 | 4 | 3 | 2 | 1];
    return { star: star as 5 | 4 | 3 | 2 | 1, count, percent: Math.round((count / total) * 100) };
  });
}

export function computeSubRatingAverages(reviews: EntityReview[], type: ServiceType): { key: string; average: number }[] {
  const keys = serviceConfig[type].subRatings.map((s) => s.key);
  return keys.map((key) => {
    const values = reviews.map((r) => r.subRatings[key]).filter((v): v is number => typeof v === 'number');
    const average = values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
    return { key, average };
  });
}
