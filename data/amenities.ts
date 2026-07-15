import type { Amenity } from '@/types';

export const amenities: Amenity[] = [
  { id: 'wifi', icon: 'Wifi', label: { en: 'Free Wi-Fi', am: 'ነጻ ዋይፋይ' } },
  { id: 'parking', icon: 'ParkingCircle', label: { en: 'Free parking', am: 'ነጻ ማቆሚያ' } },
  { id: 'pool', icon: 'Waves', label: { en: 'Swimming pool', am: 'የመዋኛ ገንዳ' } },
  { id: 'restaurant', icon: 'UtensilsCrossed', label: { en: 'On-site restaurant', am: 'የምግብ ቤት አገልግሎት' } },
  { id: 'gym', icon: 'Dumbbell', label: { en: 'Fitness center', am: 'የአካል ብቃት ማዕከል' } },
  { id: 'spa', icon: 'Sparkles', label: { en: 'Spa & wellness', am: 'ስፓ እና ጤንነት' } },
  { id: 'ac', icon: 'Snowflake', label: { en: 'Air conditioning', am: 'የአየር ማቀዝቀዣ' } },
  { id: 'bar', icon: 'Wine', label: { en: 'Bar / lounge', am: 'ባር / ማረፊያ' } },
  { id: 'breakfast', icon: 'Coffee', label: { en: 'Breakfast included', am: 'ቁርስ ተካትቷል' } },
  { id: 'pets', icon: 'PawPrint', label: { en: 'Pet friendly', am: 'የቤት እንስሳት ተቀባይነት አላቸው' } },
  { id: 'shuttle', icon: 'Bus', label: { en: 'Airport shuttle', am: 'የአውሮፕላን ማረፊያ ማመላለሻ' } },
  { id: 'laundry', icon: 'WashingMachine', label: { en: 'Laundry service', am: 'የልብስ ማጠቢያ አገልግሎት' } },
  { id: 'business', icon: 'Briefcase', label: { en: 'Business center', am: 'የንግድ ማዕከል' } },
  { id: 'room-service', icon: 'BellRing', label: { en: 'Room service', am: 'የክፍል አገልግሎት' } },
  { id: 'view', icon: 'Mountain', label: { en: 'Scenic views', am: 'ውብ እይታ' } },
  { id: 'garden', icon: 'Trees', label: { en: 'Garden', am: 'የአትክልት ስፍራ' } },
  { id: 'conference', icon: 'Presentation', label: { en: 'Conference rooms', am: 'የስብሰባ አዳራሽ' } },
  { id: 'family', icon: 'Users', label: { en: 'Family rooms', am: 'የቤተሰብ ክፍሎች' } },
  { id: 'non-smoking', icon: 'CigaretteOff', label: { en: 'Non-smoking rooms', am: 'ያለሲጋራጭ ክፍሎች' } },
  { id: 'suites', icon: 'BedDouble', label: { en: 'Suites', am: 'ስዊቶች' } },
  { id: 'smoking', icon: 'Cigarette', label: { en: 'Smoking rooms available', am: 'የሲጋራጭ ክፍሎች አሉ' } },
];

const ROOM_CATEGORY_IDS = new Set(['family', 'non-smoking', 'suites', 'smoking']);

export function getAmenity(id: string): Amenity | undefined {
  return amenities.find((a) => a.id === id);
}

export function isRoomCategoryId(id: string): boolean {
  return ROOM_CATEGORY_IDS.has(id);
}
