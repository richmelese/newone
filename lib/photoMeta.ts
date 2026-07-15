export type PhotoCategory = 'exterior' | 'lobby' | 'room' | 'pool' | 'dining' | 'view';

const CATEGORY_CYCLE: PhotoCategory[] = ['exterior', 'lobby', 'room', 'pool', 'dining', 'view'];

export function categoryForPhotoIndex(index: number): PhotoCategory {
  return CATEGORY_CYCLE[index % CATEGORY_CYCLE.length];
}

export function categorizePhotos(photos: string[]): { url: string; category: PhotoCategory }[] {
  return photos.map((url, i) => ({ url, category: categoryForPhotoIndex(i) }));
}

export const GALLERY_TABS: { key: 'all' | PhotoCategory; labelKey: string }[] = [
  { key: 'all', labelKey: 'galleryAll' },
  { key: 'room', labelKey: 'galleryRooms' },
  { key: 'pool', labelKey: 'galleryAmenities' },
  { key: 'dining', labelKey: 'galleryDining' },
  { key: 'view', labelKey: 'galleryViews' },
];
