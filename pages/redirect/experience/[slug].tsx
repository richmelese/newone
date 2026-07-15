import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { ExternalLink, Ticket } from 'lucide-react';
import { experiences, getExperience } from '@/data/experiences';
import { useLanguage } from '@/lib/language';
import { formatDate } from '@/lib/format';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import type { Experience } from '@/types';

const REDIRECT_DELAY_MS = 2600;

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: experiences.filter((e) => e.bookable && e.externalBookingUrl).map((e) => ({ params: { slug: e.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ experience: Experience }> = async ({ params }) => {
  const experience = getExperience(params?.slug as string);
  if (!experience || !experience.bookable || !experience.externalBookingUrl) return { notFound: true };
  return { props: { experience } };
};

export default function ExperienceRedirectPage({ experience }: { experience: Experience }) {
  const { t, pick, language } = useLanguage();
  const router = useRouter();
  const name = pick(experience.name);
  const bookingUrl = experience.externalBookingUrl as string;
  const { checkin, checkout, guests } = router.query;
  const bookingSummary =
    typeof checkin === 'string' && typeof checkout === 'string' && typeof guests === 'string'
      ? `${formatDate(checkin, language)} – ${formatDate(checkout, language)} · ${guests} ${t.serviceBookingGuestsLabel}`
      : undefined;

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = bookingUrl;
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [bookingUrl]);

  return (
    <Layout
      seo={{
        title: `${t.redirectTitle} ${name}`,
        description: t.redirectExplainExperience,
        noindex: true,
        path: `/redirect/experience/${experience.id}`,
      }}
    >
      <PageShell className="flex min-h-[70vh] items-center justify-center py-16">
        <Reveal className="w-full max-w-md rounded-card-lg bg-white p-8 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-700">
            <Ticket size={28} />
          </div>
          <h1 className="mt-5 font-heading text-xl font-bold text-ink-900">
            {t.redirectTitle} {name}
            {t.redirectTitleSuffix}
          </h1>
          <div className="mt-6 flex justify-center">
            <Spinner size={36} />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ink-500">{t.redirectExplainExperience}</p>

          {bookingSummary && (
            <p className="mt-3 rounded-card bg-primary-50 px-4 py-2.5 text-sm font-semibold text-primary-700">
              {t.redirectBookingSummaryPrefix} {bookingSummary}
            </p>
          )}

          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink-400">{experience.externalSiteName}</p>

          <div className="mt-4 h-1 w-full overflow-hidden rounded-pill bg-neutral-100">
            <span
              className="block h-full rounded-pill bg-primary-600 animate-progress-fill"
              style={{ animationDuration: `${REDIRECT_DELAY_MS}ms` }}
            />
          </div>

          <div className="mt-7 flex flex-col gap-2">
            <Button href={bookingUrl} external size="lg" fullWidth>
              <ExternalLink size={16} />
              {t.redirectContinueNow}
            </Button>
            <Button href={`/experiences/${experience.id}`} variant="ghost" size="md" fullWidth>
              {t.redirectBackToExperience}
            </Button>
          </div>
        </Reveal>
      </PageShell>
    </Layout>
  );
}
