import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '@/lib/language';
import { getHotel } from '@/data/hotels';
import { destinations } from '@/data/destinations';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import CompareTable from '@/components/compare/CompareTable';
import Reveal from '@/components/ui/Reveal';
import { Scale } from 'lucide-react';

export default function ComparePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const idsParam = router.query.ids;
  const ids = useMemo(() => {
    const str = Array.isArray(idsParam) ? idsParam[0] : idsParam;
    return str ? str.split(',').filter(Boolean) : [];
  }, [idsParam]);

  const hotels = useMemo(() => ids.map((id) => getHotel(id)).filter((h): h is NonNullable<typeof h> => Boolean(h)), [ids]);

  return (
    <Layout seo={{ title: t.compareTitle, description: t.compareEmptySubtitle, path: '/compare', noindex: true }}>
      <PageHero photo={destinations[5].heroPhoto} title={t.compareTitle} subtitle={t.compareEmptySubtitle} />
      <PageShell className="py-8">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.compareTitle }]} />

        <Reveal className="mt-6">
          {hotels.length === 0 ? (
            <EmptyState
              icon={Scale}
              title={t.compareEmptyTitle}
              subtitle={t.compareEmptySubtitle}
              action={<Button href="/search">{t.compareBrowse}</Button>}
            />
          ) : (
            <CompareTable hotels={hotels} />
          )}
        </Reveal>
      </PageShell>
    </Layout>
  );
}
