import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <Layout seo={{ title: t.notFoundTitle, description: t.notFoundSubtitle, noindex: true, path: '/404' }}>
      <PageShell className="flex min-h-[70vh] items-center justify-center py-16">
        <EmptyState
          icon={Compass}
          title={t.notFoundTitle}
          subtitle={t.notFoundSubtitle}
          action={<Button href="/">{t.backHome}</Button>}
        />
      </PageShell>
    </Layout>
  );
}
