import { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/language';
import { categorizePhotos, GALLERY_TABS, type PhotoCategory } from '@/lib/photoMeta';
import Lightbox from '@/components/ui/Lightbox';
import RevealImage from '@/components/ui/RevealImage';

export default function HotelGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'all' | PhotoCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categorized = useMemo(() => categorizePhotos(photos), [photos]);
  const filtered = tab === 'all' ? categorized : categorized.filter((p) => p.category === tab);
  const grid = filtered.slice(0, 5);

  const tabLabels: Record<string, string> = {
    all: t.galleryAll,
    room: t.galleryRooms,
    pool: t.galleryAmenities,
    dining: t.galleryDining,
    view: t.galleryViews,
  };

  return (
    <div>
      <div className="mb-3 flex gap-2 overflow-x-auto">
        {GALLERY_TABS.map((tabDef) => (
          <button
            key={tabDef.key}
            type="button"
            onClick={() => setTab(tabDef.key)}
            className={`shrink-0 rounded-pill border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              tab === tabDef.key ? 'border-primary-600 bg-primary-600 text-white' : 'border-neutral-300 text-ink-700 hover:border-primary-400'
            }`}
          >
            {tabLabels[tabDef.key]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-card-lg" style={{ height: 420 }}>
        {grid.map((photo, i) => (
          <RevealImage
            key={photo.url + i}
            index={i}
            className={`relative h-full w-full overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="relative block h-full w-full"
            >
              <Image
                src={photo.url}
                alt={`${alt} photo ${i + 1}`}
                fill
                sizes={i === 0 ? '50vw' : '25vw'}
                className="object-cover transition-transform duration-300 hover:scale-105"
                priority={i === 0}
              />
            </button>
          </RevealImage>
        ))}
        {grid.length === 0 && <div className="col-span-4 row-span-2 flex items-center justify-center bg-neutral-200 text-ink-400">No photos in this category</div>}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={filtered.map((p) => p.url)}
            index={lightboxIndex}
            alt={alt}
            onClose={() => setLightboxIndex(null)}
            onIndexChange={setLightboxIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
