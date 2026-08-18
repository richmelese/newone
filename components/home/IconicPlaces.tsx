import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ImageIcon, MapPin } from 'lucide-react';
import clsx from 'clsx';
import PageShell from '@/components/layout/PageShell';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import { citiesApi, resolveApiAssetUrl, type City } from '@/lib/api';
import { useLanguage } from '@/lib/language';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const card = {
  hidden: { opacity: 0, y: 44, rotateX: -12, scale: 0.94 },
  visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { duration: 0.7, ease: 'easeOut' as const } },
};

export default function IconicPlaces() {
  const { t, language } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await citiesApi.list();
      setCities(response.filter((city) => city.is_iconic === true));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load iconic places.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadCities(); }, [loadCities]);

  return (
    <section className="relative overflow-hidden bg-primary-50 py-10 sm:py-12">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary-300/25 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-primary-300/20 blur-3xl animate-float" />

      <PageShell className="relative">
        <div className="mb-6">
          {t.iconicPlacesEyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-600">{t.iconicPlacesEyebrow}</p>}
          <h2 className="relative inline-block font-heading text-2xl font-bold text-ink-900 sm:text-3xl">
            <TwoToneHeading text={t.iconicPlacesTitle} accentClassName="text-accent-600" />
            <motion.span className="absolute -bottom-1.5 left-0 h-1 rounded-pill bg-gradient-to-r from-accent-500 to-accent-300" initial={{ width: 0 }} whileInView={{ width: '3.25rem' }} viewport={{ once: true }} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }} />
          </h2>
          {t.iconicPlacesSubtitle && <p className="mt-2.5 max-w-2xl text-ink-500">{t.iconicPlacesSubtitle}</p>}
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center"><Spinner /></div>
        ) : error ? (
          <ErrorState title="Could not load iconic places" subtitle={error} retryLabel="Try again" onRetry={() => void loadCities()} />
        ) : cities.length === 0 ? (
          <EmptyState title="No iconic places found" subtitle="Cities marked as iconic will appear here." icon={MapPin} />
        ) : (
          <motion.div className="grid grid-cols-1 gap-4 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-6" initial={reduceMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={container}>
            {cities.map((city, index) => {
              const id = city.id ?? city._id;
              const name = language === 'am' ? city.name_am : city.name_en;
              const description = language === 'am' ? city.description_am : city.description_en;
              const image = resolveApiAssetUrl(city.hero_image);
              const featured = index < 2;
              return (
                <motion.div key={id ?? `${city.name_en}-${index}`} variants={card} whileHover={reduceMotion ? undefined : { y: -6, scale: 1.015, rotateX: 3, rotateY: -3 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className={clsx(featured ? 'lg:col-span-3' : 'lg:col-span-2')}>
                  <Link href={`/destinations/${encodeURIComponent(String(id ?? city.name_en))}`} className="group relative block aspect-[4/3] overflow-hidden rounded-card-lg bg-primary-100 shadow-card transition-shadow duration-300 hover:shadow-lift">
                    {image ? (
                      <Image src={image} alt={name} fill unoptimized sizes={featured ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 100vw, 33vw'} className="animate-kenburns object-cover [animation-duration:9s]" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-primary-300"><ImageIcon size={44} /></span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100" />
                    <span className="absolute left-4 top-4 rounded-pill bg-black/30 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">{name}</span>
                    <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary-500"><ArrowUpRight size={16} /></span>
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <h3 className={clsx('font-heading font-extrabold leading-snug text-white', featured ? 'text-xl sm:text-2xl' : 'text-lg')}>{name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-white/85">{description}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </PageShell>
    </section>
  );
}
