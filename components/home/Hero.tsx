import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { BadgeCheck, Headset, MapPin, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { destinations } from '@/data/destinations';
import { pexelsPhoto } from '@/lib/images';
import SearchBar from '@/components/search/SearchBar';

const sideDestinations = destinations.slice(0, 4);
const HERO_SLIDES = [
  { photo: pexelsPhoto(7438884, 1920), heading: '#1e4066', body: '#132f43', muted: '#2a5580', overlay: 'linear-gradient(90deg, rgba(138,174,207,.94), rgba(61,111,154,.72) 48%, rgba(30,64,102,.42))' },
  { photo: pexelsPhoto(31502205, 1920), heading: '#eef3f9', body: '#ffffff', muted: '#d9e4f0', overlay: 'linear-gradient(90deg, rgba(11,26,46,.86), rgba(30,64,102,.64) 50%, rgba(11,26,46,.35))' },
  { photo: pexelsPhoto(3218443, 1920), heading: '#d9e4f0', body: '#eef3f9', muted: '#b8cce0', overlay: 'linear-gradient(90deg, rgba(19,47,67,.88), rgba(42,85,128,.66) 50%, rgba(11,26,46,.38))' },
];
const item = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: .55, ease: 'easeOut' as const } } };

export default function Hero() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [activePhoto, setActivePhoto] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '9%']);
  const trustItems = [
    { icon: BadgeCheck, title: t.heroTrustPriceTitle, desc: t.heroTrustPriceDesc },
    { icon: ShieldCheck, title: t.heroTrustVerifiedTitle, desc: t.heroTrustVerifiedDesc },
    { icon: Headset, title: t.heroTrustSupportTitle, desc: t.heroTrustSupportDesc },
  ];

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = window.setInterval(() => {
      setActivePhoto((current) => (current + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section ref={sectionRef} className="relative min-h-[680px] overflow-hidden bg-primary-900 lg:min-h-[720px]">
      <motion.div className="absolute -inset-y-8 inset-x-0" style={reduceMotion ? undefined : { y: imageY }}>
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={HERO_SLIDES[activePhoto].photo}
            className="absolute inset-0"
            initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.15, ease: 'easeInOut' }}
          >
            <Image src={HERO_SLIDES[activePhoto].photo} alt="Historic Ethiopian landscape" fill priority={activePhoto === 0} sizes="100vw" className="object-cover object-center" />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <motion.div className="absolute inset-0" animate={{ background: HERO_SLIDES[activePhoto].overlay }} transition={{ duration: 1.1, ease: 'easeInOut' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-primary-600/10 via-primary-800/15 to-primary-900/84" />

      <div className="absolute bottom-5 right-6 z-20 hidden gap-2 sm:flex" aria-label="Hero background slides">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.photo}
            type="button"
            aria-label={`Show background ${index + 1}`}
            aria-current={index === activePhoto}
            onClick={() => setActivePhoto(index)}
            className={`h-2 rounded-full shadow-sm transition-all ${index === activePhoto ? 'w-8 bg-primary-100' : 'w-2 bg-primary-300/70 hover:bg-primary-100'}`}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-[1480px] px-5 pb-8 pt-32 sm:px-8 lg:px-12 lg:pt-36 xl:px-16">
        <div className="grid items-start gap-10 lg:grid-cols-[150px_minmax(0,1fr)] xl:grid-cols-[155px_minmax(0,850px)] xl:gap-14">
          <motion.aside
            className="hidden cursor-grab space-y-5 active:cursor-grabbing lg:block"
            initial={reduceMotion ? false : { opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, ease: 'easeOut', delay: .15 }}
            drag={reduceMotion ? false : 'y'}
            dragConstraints={{ top: -28, bottom: 28 }}
            dragElastic={.16}
            whileDrag={{ scale: 1.025 }}
          >
            {sideDestinations.map((destination, index) => (
              <motion.div
                key={destination.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 24, scale: .92 }}
                animate={{ opacity: 1, y: [0, -30, 4, -13, 0], scale: [1, 1.055, .985, 1.025, 1] }}
                transition={{
                  opacity: { duration: .4, delay: .1 + index * .08 },
                  scale: { duration: 2.1, repeat: Infinity, repeatType: 'loop', repeatDelay: 0, ease: 'easeInOut', delay: .55 + index * .24 },
                  y: { duration: 2.1, repeat: Infinity, repeatType: 'loop', repeatDelay: 0, ease: 'easeInOut', delay: .55 + index * .24 },
                }}
              >
                <Link href={`/destinations/${destination.slug}`} className="group block">
                  <span className="relative block h-[104px] w-[104px] overflow-hidden rounded-full border-2 border-white shadow-[0_7px_0_#1e4066,0_15px_28px_rgba(11,26,46,0.48)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_10px_0_#1e4066,0_20px_36px_rgba(11,26,46,0.58)]"><Image src={destination.cardPhoto} alt="" fill unoptimized={destination.cardPhoto.includes('commons.wikimedia.org')} sizes="104px" className="object-cover" /></span>
                  <motion.span animate={{ color: HERO_SLIDES[activePhoto].body }} transition={{ duration: .9 }} className="mt-2 flex items-center gap-1 text-xs font-semibold"><MapPin size={12} className="fill-accent-500 text-accent-500" />{destination.name}</motion.span>
                </Link>
              </motion.div>
            ))}
          </motion.aside>

          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: .09 }} className="pt-3">
            <motion.p variants={item} className="text-sm font-bold uppercase tracking-wide text-accent-500">{t.heroEyebrow}</motion.p>
            <motion.h1 variants={item} animate={{ color: HERO_SLIDES[activePhoto].heading }} transition={{ color: { duration: .9, ease: 'easeInOut' } }} className="mt-3 max-w-[760px] font-heading text-5xl font-extrabold leading-[1.02] tracking-[-.035em] sm:text-6xl xl:text-[72px]">{t.heroTitleMain}<span className="block text-accent-500">{t.heroTitleAccent}</span></motion.h1>
            <motion.p variants={item} animate={{ color: HERO_SLIDES[activePhoto].body }} transition={{ color: { duration: .9, ease: 'easeInOut' } }} className="mt-5 max-w-2xl whitespace-pre-line text-base leading-7 sm:text-lg">{t.heroSubtitle}</motion.p>
            <motion.div variants={item} className="mt-8 flex flex-wrap gap-x-8 gap-y-5">
              {trustItems.map(({ icon: Icon, title, desc }) => <motion.div key={title} animate={{ color: HERO_SLIDES[activePhoto].body }} transition={{ duration: .9 }} className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100/80"><Icon size={22} className="text-primary-700" /></span><div><p className="text-sm font-bold">{title}</p><motion.p animate={{ color: HERO_SLIDES[activePhoto].muted }} transition={{ duration: .9 }} className="text-xs">{desc}</motion.p></div></motion.div>)}
            </motion.div>
          </motion.div>

        </div>

        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .55 }} className="relative z-10 mx-auto mt-10 max-w-[680px] lg:-mt-20 xl:-mt-28">
          <p className="mb-3 text-center font-heading text-lg font-bold tracking-[-0.01em] text-white drop-shadow-[0_2px_8px_rgba(5,20,34,.65)] sm:text-xl">
            {t.searchWhereTo}
          </p>
          <SearchBar className="hero-search-depth !rounded-[32px] !border !border-white/60 !bg-white/90 !p-2.5 shadow-[0_10px_0_-5px_rgba(30,64,102,.85),0_24px_60px_rgba(5,20,34,.32)] backdrop-blur-xl" />
        </motion.div>

      </div>
    </section>
  );
}
