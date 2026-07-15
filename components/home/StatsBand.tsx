import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2, MapPin, MessageSquareText, Percent } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { hotels } from '@/data/hotels';
import { destinations } from '@/data/destinations';
import PageShell from '@/components/layout/PageShell';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import TiltSurface from '@/components/ui/TiltSurface';

const STATS_BAND_PHOTO = 'https://images.pexels.com/photos/34369594/pexels-photo-34369594.jpeg?auto=compress&cs=tinysrgb&w=1920';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

function CountUp({ target, decimals = 0, start, duration = 1400 }: { target: number; decimals?: number; start: boolean; duration?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return undefined;
    }
    const startTime = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);

  return <>{value.toFixed(decimals)}</>;
}

export default function StatsBand() {
  const { t } = useLanguage();
  const [started, setStarted] = useState(false);

  const totalReviews = hotels.reduce((sum, hotel) => sum + hotel.reviewCount, 0);

  const stats = [
    { icon: Building2, target: hotels.length, decimals: 0, suffix: '+', label: t.statsHotelsLabel, desc: t.statsHotelsDesc },
    { icon: MapPin, target: destinations.length, decimals: 0, suffix: '', label: t.statsDestinationsLabel, desc: t.statsDestinationsDesc },
    { icon: MessageSquareText, target: Math.floor(totalReviews / 100) / 10, decimals: 1, suffix: 'k+', label: t.statsReviewsLabel, desc: t.statsReviewsDesc },
    { icon: Percent, target: 0, decimals: 0, suffix: '%', label: t.statsCommissionLabel, desc: t.statsCommissionDesc },
  ];

  return (
    <section className="relative overflow-hidden py-16 text-white sm:py-20">
      <Image src={STATS_BAND_PHOTO} alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/60 to-primary-600/40" />

      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-primary-300/20 blur-3xl animate-float-slow" />

      <PageShell className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-50">{t.statsBandEyebrow}</p>
          <h2 className="mt-1.5 font-heading text-2xl font-bold sm:text-3xl">
            <TwoToneHeading text={t.statsBandTitle} accentClassName="text-accent-400" />
          </h2>
        </div>
        <motion.div
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={container}
          onViewportEnter={() => setStarted(true)}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="h-full"
            >
              <TiltSurface className="h-full" innerClassName="h-full rounded-card-lg" maxTilt={6} lift={8}>
                <article className="group h-full rounded-card-lg bg-white/10 p-6 shadow-soft ring-1 ring-white/10 backdrop-blur-sm transition-colors duration-300 hover:bg-white/15 [transform-style:preserve-3d]">
                  <span className="depth-layer flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 shadow-[0_7px_18px_rgba(0,0,0,0.18)] transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-6 group-hover:bg-primary-500">
                    <stat.icon size={20} className="text-primary-50 transition-colors group-hover:text-white" />
                  </span>
                  <div className="depth-layer-sm">
                    <p className="mt-4 font-heading text-3xl font-extrabold">
                      <CountUp target={stat.target} decimals={stat.decimals} start={started} />
                      {stat.suffix}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{stat.label}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-primary-50">{stat.desc}</p>
                  </div>
                </article>
              </TiltSurface>
            </motion.div>
          ))}
        </motion.div>
      </PageShell>
    </section>
  );
}
