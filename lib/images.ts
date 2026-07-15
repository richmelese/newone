export function seededPhoto(seed: string, width = 800, height = 600): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

// Real hotel/resort photography (exterior, pool, room, dining, lobby) sourced from Pexels,
// grouped by category so each hotel's gallery reads like an actual property tour.
const HOTEL_PHOTO_POOL = {
  exterior: [10902408, 17619969, 8838614, 6010421, 4906510, 10135442],
  pool: [5563469, 7974837, 860271],
  room: [16197244, 14580368, 18254581, 18285946],
  dining: [3201921],
  lobby: [18426842],
} as const;

const HOTEL_PHOTO_ORDER = ['exterior', 'pool', 'room', 'dining', 'lobby', 'room'] as const;

export function pexelsPhoto(id: number, width = 1200): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

/** A stable, responsive URL for a real Unsplash photograph. */
export function unsplashPhoto(id: string, width = 1200): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=85`;
}

/** A resized Wikimedia Commons image addressed by its exact file name. */
export function wikimediaPhoto(fileName: string, width = 1200): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=${width}`;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

export function hotelPhotos(slug: string, count: number): string[] {
  const seed = hashString(slug);
  return Array.from({ length: count }, (_, i) => {
    const category = HOTEL_PHOTO_ORDER[i % HOTEL_PHOTO_ORDER.length];
    const pool = HOTEL_PHOTO_POOL[category];
    const photoId = pool[(seed + i) % pool.length];
    return pexelsPhoto(photoId);
  });
}

// Real photography from Pexels, grouped by experience category so each place's photos
// actually resemble what it is (a beauty salon looks like a salon, not a random landscape).
const EXPERIENCE_PHOTO_POOL = {
  'Coffee House': [36729751, 5373256, 6152270, 1855214, 14517408],
  'Beauty Salon': [8867400, 34930126, 3993320, 3992861, 7755176],
  Nightlife: [6174060, 6173811, 11397655, 30125341, 16674070],
  'Art Gallery': [9221307, 15320566, 35719467, 8792989, 5466870],
  Craft: [32214847, 26692145, 26692156, 29016023, 35996127],
  Culture: [28645141, 28645136, 18158250, 37733601, 17677015],
  Food: [17486836, 17486827, 36984977, 37006126, 24375991],
  History: [38267989, 31502205, 31502206, 31502209, 7524487],
  Nature: [33999682, 3218443, 34448034, 34472460, 675257],
  Relaxation: [9146381, 18120174, 38407788, 37719545, 38407790],
  Shopping: [20058449, 18600912, 37975889, 1087727, 21044412],
  Wildlife: [35283497, 19281386, 36702540, 11928979, 27625451],
} as const;

/** A real, category-relevant photo for an experience, varied by seed so galleries don't repeat the same shot. */
export function experiencePhoto(seed: string, category: string, width = 800): string {
  const pool = EXPERIENCE_PHOTO_POOL[category as keyof typeof EXPERIENCE_PHOTO_POOL] ?? EXPERIENCE_PHOTO_POOL.Culture;
  const photoId = pool[hashString(seed) % pool.length];
  return pexelsPhoto(photoId, width);
}
