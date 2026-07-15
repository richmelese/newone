import { ArrowUpDown, Star, MapPin, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/lib/language';
import PageShell from '@/components/layout/PageShell';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import TiltSurface from '@/components/ui/TiltSurface';

const contentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const headingVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' as const } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 44, rotateX: -12, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 150, damping: 18 },
  },
};

export default function WhyEthiopidia() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const reasons = [
    { icon: ArrowUpDown, title: t.whyReason1Title, desc: t.whyReason1Desc },
    { icon: Star, title: t.whyReason2Title, desc: t.whyReason2Desc },
    { icon: MapPin, title: t.whyReason3Title, desc: t.whyReason3Desc },
    { icon: ExternalLink, title: t.whyReason4Title, desc: t.whyReason4Desc },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-primary-900 to-ink-900 py-16 sm:py-20">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[48%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={reduceMotion ? undefined : { opacity: { duration: 0.8 }, scale: { duration: 0.8 }, rotate: { duration: 36, repeat: Infinity, ease: 'linear' } }}
      >
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400 shadow-[0_0_24px_rgba(92,141,184,0.9)]" />
        <span className="absolute bottom-[12%] right-[8%] h-1.5 w-1.5 rounded-full bg-primary-200 shadow-[0_0_18px_rgba(184,204,224,0.8)]" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[48%] h-[410px] w-[410px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={reduceMotion ? undefined : { duration: 48, repeat: Infinity, ease: 'linear' }}
      />
      <div className="pointer-events-none absolute -top-16 right-0 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl" />

      <PageShell className="relative z-10">
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={contentVariants}
        >
          <motion.div variants={headingVariants} className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-pill border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/70 shadow-soft backdrop-blur-md">
              {t.whyEyebrow}
            </span>
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-white [text-shadow:0_12px_28px_rgba(0,0,0,0.3)] sm:text-4xl">
              <TwoToneHeading text={t.whyTitle} accentClassName="text-accent-400" />
            </h2>
            <p className="mt-4 text-white/60">{t.whySubtitle}</p>
          </motion.div>

          <motion.div variants={contentVariants} className="mt-12 grid gap-5 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason, i) => (
              <motion.div key={reason.title} variants={cardVariants} className="h-full">
                <TiltSurface className="h-full" innerClassName="h-full rounded-card-lg" maxTilt={7} lift={9}>
                  <article className="group relative h-full min-h-[210px] rounded-card-lg border border-white/10 bg-gradient-to-br from-primary-800/95 via-ink-800 to-primary-900 p-6 shadow-[0_22px_50px_rgba(0,0,0,0.22)] [transform-style:preserve-3d]">
                    <span className="depth-layer-sm absolute right-5 top-4 font-heading text-4xl font-extrabold text-white/[0.035]">
                      0{i + 1}
                    </span>
                    <div className="depth-layer flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500/15 text-accent-400 shadow-[0_8px_22px_rgba(0,0,0,0.18)] ring-1 ring-accent-400/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-6 group-hover:bg-primary-500 group-hover:text-white">
                      <reason.icon size={20} />
                    </div>
                    <div className="depth-layer-sm">
                      <h3 className="mt-4 font-heading text-base font-bold text-white">{reason.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/55">{reason.desc}</p>
                    </div>
                  </article>
                </TiltSurface>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </PageShell>
    </section>
  );
}
