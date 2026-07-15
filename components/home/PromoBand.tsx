import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { promotions } from '@/data/promotions';
import { useLanguage } from '@/lib/language';
import PageShell from '@/components/layout/PageShell';
import Button from '@/components/ui/Button';
import TwoToneHeading from '@/components/ui/TwoToneHeading';

const AUTOPLAY_MS = 5500;

export default function PromoBand() {
  const { pick } = useLanguage();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPaused) return undefined;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % promotions.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, index]);

  const goTo = (i: number) => setIndex((i + promotions.length) % promotions.length);
  const promo = promotions[index];

  return (
    <section className="relative z-10 py-8 sm:py-10">
      <PageShell>
        <div
          className="group relative overflow-hidden rounded-card-lg shadow-hero ring-1 ring-black/5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div key={promo.id} className="relative min-h-[480px] sm:min-h-[440px] lg:min-h-[440px]">
            <Image
              src={promo.photo}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1152px"
              className="animate-kenburns object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-900/85 via-ink-900/55 to-ink-900/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent" />

            <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-primary-400/30 blur-3xl animate-float" />
            <div className="pointer-events-none absolute -bottom-20 right-24 h-64 w-64 rounded-full bg-primary-300/20 blur-3xl animate-float-slow" />

            <div className="relative flex h-full min-h-[480px] flex-col justify-center gap-4 px-6 py-12 sm:min-h-[440px] sm:px-10 sm:py-14 lg:min-h-[440px] lg:w-2/3 lg:px-14">
              <div className="inline-flex w-fit animate-fade-up items-center gap-1.5 rounded-pill bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-400" />
                </span>
                {pick(promo.badge)}
              </div>

              <h2 className="animate-fade-up font-heading text-4xl font-extrabold leading-tight text-white [animation-delay:80ms] sm:text-5xl">
                <TwoToneHeading text={pick(promo.title)} accentClassName="text-accent-400" />
              </h2>
              <p className="max-w-md animate-fade-up text-base text-white/85 [animation-delay:160ms] sm:text-lg">
                {pick(promo.subtitle)}
              </p>

              <div className="mt-2 flex animate-fade-up flex-wrap items-center gap-4 [animation-delay:240ms]">
                <span className="inline-flex items-center gap-1.5 rounded-pill bg-accent-500 px-4 py-2 text-sm font-extrabold text-white shadow-cta">
                  <Sparkles size={15} />
                  {pick(promo.discount)}
                </span>
                <Button href={`/destinations/${promo.destinationSlug}`} size="lg" className="group/cta relative overflow-hidden">
                  <span className="relative z-10 inline-flex items-center gap-2">
                    {pick(promo.cta)}
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full" />
                </Button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous offer"
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2.5 text-ink-700 shadow-lift transition-all hover:scale-105 sm:flex"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next offer"
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2.5 text-ink-700 shadow-lift transition-all hover:scale-105 sm:flex"
          >
            <ChevronRight size={20} />
          </button>

          <div className="absolute inset-x-6 bottom-4 flex gap-1.5 sm:inset-x-10 lg:inset-x-14">
            {promotions.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to offer ${i + 1}`}
                className="h-1 flex-1 overflow-hidden rounded-pill bg-white/25"
              >
                {i === index ? (
                  <span
                    key={`${p.id}-${index}`}
                    className="block h-full rounded-pill bg-white animate-progress-fill"
                    style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: isPaused ? 'paused' : 'running' }}
                  />
                ) : (
                  <span className={clsx('block h-full rounded-pill bg-white', i < index ? 'w-full' : 'w-0')} />
                )}
              </button>
            ))}
          </div>
        </div>
      </PageShell>
    </section>
  );
}
