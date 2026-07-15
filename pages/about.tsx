import Image from 'next/image';
import { Compass, Handshake, ShieldCheck, DoorOpen, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { destinations } from '@/data/destinations';
import { hotels } from '@/data/hotels';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Reveal from '@/components/ui/Reveal';
import RevealItem from '@/components/ui/RevealItem';

export default function AboutPage() {
  const { t } = useLanguage();

  const pillars = [
    { icon: Compass, title: t.aboutPillar1Title, desc: t.aboutPillar1Desc },
    { icon: Handshake, title: t.aboutPillar2Title, desc: t.aboutPillar2Desc },
    { icon: ShieldCheck, title: t.aboutPillar3Title, desc: t.aboutPillar3Desc },
  ];

  const ecosystem = [
    { icon: DoorOpen, title: t.aboutEcosystemFrontDoorTitle, desc: t.aboutEcosystemFrontDoorDesc },
    { icon: Users, title: t.aboutEcosystemPartnersTitle, desc: t.aboutEcosystemPartnersDesc },
    { icon: TrendingUp, title: t.aboutEcosystemHotelsTitle, desc: t.aboutEcosystemHotelsDesc },
  ];

  return (
    <Layout
      seo={{
        title: t.navAbout,
        description: t.aboutHeroSubtitle,
        path: '/about',
      }}
    >
      <section className="relative flex min-h-[360px] items-end overflow-hidden">
        <Image src={destinations[4].heroPhoto} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-hero-scrim" />
        <PageShell className="relative pb-10 pt-32 text-white">
          <Reveal>
            <h1 className="max-w-2xl font-heading text-3xl font-extrabold sm:text-4xl">{t.aboutHeroTitle}</h1>
            <p className="mt-3 max-w-xl text-white/90">{t.aboutHeroSubtitle}</p>
          </Reveal>
        </PageShell>
      </section>

      <PageShell className="py-10">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.navAbout }]} />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {pillars.map((p, i) => (
            <RevealItem key={p.title} index={i}>
              <div className="rounded-card-lg bg-white p-6 shadow-card">
                <p.icon size={24} className="text-primary-600" />
                <h2 className="mt-3 font-heading text-lg font-bold text-ink-900">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{p.desc}</p>
              </div>
            </RevealItem>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <RevealItem index={0}>
            <div className="h-full rounded-card-lg bg-primary-gradient p-6 text-white">
              <p className="text-3xl font-heading font-extrabold">{hotels.length}+</p>
              <p className="mt-1 text-sm text-primary-50">{t.aboutStatHotelsListed}</p>
            </div>
          </RevealItem>
          <RevealItem index={1}>
            <div className="h-full rounded-card-lg bg-white p-6 shadow-card">
              <p className="text-3xl font-heading font-extrabold text-ink-900">{destinations.length}</p>
              <p className="mt-1 text-sm text-ink-500">{t.aboutStatDestinationsCovered}</p>
            </div>
          </RevealItem>
          <RevealItem index={2}>
            <div className="h-full rounded-card-lg bg-white p-6 shadow-card">
              <p className="text-3xl font-heading font-extrabold text-ink-900">0%</p>
              <p className="mt-1 text-sm text-ink-500">{t.aboutStatCommission}</p>
            </div>
          </RevealItem>
        </div>

        <Reveal className="mt-14">
          <h2 className="font-heading text-xl font-bold text-ink-900">{t.aboutEcosystemTitle}</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink-600">{t.aboutEcosystemIntro}</p>

          <div className="relative mt-8 grid gap-6 sm:grid-cols-3">
            {ecosystem.map((step, i) => (
              <RevealItem key={step.title} index={i}>
                <div className="relative h-full rounded-card-lg bg-white p-6 shadow-card">
                  <span className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <step.icon size={24} className="text-primary-600" />
                  <h3 className="mt-3 font-heading text-base font-bold text-ink-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{step.desc}</p>
                </div>
              </RevealItem>
            ))}
          </div>
        </Reveal>
      </PageShell>
    </Layout>
  );
}
