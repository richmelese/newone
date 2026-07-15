import { useLanguage } from '@/lib/language';
import { destinations } from '@/data/destinations';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Reveal from '@/components/ui/Reveal';
import SignUpForm from '@/components/account/SignUpForm';

export default function SignUpPage() {
  const { t } = useLanguage();

  return (
    <Layout seo={{ title: t.signUpTitle, description: t.signUpSubtitle, path: '/account/sign-up', noindex: true }}>
      <PageHero photo={destinations[1].heroPhoto} title={t.signUpTitle} subtitle={t.signUpSubtitle} />
      <PageShell className="flex min-h-[50vh] items-center justify-center py-12">
        <Reveal className="w-full max-w-sm rounded-card-lg bg-white p-8 shadow-card">
          <SignUpForm />
        </Reveal>
      </PageShell>
    </Layout>
  );
}
