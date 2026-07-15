import Link from 'next/link';
import Image from 'next/image';
import { interests } from '@/data/interests';
import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Reveal from '@/components/ui/Reveal';
import RevealItem from '@/components/ui/RevealItem';

export default function InterestsIndexPage() {
  const { t, pick } = useLanguage();

  return (
    <Layout
      seo={{
        title: t.discoverByInterestTitle,
        description: t.discoverByInterestSubtitle,
        path: '/interests',
      }}
    >
      <PageShell className="py-8">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.interestBreadcrumb }]} />

        <Reveal className="mt-6">
          <h1 className="font-heading text-3xl font-bold text-ink-900 sm:text-4xl">{t.discoverByInterestTitle}</h1>
          <p className="mt-2 max-w-2xl text-ink-500">{t.discoverByInterestSubtitle}</p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {interests.map((interest, i) => (
            <RevealItem key={interest.id} index={i}>
              <Link
                href={`/interests/${interest.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-card-lg shadow-card transition-shadow hover:shadow-lift"
              >
                <Image
                  src={interest.cardPhoto}
                  alt={pick(interest.name)}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">{pick(interest.name)}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-white/85">{pick(interest.tagline)}</p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </div>
      </PageShell>
    </Layout>
  );
}
