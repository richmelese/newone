import type { NextPageContext } from 'next';
import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

type ErrorPageProps = {
  statusCode: number;
};

function ErrorPage({ statusCode }: ErrorPageProps) {
  const { t } = useLanguage();
  const title = statusCode === 404 ? t.notFoundTitle : 'Something went wrong';
  const subtitle = statusCode === 404 ? t.notFoundSubtitle : 'Please try again in a moment.';

  return (
    <Layout seo={{ title, description: subtitle, noindex: true, path: '/_error' }}>
      <PageShell className="flex min-h-[70vh] items-center justify-center py-16">
        <EmptyState
          icon={AlertTriangle}
          title={title}
          subtitle={subtitle}
          action={<Button href="/">{t.backHome}</Button>}
        />
      </PageShell>
    </Layout>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};

export default ErrorPage;
