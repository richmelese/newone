import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';
import { experiences } from '@/data/experiences';

const FEATURED_IMAGE_IDS = [
  'exp-lalibela-churches',
  'exp-gondar-fasil',
  'exp-bahirdar-falls',
  'exp-addis-entoto',
  'exp-hawassa-fishmarket',
];

const BACKDROP_PHOTOS = FEATURED_IMAGE_IDS.map((id) => experiences.find((experience) => experience.id === id)?.photo).filter(
  (photo): photo is string => Boolean(photo),
).map((photo) => photo.replace(/([?&])w=\d+/, '$1w=1920'));

const SLIDE_DURATION = 6200;

export default function EthiopiaMotionBackdrop({ children, className }: { children: ReactNode; className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || BACKDROP_PHOTOS.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % BACKDROP_PHOTOS.length);
    }, SLIDE_DURATION);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className={clsx('relative isolate min-h-[640px] overflow-hidden [perspective:1400px]', className)}>
      <div className="absolute inset-0 -z-20 bg-primary-900" aria-hidden="true">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={BACKDROP_PHOTOS[activeIndex]}
            className="absolute -inset-8"
            initial={reduceMotion ? false : { opacity: 0, x: '6%', scale: 1.12 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: '-2%', scale: 1.05 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: '-7%', scale: 1.08 }}
            transition={{
              duration: reduceMotion ? 0 : SLIDE_DURATION / 1000,
              ease: 'linear',
              opacity: { duration: reduceMotion ? 0 : 1.15, ease: 'easeInOut' },
            }}
          >
            <Image
              src={BACKDROP_PHOTOS[activeIndex]}
              alt=""
              fill
              sizes="100vw"
              className="object-cover brightness-[0.82] saturate-[1.12]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary-900/55 via-primary-900/10 to-accent-500/20" />
      <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(circle_at_15%_45%,rgba(61,111,154,.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-white/80" />
      <div className="faq-backdrop-grid-3d" aria-hidden="true" />

      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-[28%] -z-[5] h-48 w-48 rounded-[2.5rem] border border-primary-300/30 bg-primary-400/[0.14] backdrop-blur-sm"
        animate={reduceMotion ? undefined : { y: [0, -18, 0], rotateX: [54, 62, 54], rotateY: [18, 10, 18] }}
        transition={reduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-[18%] -z-[5] h-56 w-56 rounded-full border border-accent-300/35 bg-primary-400/[0.14] backdrop-blur-sm"
        animate={reduceMotion ? undefined : { y: [0, 20, 0], rotateX: [68, 76, 68], rotateZ: [0, 14, 0] }}
        transition={reduceMotion ? undefined : { duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-[5] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-300/20"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={reduceMotion ? undefined : { duration: 48, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400 shadow-[0_0_22px_rgba(92,141,184,.8)]" />
      </motion.span>

      <div className="relative z-10">{children}</div>

      {BACKDROP_PHOTOS.length > 1 && (
        <div className="absolute bottom-5 right-5 z-20 hidden items-center gap-1.5 rounded-pill border border-white/60 bg-white/55 px-3 py-2 shadow-soft backdrop-blur-md sm:flex">
          {BACKDROP_PHOTOS.map((photo, index) => (
            <button
              key={photo}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show Ethiopia background ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={clsx(
                'h-1.5 rounded-pill transition-all duration-300',
                index === activeIndex ? 'w-7 bg-primary-500' : 'w-2.5 bg-primary-700/30 hover:bg-primary-700/55',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
