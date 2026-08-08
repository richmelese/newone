import { useLanguage } from '@/lib/language';
import { useAuth } from '@/lib/auth';
import { destinations } from '@/data/destinations';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import MyReviews from '@/components/reviews/MyReviews';
import AccountTabs from '@/components/account/AccountTabs';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

export default function MyReviewsPage() {
  const { t } = useLanguage();
  const { user, hydrated, signOut } = useAuth();

  return (
    <Layout seo={{ title: t.myReviewsTitle, description: t.myReviewsEmptySubtitle, path: '/account/reviews', noindex: true }}>
      <PageHero photo={destinations[2].heroPhoto} title={t.myReviewsTitle} subtitle={t.myReviewsEmptySubtitle} />
      <PageShell className="py-8">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.myReviewsTitle }]} />

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
        <MyReviews />
      </PageShell>
    </Layout>
  );
}
