import type { Localized } from '@/types';
import { getDestination } from './destinations';

export type Promotion = {
  id: string;
  destinationSlug: string;
  photo: string;
  badge: Localized;
  title: Localized;
  subtitle: Localized;
  discount: Localized;
  cta: Localized;
};

function photoFor(slug: string): string {
  return getDestination(slug)?.heroPhoto ?? getDestination('addis-ababa')!.heroPhoto;
}

export const promotions: Promotion[] = [
  {
    id: 'lakeside-escape',
    destinationSlug: 'bahir-dar',
    photo: photoFor('bahir-dar'),
    badge: { en: 'Limited-time offer', am: 'የተወሰነ ጊዜ ቅናሽ' },
    title: { en: 'Lakeside escape on Lake Tana', am: 'በጣና ሐይቅ ዳርቻ ማምለጫ' },
    subtitle: {
      en: 'Save up to 20% at Bahir Dar’s top lakeside resorts this month.',
      am: 'በዚህ ወር በባሕር ዳር ከፍተኛ ደረጃ ያላቸው የሐይቅ ዳርቻ ሪዞርቶች ላይ እስከ 20% ቅናሽ ያግኙ።',
    },
    discount: { en: '20% OFF', am: '20% ቅናሽ' },
    cta: { en: 'Explore Bahir Dar stays', am: 'የባሕር ዳር መቆያዎችን ይመልከቱ' },
  },
  {
    id: 'highland-pilgrimage',
    destinationSlug: 'lalibela',
    photo: photoFor('lalibela'),
    badge: { en: 'This week only', am: 'በዚህ ሳምንት ብቻ' },
    title: { en: 'Highland pilgrimage getaway', am: 'የኮረብታማ አካባቢ የሐጅ ጉዞ' },
    subtitle: {
      en: 'Book 3 nights near Lalibela’s rock-hewn churches and breakfast is on us.',
      am: 'በላሊበላ ከዓለት በተፈለፈሉ አብያተ ክርስቲያናት አቅራቢያ 3 ሌሊት ያስይዙ፣ ቁርስ ከእኛ ነው።',
    },
    discount: { en: 'FREE BREAKFAST', am: 'ነፃ ቁርስ' },
    cta: { en: 'Explore Lalibela stays', am: 'የላሊበላ መቆያዎችን ይመልከቱ' },
  },
  {
    id: 'capital-city-break',
    destinationSlug: 'addis-ababa',
    photo: photoFor('addis-ababa'),
    badge: { en: 'Ends soon', am: 'በቅርቡ ያበቃል' },
    title: { en: 'City break in the capital', am: 'በዋና ከተማዋ የከተማ እረፍት' },
    subtitle: {
      en: 'Up to 15% off boutique hotels across Addis Ababa, plus free late checkout.',
      am: 'በአዲስ አበባ ውስጥ ባሉ ምርጥ ሆቴሎች ላይ እስከ 15% ቅናሽ፣ እንዲሁም ነፃ የዘገየ ቼክ አውት።',
    },
    discount: { en: '15% OFF', am: '15% ቅናሽ' },
    cta: { en: 'Explore Addis Ababa stays', am: 'የአዲስ አበባ መቆያዎችን ይመልከቱ' },
  },
];
