export type Localized<T = string> = { en: T; am: T };

export type PropertyType = 'Hotel' | 'Resort' | 'Guesthouse' | 'Lodge' | 'Boutique';

export type Badge = 'premium' | 'featured' | 'new';

export interface Amenity {
  id: string;
  icon: string;
  label: Localized;
}

export interface RoomType {
  id: string;
  name: Localized;
  photo: string;
  capacity: number;
  priceFromEtb: number;
  featureIds: string[];
  bedType: Localized;
  sizeSqm: number;
  description: Localized;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: Localized;
}

export interface Coords {
  x: number;
  y: number;
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  destinationSlug: string;
  propertyType: PropertyType;
  starRating: number;
  guestRating: number;
  reviewCount: number;
  priceFromEtb: number;
  neighborhood: Localized;
  shortDescription: Localized;
  longDescription: Localized;
  amenityIds: string[];
  photos: string[];
  roomTypes: RoomType[];
  reviews: Review[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: Localized;
    breakfast: Localized;
  };
  badges: Badge[];
  bookingActive: boolean;
  externalBookingUrl: string;
  externalSiteName: string;
  coords: Coords;
}

export type PropertyRequestStatus = 'pending' | 'approved' | 'rejected';

export interface PropertyRequest {
  id: string;
  submittedAt: string;
  status: PropertyRequestStatus;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  propertyName: string;
  propertyType: string;
  starClass: string;
  rooms: string;
  city: string;
  address: string;
  services: string[];
  amenities: string[];
  notes: string;
  mediaCount: number;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  region: string;
  heroPhoto: string;
  cardPhoto: string;
  tagline: Localized;
  guide: Localized;
  bestTime: Localized;
  coords: Coords;
}

export interface DestinationGuideSection {
  title: Localized;
  body: Localized;
  photo: string;
}

export interface DestinationGuide {
  sections: DestinationGuideSection[];
  gallery: string[];
}

export interface MenuItem {
  name: Localized;
  description?: Localized;
  priceFromEtb?: number;
}

export interface ServiceItem {
  name: Localized;
  photo?: string;
  durationMinutes?: number;
  priceFromEtb?: number;
}

export interface ScheduleItem {
  day: Localized;
  time: string;
  title?: Localized;
}

export interface Experience {
  id: string;
  destinationSlug: string;
  name: Localized;
  description: Localized;
  photo: string;
  category: string;
  /** Extra photos shown in a gallery on the experience detail page, beyond the main `photo`. */
  gallery?: string[];
  /** Longer write-up shown on the experience detail page; falls back to `description` when absent. */
  longDescription?: Localized;
  /** Specific street address, shown alongside the destination on the detail page (e.g. for salons, cafes). */
  address?: Localized;
  /** What's on offer, for food & drink venues (coffee houses, restaurants). */
  menu?: MenuItem[];
  /** Bookable treatments/services, for salons and similar venues. */
  services?: ServiceItem[];
  /** Recurring or upcoming showtimes, for nightlife/entertainment venues. */
  schedule?: ScheduleItem[];
  /** Whether this experience can be booked through an external partner (mirrors Hotel's booking fields). */
  bookable?: boolean;
  externalBookingUrl?: string;
  externalSiteName?: string;
}

export interface InterestHighlightItem {
  title: Localized;
  description: Localized;
  photo: string;
  experienceId?: string;
  destinationSlug?: string;
}

export interface InterestHighlightSection {
  title: Localized;
  subtitle: Localized;
  items: InterestHighlightItem[];
}

export interface LocalFlavorMoment {
  id: string;
  title: Localized;
  photo: string;
  author: string;
  experienceId?: string;
  destinationSlug?: string;
}

export interface LocalFlavorSection {
  title: Localized;
  subtitle: Localized;
  featured: LocalFlavorMoment;
  moments: LocalFlavorMoment[];
}

export interface Interest {
  id: string;
  slug: string;
  name: Localized;
  tagline: Localized;
  heroPhoto: string;
  cardPhoto: string;
  guide: Localized;
  experienceCategories: string[];
  destinationSlugs: string[];
  highlightSections: InterestHighlightSection[];
  localFlavor?: LocalFlavorSection;
}

export interface Partner {
  id: string;
  name: string;
  kind: 'payment' | 'hosting';
}

export interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface FavoriteEntry {
  hotelId: string;
  addedAt: string;
}

export interface ViewedEntry {
  hotelId: string;
  viewedAt: string;
}

export type ServiceType = 'hotel' | 'restaurant' | 'thing_to_do' | 'tour' | 'wellness' | 'nightlife';

export type TripType = 'solo' | 'couple' | 'family' | 'friends' | 'business';

export type ReviewStatus = 'pending' | 'published' | 'rejected';

export interface ReviewEntityRef {
  id: string;
  type: ServiceType;
  name: Localized;
  photo?: string;
}

export interface ReviewAuthor {
  name: string;
  email: string;
}

export interface EntityReview {
  id: string;
  entityId: string;
  entityType: ServiceType;
  entityName: Localized;
  author: ReviewAuthor;
  rating: number;
  subRatings: Record<string, number>;
  title: Localized;
  text: Localized;
  tripType: TripType;
  visitDate: string;
  photos: string[];
  verified: boolean;
  status: ReviewStatus;
  helpfulCount: number;
  createdAt: string;
}

export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating';

export interface FilterState {
  destination?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  stars?: number[];
  minGuestRating?: number;
  amenities?: string[];
  propertyTypes?: PropertyType[];
  sort?: SortOption;
  page?: number;
  view?: 'list' | 'grid';
}
