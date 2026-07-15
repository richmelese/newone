import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Landmark, Mail, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { destinations } from '@/data/destinations';
import { pexelsPhoto } from '@/lib/images';
import Reveal from '@/components/ui/Reveal';
import RevealItem from '@/components/ui/RevealItem';

const SOCIAL_GLYPHS = ['f', 'ig', 'x'];
const linkClass = 'inline-block text-sm text-neutral-300 transition-transform duration-200 hover:translate-x-1 hover:text-accent-400';

const FOOTER_PHOTOS = [
  pexelsPhoto(7438884, 1600),
  pexelsPhoto(20041269, 1600),
  pexelsPhoto(33337903, 1600),
  pexelsPhoto(5966509, 1600),
];
const FOOTER_SLIDE_DURATION = 7000;

export default function Footer() {
  const { t } = useLanguage();
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePhoto((i) => (i + 1) % FOOTER_PHOTOS.length);
    }, FOOTER_SLIDE_DURATION);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-primary-gradient text-neutral-50">
      <div className="absolute inset-0" aria-hidden="true">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={FOOTER_PHOTOS[activePhoto]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          >
            <Image src={FOOTER_PHOTOS[activePhoto]} alt="" fill sizes="100vw" className="object-cover opacity-[0.16]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 20, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary-400/20 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, -16, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 top-1/2 h-48 w-48 rounded-full bg-primary-300/10 blur-3xl"
        animate={{ x: [0, 24, 0], y: [0, -22, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <RevealItem index={0} className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold text-white">
              <motion.span
                whileHover={{ rotate: -8, scale: 1.08 }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 shadow-[0_0_22px_rgba(249,115,22,.4)]"
              >
                <Landmark size={18} className="text-white" />
              </motion.span>
              {t.brand}
            </Link>
            <p className="mt-3 max-w-xs text-sm text-neutral-200">{t.brandTagline}</p>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-neutral-300/80">{t.footerDisclaimer}</p>
          </RevealItem>

          <RevealItem index={1}>
            <h3 className="font-heading text-sm font-semibold text-white">{t.footerDestinationsTitle}</h3>
            <ul className="mt-4 space-y-2.5">
              {destinations.map((d) => (
                <li key={d.slug}>
                  <Link href={`/destinations/${d.slug}`} className={linkClass}>
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem index={2}>
            <h3 className="font-heading text-sm font-semibold text-white">{t.footerCompanyTitle}</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/about" className={linkClass}>
                  {t.footerCompanyAbout}
                </Link>
              </li>
              <li>
                <Link href="/for-hotels" className={linkClass}>
                  {t.footerCompanyForHotels}
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClass}>
                  {t.footerCompanyContact}
                </Link>
              </li>
              <li>
                <Link href="/reviews" className={linkClass}>
                  {t.navReviews}
                </Link>
              </li>
              <li>
                <Link href="/faq" className={linkClass}>
                  {t.footerCompanyFaq}
                </Link>
              </li>
            </ul>
          </RevealItem>

          <RevealItem index={3}>
            <h3 className="font-heading text-sm font-semibold text-white">{t.footerLegalTitle}</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="#" className={linkClass}>
                  {t.footerPrivacy}
                </Link>
              </li>
              <li>
                <Link href="#" className={linkClass}>
                  {t.footerTerms}
                </Link>
              </li>
            </ul>
          </RevealItem>

          <RevealItem index={4} className="col-span-2 sm:col-span-1">
            <h3 className="font-heading text-sm font-semibold text-white">{t.footerContactTitle}</h3>
            <a
              href="mailto:support@ethiopidia.com"
              className="mt-4 flex items-center gap-2 text-sm text-neutral-300 transition-transform duration-200 hover:translate-x-1 hover:text-accent-400"
            >
              <Mail size={14} className="shrink-0" />
              support@ethiopidia.com
            </a>
            <p className="mt-2.5 flex items-center gap-2 text-sm text-neutral-300">
              <Clock size={14} className="shrink-0" />
              {t.footerContactHours}
            </p>
          </RevealItem>
        </div>

        <Reveal className="relative mt-14 flex flex-col items-start justify-between gap-8 border-t border-white/10 pt-10 sm:flex-row sm:items-end">
          <motion.span
            aria-hidden="true"
            className="select-none bg-gradient-to-r from-primary-300 via-accent-400 to-primary-300 bg-clip-text font-heading text-[3.2rem] font-extrabold leading-none tracking-tight text-transparent sm:text-[4.5rem] lg:text-[6.5rem]"
            style={{ backgroundSize: '200% auto' }}
            animate={{ backgroundPosition: ['0% center', '100% center', '0% center'] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            {t.brand}
          </motion.span>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{t.footerSocialTitle}</span>
            <div className="flex items-center gap-2.5">
              {SOCIAL_GLYPHS.map((glyph) => (
                <motion.a
                  key={glyph}
                  href="#"
                  aria-label={t.footerSocialTitle}
                  whileHover={{ scale: 1.15, rotate: 8, backgroundColor: 'rgb(249 115 22)' }}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white"
                >
                  {glyph}
                </motion.a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-xs text-neutral-400">
          <span>
            © {new Date().getFullYear()} {t.brand}. {t.footerRights}
          </span>
        </Reveal>
      </div>
    </footer>
  );
}
