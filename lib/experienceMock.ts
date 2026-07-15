import type { Localized, Review } from '@/types';

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

const REVIEW_AUTHORS = ['Hanna T.', 'Michael O.', 'Selam G.', 'Daniel K.', 'Aisha M.', 'Yosef B.', 'Marta W.', 'Liya A.', 'Tom R.', 'Sara N.'];

const REVIEW_TEMPLATES: { rating: number; comment: Localized }[] = [
  { rating: 5, comment: { en: 'Exactly what I hoped for — friendly staff and a great atmosphere.', am: 'የፈለግኩት በትክክል ነው — ወዳጃዊ ሠራተኞችና ጥሩ ድባብ።' } },
  { rating: 4, comment: { en: 'Really enjoyed it, though it got a bit busy on the weekend.', am: 'በጣም ደስ ብሎኛል፣ ቢሆንም ቅዳሜ እሁድ ላይ ትንሽ ተጨናንቆ ነበር።' } },
  { rating: 5, comment: { en: 'A highlight of our trip — would recommend to anyone visiting.', am: 'የጉዞአችን ድንቅ አካል ነበር — ለሚጎበኙ ሁሉ እመክራለሁ።' } },
  { rating: 4, comment: { en: 'Good value and easy to find. Staff were welcoming.', am: 'ጥሩ ዋጋና ለማግኘት ቀላል ነው። ሠራተኞቹ ተቀባይ ነበሩ።' } },
  { rating: 5, comment: { en: 'Loved the local touches — felt authentic, not touristy.', am: 'የአካባቢውን ንክኪ ወድጄዋለሁ — ትክክለኛ ስሜት ሰጠኝ እንጂ የቱሪስት አልነበረም።' } },
  { rating: 3, comment: { en: 'Decent experience overall, but service was a little slow.', am: 'በአጠቃላይ መልካም ተሞክሮ ነበር፣ ነገር ግን አገልግሎቱ ትንሽ ቀርፋፋ ነበር።' } },
  { rating: 5, comment: { en: 'One of the best stops on our whole trip — go early to beat the crowds.', am: 'ከጠቅላላ ጉዞአችን ከምርጦቹ አንዱ ነበር። ሰዎች ከመብዛታቸው በፊት ማለዳ ይሂዱ።' } },
  { rating: 4, comment: { en: 'Charming spot with a lot of character. Worth the visit.', am: 'ብዙ ባህርይ ያለው ማራኪ ስፍራ። ጉብኝት ተገቢ ነው።' } },
];

const ANCHOR_DATE = Date.UTC(2026, 5, 15);

/** Deterministic guest rating + review count synthesized from an experience's id, mirroring lib/rating.ts's approach for hotels. */
export function getExperienceRating(experienceId: string): { guestRating: number; reviewCount: number } {
  const hash = hashString(experienceId);
  const guestRating = Math.round((3.9 + (hash % 100) / 100) * 10) / 10;
  const reviewCount = 18 + (hash % 280);
  return { guestRating, reviewCount };
}

/** Deterministic set of 3 reviews synthesized from an experience's id. */
export function getExperienceReviews(experienceId: string): Review[] {
  const hash = hashString(experienceId);
  return Array.from({ length: 3 }, (_, i) => {
    const template = REVIEW_TEMPLATES[(hash + i * 7) % REVIEW_TEMPLATES.length];
    const author = REVIEW_AUTHORS[(hash + i * 13) % REVIEW_AUTHORS.length];
    const daysAgo = 5 + ((hash + i * 31) % 250);
    const date = new Date(ANCHOR_DATE - daysAgo * 86400000).toISOString().slice(0, 10);
    return {
      id: `${experienceId}-review-${i + 1}`,
      author,
      rating: template.rating,
      date,
      comment: template.comment,
    };
  });
}

const HOURS_BY_CATEGORY: Record<string, { day: Localized; time: string }[]> = {
  'Coffee House': [{ day: { en: 'Daily', am: 'በየቀኑ' }, time: '6:00 AM – 8:00 PM' }],
  'Beauty Salon': [
    { day: { en: 'Mon–Sat', am: 'ሰኞ–ቅዳሜ' }, time: '9:00 AM – 7:00 PM' },
    { day: { en: 'Sunday', am: 'እሁድ' }, time: '10:00 AM – 4:00 PM' },
  ],
  'Art Gallery': [{ day: { en: 'Tue–Sun', am: 'ማክሰኞ–እሁድ' }, time: '9:00 AM – 5:00 PM' }],
  Craft: [{ day: { en: 'Mon–Sat', am: 'ሰኞ–ቅዳሜ' }, time: '8:00 AM – 6:00 PM' }],
  Shopping: [{ day: { en: 'Daily', am: 'በየቀኑ' }, time: '7:00 AM – 6:00 PM' }],
  Food: [{ day: { en: 'Daily', am: 'በየቀኑ' }, time: '11:00 AM – 9:00 PM' }],
  Relaxation: [{ day: { en: 'Daily', am: 'በየቀኑ' }, time: '8:00 AM – 6:00 PM' }],
  History: [{ day: { en: 'Daily', am: 'በየቀኑ' }, time: '8:00 AM – 5:00 PM' }],
  Culture: [{ day: { en: 'Daily', am: 'በየቀኑ' }, time: '8:00 AM – 6:00 PM' }],
  Nature: [{ day: { en: 'Daily', am: 'በየቀኑ' }, time: 'Sunrise – sunset' }],
  Wildlife: [{ day: { en: 'Daily', am: 'በየቀኑ' }, time: 'Sunrise – sunset' }],
};

/** Typical opening hours for a category. Omitted for Nightlife, which already shows specific showtimes via `schedule`. */
export function getExperienceHours(category: string): { day: Localized; time: string }[] | undefined {
  return HOURS_BY_CATEGORY[category];
}

/** Categories treated as bookable venues/tours, where reviews and opening hours are shown on the detail page. */
const REVIEW_ENABLED_CATEGORIES = ['Beauty Salon', 'Art Gallery'];

export function hasReviewsEnabled(category: string): boolean {
  return REVIEW_ENABLED_CATEGORIES.includes(category);
}
