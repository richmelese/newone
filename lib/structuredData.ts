import { SITE_NAME, SITE_URL } from './site';
import type { Hotel } from '@/types';

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Ethiopidia helps travelers discover and compare hotels across Ethiopia, then book directly on each hotel’s own website.',
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(items: { label: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };
}

export function hotelSchema(hotel: Hotel, description: string, neighborhood: string, cityName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description,
    image: hotel.photos,
    starRating: { '@type': 'Rating', ratingValue: hotel.starRating },
    priceRange: `ETB ${hotel.priceFromEtb}+`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressRegion: cityName,
      addressCountry: 'ET',
      streetAddress: neighborhood,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: hotel.guestRating,
      reviewCount: hotel.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: hotel.reviews.map((review) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.author },
      datePublished: review.date,
      reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: 5, worstRating: 1 },
    })),
    url: `${SITE_URL}/hotels/${hotel.slug}`,
  };
}
