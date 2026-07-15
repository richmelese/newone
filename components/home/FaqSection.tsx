import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/lib/language';
import PageShell from '@/components/layout/PageShell';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import TiltSurface from '@/components/ui/TiltSurface';
import { initialAdminFaqs, loadAdminFaqs } from '@/lib/adminFaqs';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function FaqSection() {
  const { t, pick } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [adminFaqs, setAdminFaqs] = useState(initialAdminFaqs);
  const reduceMotion = useReducedMotion();

  useEffect(() => setAdminFaqs(loadAdminFaqs()), []);

  const faqs = adminFaqs.filter((faq) => faq.published).map((faq) => ({ id: faq.id, q: pick(faq.question), a: pick(faq.answer) }));

  return (
    <section className="py-14 sm:py-16">
      <PageShell>
        <motion.div
          className="mx-auto max-w-3xl rounded-[1.75rem] border border-white/60 bg-white/50 px-6 py-6 text-center shadow-[0_18px_45px_rgba(11,36,54,0.14),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">{t.faqEyebrow}</p>
          <h2 className="mt-1.5 font-heading text-2xl font-bold text-ink-900 sm:text-3xl">
            <TwoToneHeading text={t.faqTitle} />
          </h2>
          <p className="mt-3 text-ink-500">{t.faqSubtitle}</p>
        </motion.div>
        <motion.div
          className="relative mx-auto mt-8 max-w-5xl [perspective:1400px]"
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          variants={container}
        >
          <span aria-hidden="true" className="pointer-events-none absolute -left-12 top-12 h-16 w-72 -rotate-[16deg] rounded-full bg-white/15 blur-xl" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-10 bottom-12 h-20 w-80 rotate-[14deg] rounded-full bg-primary-300/10 blur-xl" />
          <TiltSurface innerClassName="rounded-[1.75rem]" maxTilt={2} lift={7}>
            <div className="faq-card-3d divide-y divide-white/[0.45] rounded-[1.75rem] border border-white/75 bg-white/[0.62] backdrop-blur-2xl">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <motion.div
                    key={faq.id}
                    variants={item}
                    className={`group relative z-[1] transition-colors duration-300 first:rounded-t-[1.75rem] last:rounded-b-[1.75rem] ${isOpen ? 'bg-white/70' : 'bg-white/[0.15] hover:bg-white/40'}`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-8"
                    >
                      <span className="font-heading text-sm font-bold text-ink-900 sm:text-base">{faq.q}</span>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${isOpen ? 'border-accent-400 bg-primary-500 text-white shadow-[0_5px_0_#1e4066]' : 'border-neutral-200 bg-white/80 text-ink-400 shadow-soft group-hover:-translate-y-0.5'}`}>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </span>
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <p className="max-w-4xl px-5 pb-6 text-sm leading-relaxed text-ink-500 sm:px-8">{faq.a}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TiltSurface>
        </motion.div>
      </PageShell>
    </section>
  );
}
