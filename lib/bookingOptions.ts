import type { Hotel } from '@/types';

export type BookingOption = {
  id: 'official' | 'booking' | 'tripadvisor';
  name: string;
  subLabel: string;
  priceEtb?: number;
  href: string;
  external: boolean;
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

type OptionLabels = {
  officialWebsiteLabel: string;
  bookDirectLabel: string;
  viewOnBookingLabel: string;
  viewOnTripAdvisorLabel: string;
};

export function getBookingOptions(hotel: Hotel, t: OptionLabels): BookingOption[] {
  const options: BookingOption[] = [];
  const query = encodeURIComponent(hotel.name);

  if (hotel.bookingActive) {
    options.push({
      id: 'official',
      name: t.officialWebsiteLabel,
      subLabel: t.bookDirectLabel,
      priceEtb: hotel.priceFromEtb,
      href: `/redirect/${hotel.slug}`,
      external: false,
    });
  }

  const bookingMarkupPercent = 4 + (hashString(`${hotel.id}-booking`) % 6);
  const bookingComPrice = Math.round((hotel.priceFromEtb * (1 + bookingMarkupPercent / 100)) / 25) * 25;

  options.push({
    id: 'booking',
    name: 'Booking.com',
    subLabel: t.viewOnBookingLabel,
    priceEtb: bookingComPrice,
    href: `https://www.booking.com/searchresults.html?ss=${query}`,
    external: true,
  });

  options.push({
    id: 'tripadvisor',
    name: 'TripAdvisor',
    subLabel: t.viewOnTripAdvisorLabel,
    href: `https://www.tripadvisor.com/Search?q=${query}`,
    external: true,
  });

  return options;
}
