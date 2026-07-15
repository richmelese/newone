import Image from 'next/image';
import { BadgePercent, Users, ClipboardCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { destinations } from '@/data/destinations';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import RevealItem from '@/components/ui/RevealItem';

export default function ForHotelsPage() {
  const { t } = useLanguage();

  const benefits = [
    { icon: BadgePercent, title: t.forHotelsBenefit1Title, desc: t.forHotelsBenefit1Desc },
    { icon: Users, title: t.forHotelsBenefit2Title, desc: t.forHotelsBenefit2Desc },
    { icon: ClipboardCheck, title: t.forHotelsBenefit3Title, desc: t.forHotelsBenefit3Desc },
  ];

  return (
    <Layout
      seo={{
        title: t.navForHotels,
        description: t.forHotelsHeroSubtitle,
        path: '/for-hotels',
      }}
    >
      <section className="relative flex min-h-[420px] items-center overflow-hidden">
        <Image src={destinations[1].heroPhoto} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-hero-scrim" />
        <PageShell className="relative py-24 text-white">
          <Reveal className="max-w-2xl">
            <h1 className="font-heading text-3xl font-extrabold sm:text-4xl">{t.forHotelsHeroTitle}</h1>
            <p className="mt-3 text-white/90">{t.forHotelsHeroSubtitle}</p>
            <Button href="/for-hotels/get-started" size="lg" className="mt-6">
              {t.forHotelsGetStarted}
            </Button>
          </Reveal>
        </PageShell>
      </section>

      <PageShell className="py-10">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.navForHotels }]} />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {benefits.map((b, i) => (
            <RevealItem key={b.title} index={i}>
              <div className="h-full rounded-card-lg bg-white p-6 shadow-card">
                <b.icon size={24} className="text-primary-600" />
                <h2 className="mt-3 font-heading text-lg font-bold text-ink-900">{b.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{b.desc}</p>
              </div>
            </RevealItem>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="rounded-card-lg bg-white p-8 text-center shadow-card">
            <h2 className="font-heading text-xl font-bold text-ink-900">{t.forHotelsHeroTitle}</h2>
            <Button href="/for-hotels/get-started" size="lg" className="mt-5">
              {t.forHotelsGetStarted}
            </Button>
          </div>
        </Reveal>
      </PageShell>
    </Layout>
  );
}
