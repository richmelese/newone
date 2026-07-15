import { Search, Scale, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/lib/language';
import PageShell from '@/components/layout/PageShell';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import TiltSurface from '@/components/ui/TiltSurface';

const stepsContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.12 } },
};

const stepCard = {
  hidden: { opacity: 0, y: 34, rotateX: -10, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: { duration: 0.62, ease: 'easeOut' as const },
  },
};

export default function HowItWorks() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const steps = [
    { icon: Search, title: t.howItWorksStep1Title, desc: t.howItWorksStep1Desc },
    { icon: Scale, title: t.howItWorksStep2Title, desc: t.howItWorksStep2Desc },
    { icon: ExternalLink, title: t.howItWorksStep3Title, desc: t.howItWorksStep3Desc },
  ];

  return (
    <section className="bg-white py-14">
      <PageShell>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-center font-heading text-2xl font-bold text-ink-900 sm:text-3xl">
            <TwoToneHeading text={t.howItWorksTitle} />
          </h2>
        </motion.div>
        <motion.div
          className="relative mt-10 grid gap-5 [perspective:1200px] sm:grid-cols-3"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={stepsContainer}
        >
          <motion.span
            aria-hidden="true"
            className="absolute left-[16.66%] right-[16.66%] top-10 hidden h-px origin-left bg-gradient-to-r from-primary-200 via-accent-300 to-primary-200 sm:block"
            initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
          />
          {steps.map((step, i) => (
            <motion.div key={step.title} variants={stepCard} className="relative h-full">
              <TiltSurface className="h-full" innerClassName="h-full rounded-card-lg" maxTilt={5} lift={6}>
                <article className="group relative flex h-full min-h-[230px] flex-col items-center rounded-card-lg border border-neutral-200 bg-gradient-to-b from-white to-primary-50/60 px-6 py-7 text-center shadow-card [transform-style:preserve-3d]">
                  <div className="depth-layer flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-700 text-white shadow-[0_8px_0_#132f43,0_16px_28px_rgba(11,36,54,0.2)] transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-3 group-hover:bg-primary-500 group-hover:shadow-[0_8px_0_#1e4066,0_16px_28px_rgba(61,111,154,0.2)]">
                    <step.icon size={27} />
                  </div>
                  <div className="depth-layer-sm mt-5">
                    <span className="font-heading text-xs font-bold uppercase tracking-wide text-accent-600">Step {i + 1}</span>
                    <h3 className="mt-1 font-heading text-lg font-bold text-ink-900">{step.title}</h3>
                    <p className="mx-auto mt-2 max-w-xs text-sm text-ink-500">{step.desc}</p>
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
