import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { destinations } from '@/data/destinations';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

export default function ContactPage() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout seo={{ title: t.contactTitle, description: t.contactSubtitle, path: '/contact' }}>
      <PageHero photo={destinations[0].heroPhoto} title={t.contactTitle} subtitle={t.contactSubtitle} />
      <PageShell className="py-10">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.contactTitle }]} />

        <Reveal className="mx-auto mt-6 max-w-lg rounded-card-lg bg-white p-8 shadow-card">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 size={40} className="text-success-500" />
              <p className="font-semibold text-ink-800">{t.contactSuccess}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  {t.contactNameLabel}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  {t.contactEmailLabel}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  {t.contactMessageLabel}
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  className="w-full resize-none rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
                />
              </div>
              <Button type="submit" fullWidth size="lg">
                {t.contactSubmit}
              </Button>
            </form>
          )}
        </Reveal>
      </PageShell>
    </Layout>
  );
}
