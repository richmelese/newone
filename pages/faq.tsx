import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FaqSection from '@/components/home/FaqSection';
import EthiopiaMotionBackdrop from '@/components/home/EthiopiaMotionBackdrop';

export default function FaqPage() {
  const { t } = useLanguage();

  return (
    <Layout
      seo={{
        title: t.faqTitle,
        description: t.faqSubtitle,
        path: '/faq',
      }}
    >
      <PageShell className="pt-10">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.faqEyebrow }]} />
      </PageShell>
      <EthiopiaMotionBackdrop>
        <FaqSection />
      </EthiopiaMotionBackdrop>
    </Layout>
  );
}
