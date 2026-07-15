import { ShieldCheck, Headset, Lock } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import PageShell from '@/components/layout/PageShell';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import Reveal from '@/components/ui/Reveal';
import RevealItem from '@/components/ui/RevealItem';

export default function TrustStrip() {
  const { t } = useLanguage();

  const items = [
    { icon: ShieldCheck, title: t.trustVerifiedTitle, desc: t.trustVerifiedDesc },
    { icon: Headset, title: t.trustSupportTitle, desc: t.trustSupportDesc },
    { icon: Lock, title: t.trustSecureTitle, desc: t.trustSecureDesc },
  ];

  return (
    <section className="py-10 sm:py-12">
      <PageShell>
        <Reveal>
          <h2 className="inline-flex rounded-pill border border-white/70 bg-white/60 px-5 py-3 font-heading text-xl font-bold text-ink-900 shadow-soft backdrop-blur-xl sm:text-2xl">
            <TwoToneHeading text={t.trustTitle} />
          </h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {items.map((item, i) => (
            <RevealItem key={item.title} index={i}>
              <div className="flex h-full items-start gap-3 rounded-card-lg border border-white/70 bg-white/80 p-5 shadow-card backdrop-blur-xl">
                <item.icon size={22} className="mt-0.5 shrink-0 text-primary-600" />
                <div>
                  <h3 className="font-heading text-sm font-bold text-ink-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-500">{item.desc}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </div>
      </PageShell>
    </section>
  );
}
