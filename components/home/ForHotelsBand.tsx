import { Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/lib/language';
import Button from '@/components/ui/Button';
import PageShell from '@/components/layout/PageShell';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import TiltSurface from '@/components/ui/TiltSurface';

const sectionContent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, rotateX: -8 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.65, ease: 'easeOut' as const },
  },
};

const panelReveal = {
  hidden: { opacity: 0, y: 42, x: 24, rotateY: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    rotateY: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 125, damping: 18, delay: 0.08 },
  },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.18 } },
};

const listItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' as const } },
};

export default function ForHotelsBand() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const points = [t.forHotelsBandPoint1, t.forHotelsBandPoint2, t.forHotelsBandPoint3];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-ink-900 to-primary-800 py-20 text-white sm:py-24">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 -top-px z-20 h-10 w-full fill-primary-50 sm:h-14"
      >
        <path d="M0 0h1440v13c-181 28-361 31-541 9C705-1 550 9 403 31 253 53 119 49 0 34V0Z" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 -bottom-px z-20 h-10 w-full rotate-180 fill-primary-50 sm:h-14"
      >
        <path d="M0 0h1440v13c-181 28-361 31-541 9C705-1 550 9 403 31 253 53 119 49 0 34V0Z" />
      </svg>

      <motion.div
        aria-hidden="true"
        className="partner-grid-3d"
        animate={reduceMotion ? undefined : { backgroundPosition: ['0px 0px', '0px 48px'] }}
        transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
      >
        <motion.path
          d="M-90 290C180 82 379 410 656 202S1110 69 1510 244"
          fill="none"
          stroke="rgba(138,174,207,.24)"
          strokeWidth="1.3"
          strokeDasharray="12 18"
          animate={reduceMotion ? undefined : { strokeDashoffset: [0, -180] }}
          transition={reduceMotion ? undefined : { duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M-120 343C126 186 370 455 628 277S1072 139 1515 305"
          fill="none"
          stroke="rgba(249,115,22,.16)"
          strokeWidth="1.1"
          strokeDasharray="7 22"
          animate={reduceMotion ? undefined : { strokeDashoffset: [0, 150] }}
          transition={reduceMotion ? undefined : { duration: 15, repeat: Infinity, ease: 'linear' }}
        />
        <path d="M-80 112C238 272 373-43 703 121s491 121 817-34" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
      </svg>

      <motion.span
        aria-hidden="true"
        className="partner-blob pointer-events-none absolute -right-14 top-7 h-44 w-44 border border-white/10 bg-white/[0.035] shadow-[0_30px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm"
        animate={reduceMotion ? undefined : { y: [0, -14, 0], rotateX: [58, 62, 58], rotateY: [-18, -12, -18] }}
        transition={reduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        aria-hidden="true"
        className="partner-blob partner-blob--alt pointer-events-none absolute -bottom-20 left-[8%] h-36 w-36 border border-accent-400/15 bg-primary-500/[0.035] shadow-[0_0_70px_rgba(61,111,154,0.1)]"
        animate={reduceMotion ? undefined : { y: [0, 12, 0], rotateX: [68, 76, 68], rotateZ: [0, 10, 0] }}
        transition={reduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-primary-500/10 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-400/[0.08] blur-3xl" />

      <PageShell className="relative z-10">
        <motion.div
          className="grid gap-10 [perspective:1400px] lg:grid-cols-2 lg:items-center lg:gap-12"
          variants={sectionContent}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div variants={sectionContent} className="[transform-style:preserve-3d]">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-accent-400">
              {t.forHotelsBandEyebrow}
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-3 font-heading text-3xl font-extrabold leading-tight [text-shadow:0_14px_32px_rgba(0,0,0,0.28)] sm:text-4xl">
              <TwoToneHeading text={t.forHotelsBandTitle} accentClassName="text-accent-400" />
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 max-w-md leading-relaxed text-primary-50">
              {t.forHotelsBandSubtitle}
            </motion.p>
          </motion.div>

          <motion.div variants={panelReveal} className="h-full">
            <TiltSurface className="h-full" innerClassName="h-full rounded-[2rem]" maxTilt={6} lift={9}>
              <article className="relative h-full rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.11] via-white/[0.065] to-primary-500/[0.08] p-8 shadow-[0_28px_65px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl [transform-style:preserve-3d]">
                <div className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-white/[0.04]" />
                <p className="depth-layer-sm text-xs font-semibold uppercase tracking-widest text-primary-50/70">
                  {t.forHotelsBandCardTitle}
                </p>

                <motion.ul variants={listVariants} className="depth-layer mt-4 divide-y divide-white/10">
                  {points.map((point) => (
                    <motion.li variants={listItem} key={point} className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-500 text-white shadow-[0_5px_0_#c2440c,0_10px_20px_rgba(249,115,22,0.32)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-6 group-hover:bg-accent-400">
                        <Check size={14} strokeWidth={3} />
                      </span>
                      <span className="text-sm text-primary-50 sm:text-base">{point}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div variants={listItem}>
                  <div className="depth-layer-lg">
                    <Button href="/for-hotels/get-started" variant="primary" size="lg" fullWidth className="mt-6">
                      {t.forHotelsBandCta}
                    </Button>
                    <p className="mt-3 text-center text-xs text-primary-50/60">{t.forHotelsBandCtaNote}</p>
                  </div>
                </motion.div>
              </article>
            </TiltSurface>
          </motion.div>
        </motion.div>
      </PageShell>
    </section>
  );
}
