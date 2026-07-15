import { useLanguage } from '@/lib/language';
import { useAuth } from '@/lib/auth';
import { destinations } from '@/data/destinations';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import HistoryList from '@/components/account/HistoryList';
import AccountTabs from '@/components/account/AccountTabs';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

export default function HistoryPage() {
  const { t } = useLanguage();
  const { user, hydrated, signOut } = useAuth();

  return (
    <Layout seo={{ title: t.historyTitle, description: t.historyEmptySubtitle, path: '/account/history', noindex: true }}>
      <PageHero photo={destinations[1].heroPhoto} title={t.historyTitle} subtitle={t.historyEmptySubtitle} />
      <PageShell className="py-8">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.historyTitle }]} />

        <Reveal className="mt-6 flex items-center justify-end">
          {hydrated && user ? (
            <Button variant="ghost" size="sm" onClick={signOut}>
              {t.signOut}
            </Button>
          ) : (
            <Button href="/account/sign-in" variant="secondary" size="sm">
              {t.signInButton}
            </Button>
          )}
        </Reveal>
        <AccountTabs />
        <HistoryList />
      </PageShell>
    </Layout>
  );
}
