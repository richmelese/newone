import type { ServiceType, TripType, Localized } from '@/types';

export type SubRatingConfig = { key: string; label: Localized };

export const SERVICE_TYPES: ServiceType[] = ['hotel', 'restaurant', 'thing_to_do', 'tour', 'wellness', 'nightlife'];

export const serviceConfig: Record<ServiceType, { subRatings: SubRatingConfig[] }> = {
  hotel: {
    subRatings: [
      { key: 'cleanliness', label: { en: 'Cleanliness', am: 'ንጽህና' } },
      { key: 'service', label: { en: 'Service', am: 'አገልግሎት' } },
      { key: 'value', label: { en: 'Value', am: 'ዋጋ' } },
      { key: 'location', label: { en: 'Location', am: 'አካባቢ' } },
    ],
  },
  restaurant: {
    subRatings: [
      { key: 'food', label: { en: 'Food', am: 'ምግብ' } },
      { key: 'service', label: { en: 'Service', am: 'አገልግሎት' } },
      { key: 'value', label: { en: 'Value', am: 'ዋጋ' } },
      { key: 'atmosphere', label: { en: 'Atmosphere', am: 'ድባብ' } },
    ],
  },
  thing_to_do: {
    subRatings: [
      { key: 'value', label: { en: 'Value', am: 'ዋጋ' } },
      { key: 'fun', label: { en: 'Fun', am: 'መዝናኛነት' } },
      { key: 'organization', label: { en: 'Organization', am: 'አደረጃጀት' } },
      { key: 'guide', label: { en: 'Guide', am: 'መሪ' } },
    ],
  },
  tour: {
    subRatings: [
      { key: 'value', label: { en: 'Value', am: 'ዋጋ' } },
      { key: 'fun', label: { en: 'Fun', am: 'መዝናኛነት' } },
      { key: 'organization', label: { en: 'Organization', am: 'አደረጃጀት' } },
      { key: 'guide', label: { en: 'Guide', am: 'መሪ' } },
    ],
  },
  wellness: {
    subRatings: [
      { key: 'cleanliness', label: { en: 'Cleanliness', am: 'ንጽህና' } },
      { key: 'service', label: { en: 'Service', am: 'አገልግሎት' } },
      { key: 'value', label: { en: 'Value', am: 'ዋጋ' } },
      { key: 'relaxation', label: { en: 'Relaxation', am: 'መዝናናት' } },
    ],
  },
  nightlife: {
    subRatings: [
      { key: 'atmosphere', label: { en: 'Atmosphere', am: 'ድባብ' } },
      { key: 'service', label: { en: 'Service', am: 'አገልግሎት' } },
      { key: 'value', label: { en: 'Value', am: 'ዋጋ' } },
      { key: 'music', label: { en: 'Music', am: 'ሙዚቃ' } },
    ],
  },
};

export const TRIP_TYPES: TripType[] = ['solo', 'couple', 'family', 'friends', 'business'];

export const SERVICE_TYPE_LABELS: Record<ServiceType, Localized> = {
  hotel: { en: 'Hotels', am: 'ሆቴሎች' },
  restaurant: { en: 'Restaurants', am: 'ምግብ ቤቶች' },
  thing_to_do: { en: 'Things to do', am: 'መዝናኛዎች' },
  tour: { en: 'Tours', am: 'ጉዞዎች' },
  wellness: { en: 'Wellness', am: 'ጤንነት' },
  nightlife: { en: 'Nightlife', am: 'የምሽት ህይወት' },
};

export const TRIP_TYPE_LABELS: Record<TripType, Localized> = {
  solo: { en: 'Solo', am: 'ብቻዬን' },
  couple: { en: 'Couple', am: 'ጥንዶች' },
  family: { en: 'Family', am: 'ቤተሰብ' },
  friends: { en: 'Friends', am: 'ጓደኞች' },
  business: { en: 'Business', am: 'ንግድ' },
};
