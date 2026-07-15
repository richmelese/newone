import { useLanguage } from '@/lib/language';
import { destinations } from '@/data/destinations';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Reveal from '@/components/ui/Reveal';
import SignInForm from '@/components/account/SignInForm';

export default function SignInPage() {
  const { t } = useLanguage();

  return (
    <Layout seo={{ title: t.signInTitle, description: t.signInSubtitle, path: '/account/sign-in', noindex: true }}>
      <PageHero photo={destinations[1].heroPhoto} title={t.signInTitle} subtitle={t.signInSubtitle} />
      <PageShell className="flex min-h-[50vh] items-center justify-center py-12">
        <Reveal className="w-full max-w-sm rounded-card-lg bg-white p-8 shadow-card">
          <SignInForm />
        </Reveal>
      </PageShell>
    </Layout>
  );
}
