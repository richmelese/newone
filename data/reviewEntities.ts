import type { ReviewEntityRef, ServiceType } from '@/types';
import { hotels } from '@/data/hotels';
import { experiencePhoto } from '@/lib/images';

const hotelEntities: ReviewEntityRef[] = hotels.map((hotel) => ({
  id: hotel.id,
  type: 'hotel',
  name: { en: hotel.name, am: hotel.name },
  photo: hotel.photos[0],
}));

const demoEntities: ReviewEntityRef[] = [
  {
    id: 'demo-yod-abyssinia',
    type: 'restaurant',
    name: { en: 'Yod Abyssinia Cultural Restaurant', am: 'ዮድ አቢሲኒያ ባህላዊ ምግብ ቤት' },
    photo: experiencePhoto('demo-yod-abyssinia', 'Food', 900),
  },
  {
    id: 'demo-kategna-restaurant',
    type: 'restaurant',
    name: { en: 'Kategna Traditional Restaurant', am: 'ካጠኛ ባህላዊ ምግብ ቤት' },
    photo: experiencePhoto('demo-kategna-restaurant', 'Food', 900),
  },
  {
    id: 'demo-lalibela-heritage-walk',
    type: 'thing_to_do',
    name: { en: 'Lalibela Rock Churches Heritage Walk', am: 'የላሊበላ ዓለት ውቅር አብያተ ክርስቲያናት ቅርስ ጉዞ' },
    photo: experiencePhoto('demo-lalibela-heritage-walk', 'History', 900),
  },
  {
    id: 'demo-addis-coffee-ceremony',
    type: 'thing_to_do',
    name: { en: 'Traditional Coffee Ceremony Experience', am: 'ባህላዊ የቡና ሥነ ሥርዓት ተሞክሮ' },
    photo: experiencePhoto('demo-addis-coffee-ceremony', 'Coffee House', 900),
  },
  {
    id: 'demo-simien-mountains-tour',
    type: 'tour',
    name: { en: 'Simien Mountains 3-Day Trekking Tour', am: 'የሰሜን ተራሮች የ3 ቀን የእግር ጉዞ' },
    photo: experiencePhoto('demo-simien-mountains-tour', 'Nature', 900),
  },
  {
    id: 'demo-omo-valley-tour',
    type: 'tour',
    name: { en: 'Omo Valley Cultural Tour', am: 'የኦሞ ሸለቆ ባህላዊ ጉዞ' },
    photo: experiencePhoto('demo-omo-valley-tour', 'Wildlife', 900),
  },
  {
    id: 'demo-boston-day-spa',
    type: 'wellness',
    name: { en: 'Boston Day Spa & Wellness', am: 'ቦስተን የቀን ስፓና ጤንነት ማዕከል' },
    photo: experiencePhoto('demo-boston-day-spa', 'Relaxation', 900),
  },
  {
    id: 'demo-serenity-spa-bahirdar',
    type: 'wellness',
    name: { en: 'Serenity Spa Bahir Dar', am: 'ሴሬኒቲ ስፓ ባሕር ዳር' },
    photo: experiencePhoto('demo-serenity-spa-bahirdar', 'Beauty Salon', 900),
  },
  {
    id: 'demo-h2o-lounge',
    type: 'nightlife',
    name: { en: 'H2O Lounge & Rooftop Bar', am: 'H2O ላውንጅና የጣሪያ ላይ ባር' },
    photo: experiencePhoto('demo-h2o-lounge', 'Nightlife', 900),
  },
  {
    id: 'demo-fendika-cultural-club',
    type: 'nightlife',
    name: { en: 'Fendika Cultural Club', am: 'ፈንድቃ ባህላዊ ክለብ' },
    photo: experiencePhoto('demo-fendika-cultural-club', 'Nightlife', 900),
  },
];

export const reviewEntities: ReviewEntityRef[] = [...hotelEntities, ...demoEntities];

export function getReviewEntity(type: ServiceType, id: string): ReviewEntityRef | undefined {
  return reviewEntities.find((entity) => entity.type === type && entity.id === id);
}

export function getReviewEntitiesByType(type: ServiceType): ReviewEntityRef[] {
  return reviewEntities.filter((entity) => entity.type === type);
}
