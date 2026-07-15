import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import type { ReactNode } from 'react';

type CarouselProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  /** Keep the scroll arrows visible on all screen sizes instead of only on hover (desktop). */
  alwaysShowArrows?: boolean;
  /** Use high-contrast controls when the carousel sits on a dark section. */
  darkNavigation?: boolean;
};

export default function Carousel({
  children,
  className,
  autoPlay = false,
  autoPlayInterval = 5000,
  alwaysShowArrows = false,
  darkNavigation = false,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setPageCount(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
    setPage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      window.requestAnimationFrame(measure);
    };
    el.addEventListener('scroll', onScroll, { passive: true });

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [measure, children]);

  useEffect(() => {
    if (!autoPlay) return;
    const el = trackRef.current;
    if (!el || pageCount <= 1) return;

    let paused = false;
    const container = el.parentElement;
    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    container?.addEventListener('mouseenter', onEnter);
    container?.addEventListener('mouseleave', onLeave);

    const id = window.setInterval(() => {
      if (paused) return;
      const current = Math.round(el.scrollLeft / el.clientWidth);
      const next = current >= pageCount - 1 ? 0 : current + 1;
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    }, autoPlayInterval);

    return () => {
      clearInterval(id);
      container?.removeEventListener('mouseenter', onEnter);
      container?.removeEventListener('mouseleave', onLeave);
    };
  }, [autoPlay, autoPlayInterval, pageCount, children]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  const goToPage = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className={`group/carousel relative ${className ?? ''}`}>
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        disabled={page <= 0}
        className={clsx(
          'absolute left-0 top-[calc(50%-1.25rem)] -translate-y-1/2 -translate-x-3 items-center justify-center rounded-full p-2.5 shadow-lift transition-all duration-200 hover:scale-105 disabled:pointer-events-none disabled:opacity-0',
          darkNavigation ? 'bg-white/15 text-white backdrop-blur-md hover:bg-white/25' : 'bg-white text-ink-700 hover:text-primary-700',
          alwaysShowArrows ? 'flex opacity-100' : 'hidden opacity-0 group-hover/carousel:opacity-100 sm:flex',
        )}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        disabled={page >= pageCount - 1}
        className={clsx(
          'absolute right-0 top-[calc(50%-1.25rem)] -translate-y-1/2 translate-x-3 items-center justify-center rounded-full p-2.5 shadow-lift transition-all duration-200 hover:scale-105 disabled:pointer-events-none disabled:opacity-0',
          darkNavigation ? 'bg-white/15 text-white backdrop-blur-md hover:bg-white/25' : 'bg-white text-ink-700 hover:text-primary-700',
          alwaysShowArrows ? 'flex opacity-100' : 'hidden opacity-0 group-hover/carousel:opacity-100 sm:flex',
        )}
      >
        <ChevronRight size={20} />
      </button>

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === page}
              className={clsx(
                'h-1.5 rounded-pill transition-all duration-200',
                i === page
                  ? darkNavigation ? 'w-6 bg-blue-400' : 'w-6 bg-primary-600'
                  : darkNavigation ? 'w-1.5 bg-white/80 hover:bg-white' : 'w-1.5 bg-neutral-300 hover:bg-primary-200',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
