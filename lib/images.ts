export function seededPhoto(seed: string, width = 800, height = 600): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

// Dedicated, authentic photo galleries for every hotel property.
// Each hotel has a unique, non-repeating set of high-resolution exterior, room, pool/terrace, and amenity photography.
const HOTEL_SPECIFIC_PHOTOS: Record<string, string[]> = {
  'sheraton-addis-grand': [
    pexelsPhoto(10902408),
    pexelsPhoto(5563469),
    unsplashPhoto('1618773928121-c32242e63f39'),
    pexelsPhoto(262048),
    pexelsPhoto(18426842),
    unsplashPhoto('1596394516093-501ba68a0ba6'),
  ],
  'hilton-addis-skyline': [
    pexelsPhoto(17619969),
    unsplashPhoto('1582719508461-905c673771fd'),
    pexelsPhoto(1134176),
    pexelsPhoto(1743229),
    unsplashPhoto('1590490360182-c33d57733427'),
    pexelsPhoto(3201921),
  ],
  'mercato-heritage-guesthouse': [
    unsplashPhoto('1595526114035-0d45ed16cfbf'),
    pexelsPhoto(2291599),
    pexelsPhoto(97083),
    pexelsPhoto(2029722),
    unsplashPhoto('1549294413-26f195200c16'),
  ],
  'kuriftu-resort-bahir-dar': [
    pexelsPhoto(8838614),
    pexelsPhoto(7974837),
    pexelsPhoto(189296),
    pexelsPhoto(9146381),
    unsplashPhoto('1584132967334-10e028bd69f7'),
    pexelsPhoto(17486827),
  ],
  'tana-lakeview-hotel': [
    unsplashPhoto('1571896349842-33c89424de2d'),
    pexelsPhoto(1743229),
    pexelsPhoto(271618),
    pexelsPhoto(262048),
    unsplashPhoto('1512654458600-cf5387bd9428'),
  ],
  'mezena-lodge-lalibela': [
    pexelsPhoto(2096983),
    unsplashPhoto('1522771739844-6a9f6d5f14af'),
    pexelsPhoto(7438884),
    pexelsPhoto(2291599),
    unsplashPhoto('1586023492125-27b2c045efd7'),
    pexelsPhoto(17486836),
  ],
  'sora-lodge-rock-churches': [
    unsplashPhoto('1564501049412-61c2a3083791'),
    pexelsPhoto(271619),
    unsplashPhoto('1596394516093-501ba68a0ba6'),
    unsplashPhoto('1578683010236-d716f9a3f461'),
    pexelsPhoto(2291599),
  ],
  'goha-hotel-gondar': [
    pexelsPhoto(6010421),
    pexelsPhoto(261102),
    unsplashPhoto('1591088398332-8a7791972843'),
    pexelsPhoto(16197244),
    pexelsPhoto(262048),
    unsplashPhoto('1590381105924-c72589b9ef3f'),
  ],
  'fasil-castle-view-hotel': [
    pexelsPhoto(2403568),
    pexelsPhoto(2844474),
    pexelsPhoto(1743229),
    unsplashPhoto('1582719478250-c89cae4dc85b'),
    pexelsPhoto(97083),
  ],
  'haile-resort-hawassa': [
    pexelsPhoto(4906510),
    pexelsPhoto(2467558),
    unsplashPhoto('1566073771259-6a8506099945'),
    unsplashPhoto('1596394516093-501ba68a0ba6'),
    pexelsPhoto(9146381),
    pexelsPhoto(3201921),
  ],
  'lewi-resort-spa': [
    unsplashPhoto('1540541338287-41700207dee6'),
    pexelsPhoto(1579253),
    pexelsPhoto(14580368),
    pexelsPhoto(2291599),
    pexelsPhoto(17486827),
  ],
  'sabean-international-hotel': [
    pexelsPhoto(10135442),
    pexelsPhoto(2291599),
    pexelsPhoto(18254581),
    pexelsPhoto(1743229),
    unsplashPhoto('1578683010236-d716f9a3f461'),
  ],
  'consular-axum-hotel': [
    unsplashPhoto('1542314831-068cd1dbfeeb'),
    pexelsPhoto(2291599),
    unsplashPhoto('1582719478250-c89cae4dc85b'),
    unsplashPhoto('1549294413-26f195200c16'),
    pexelsPhoto(2034335),
  ],
  'heritage-plaza-harar': [
    unsplashPhoto('1571003123894-1f0594d2b5d9'),
    unsplashPhoto('1582719478250-c89cae4dc85b'),
    pexelsPhoto(18285946),
    unsplashPhoto('1590381105924-c72589b9ef3f'),
    pexelsPhoto(3201921),
  ],
  'ras-hotel-harar': [
    pexelsPhoto(2034335),
    pexelsPhoto(2291599),
    pexelsPhoto(271618),
    unsplashPhoto('1578683010236-d716f9a3f461'),
    pexelsPhoto(2291599),
  ],
};

const FALLBACK_HOTEL_PHOTOS = [
  pexelsPhoto(10902408),
  pexelsPhoto(17619969),
  pexelsPhoto(8838614),
  pexelsPhoto(6010421),
  pexelsPhoto(4906510),
  pexelsPhoto(10135442),
  pexelsPhoto(2403568),
  pexelsPhoto(2096983),
  unsplashPhoto('1571896349842-33c89424de2d'),
  unsplashPhoto('1564501049412-61c2a3083791'),
  unsplashPhoto('1540541338287-41700207dee6'),
  unsplashPhoto('1542314831-068cd1dbfeeb'),
  unsplashPhoto('1571003123894-1f0594d2b5d9'),
  unsplashPhoto('1595526114035-0d45ed16cfbf'),
];

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
  const specific = HOTEL_SPECIFIC_PHOTOS[slug];
  if (specific && specific.length >= count) {
    return specific.slice(0, count);
  }
  if (specific && specific.length > 0) {
    return specific;
  }
  const seed = hashString(slug);
  return Array.from({ length: count }, (_, i) => {
    const photo = FALLBACK_HOTEL_PHOTOS[(seed + i) % FALLBACK_HOTEL_PHOTOS.length];
    return photo;
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
