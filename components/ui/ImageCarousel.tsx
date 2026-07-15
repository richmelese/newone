import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

type ImageCarouselProps = {
  photos: string[];
  alt: string;
  aspectClassName?: string;
  sizes?: string;
  priority?: boolean;
};

export default function ImageCarousel({ photos, alt, aspectClassName = 'aspect-[4/3]', sizes, priority }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  const go = (e: React.MouseEvent, dir: 1 | -1) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev + dir + photos.length) % photos.length);
  };

  return (
    <div className={clsx('group/gallery relative w-full overflow-hidden bg-neutral-200', aspectClassName)}>
      <Image
        src={photos[index]}
        alt={alt}
        fill
        sizes={sizes ?? '(max-width: 768px) 100vw, 400px'}
        className="object-cover transition-transform duration-300 group-hover/gallery:scale-105"
        priority={priority}
      />
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => go(e, -1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-1.5 text-ink-800 opacity-0 shadow-soft transition-opacity group-hover/gallery:opacity-100"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => go(e, 1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-1.5 text-ink-800 opacity-0 shadow-soft transition-opacity group-hover/gallery:opacity-100"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {photos.map((_, i) => (
              <span
                key={i}
                className={clsx('h-1.5 rounded-pill transition-all', i === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60')}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
