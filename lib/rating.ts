export type RatingBreakdown = { star: 5 | 4 | 3 | 2 | 1; percent: number; count: number }[];

/** Synthesizes a plausible star-distribution from an average rating + review count. */
export function estimateRatingBreakdown(guestRating: number, reviewCount: number): RatingBreakdown {
  const weights = [5, 4, 3, 2, 1].map((star) => {
    const distance = Math.abs(guestRating - star);
    return Math.max(0.02, 1 - distance / 2.6);
  });
  const total = weights.reduce((sum, w) => sum + w, 0);
  return [5, 4, 3, 2, 1].map((star, i) => {
    const percent = Math.round((weights[i] / total) * 100);
    return { star: star as 5 | 4 | 3 | 2 | 1, percent, count: Math.max(1, Math.round((percent / 100) * reviewCount)) };
  });
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Deterministic "N people found this helpful" count derived from a review id. */
export function helpfulCountFor(reviewId: string): number {
  return 3 + (hashString(reviewId) % 38);
}

/** Maps a 0-5 guest rating to a Booking.com-style 0-10 score. */
export function ratingScore10(rating5: number): number {
  return Math.round(rating5 * 2 * 10) / 10;
}

export type RatingQuality = 'excellent' | 'veryGood' | 'good' | 'fair';

/** Buckets a 0-10 score into a quality label key. */
export function ratingQuality(score10: number): RatingQuality {
  if (score10 >= 8.5) return 'excellent';
  if (score10 >= 7) return 'veryGood';
  if (score10 >= 5.5) return 'good';
  return 'fair';
}
