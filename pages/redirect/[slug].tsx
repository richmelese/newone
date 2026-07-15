import { useEffect } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { ExternalLink, Landmark } from 'lucide-react';
import { getHotel, hotels } from '@/data/hotels';
import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import type { Hotel } from '@/types';

const REDIRECT_DELAY_MS = 2600;

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: hotels.map((h) => ({ params: { slug: h.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ hotel: Hotel }> = async ({ params }) => {
  const hotel = getHotel(params?.slug as string);
  if (!hotel) return { notFound: true };
  return { props: { hotel } };
};

export default function RedirectPage({ hotel }: { hotel: Hotel }) {
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = hotel.externalBookingUrl;
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [hotel.externalBookingUrl]);

  return (
    <Layout seo={{ title: `${t.redirectTitle} ${hotel.name}`, description: t.redirectExplain, noindex: true, path: `/redirect/${hotel.slug}` }}>
      <PageShell className="flex min-h-[70vh] items-center justify-center py-16">
        <Reveal className="w-full max-w-md rounded-card-lg bg-white p-8 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-700">
            <Landmark size={28} />
          </div>
          <h1 className="mt-5 font-heading text-xl font-bold text-ink-900">
            {t.redirectTitle} {hotel.name}
            {t.redirectTitleSuffix}
          </h1>
          <div className="mt-6 flex justify-center">
            <Spinner size={36} />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-ink-500">{t.redirectExplain}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink-400">{hotel.externalSiteName}</p>

          <div className="mt-4 h-1 w-full overflow-hidden rounded-pill bg-neutral-100">
            <span
              className="block h-full rounded-pill bg-primary-600 animate-progress-fill"
              style={{ animationDuration: `${REDIRECT_DELAY_MS}ms` }}
            />
          </div>

          <div className="mt-7 flex flex-col gap-2">
            <Button href={hotel.externalBookingUrl} external size="lg" fullWidth>
              <ExternalLink size={16} />
              {t.redirectContinueNow}
            </Button>
            <Button href={`/hotels/${hotel.slug}`} variant="ghost" size="md" fullWidth>
              {t.redirectBackToHotel}
            </Button>
          </div>
        </Reveal>
      </PageShell>
    </Layout>
  );
}
