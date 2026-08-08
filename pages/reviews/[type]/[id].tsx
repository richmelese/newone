import Image from 'next/image';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useLanguage } from '@/lib/language';
import { getReviewEntity, reviewEntities } from '@/data/reviewEntities';
import { SERVICE_TYPE_LABELS } from '@/data/serviceConfig';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Reveal from '@/components/ui/Reveal';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import type { ReviewEntityRef } from '@/types';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: reviewEntities.map((e) => ({ params: { type: e.type, id: e.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ entity: ReviewEntityRef }> = async ({ params }) => {
  const entity = getReviewEntity(params?.type as ReviewEntityRef['type'], params?.id as string);
  if (!entity) return { notFound: true };
  return { props: { entity } };
};

export default function ReviewEntityPage({ entity }: { entity: ReviewEntityRef }) {
  const { t, pick } = useLanguage();

  return (
    <Layout
      seo={{
        title: `${pick(entity.name)} — ${t.navReviews}`,
        description: t.reviewsHubSubtitle,
        image: entity.photo,
        path: `/reviews/${entity.type}/${entity.id}`,
      }}
    >
      <PageShell className="py-6">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: t.navReviews, href: '/reviews' },
            { label: pick(entity.name) },
          ]}
        />

        <Reveal className="mt-4">
          {entity.photo && (
            <div className="relative h-48 w-full overflow-hidden rounded-card-lg sm:h-64">
              <Image src={entity.photo} alt={pick(entity.name)} fill sizes="100vw" className="object-cover" />
            </div>
          )}
          <div className="mt-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">{pick(SERVICE_TYPE_LABELS[entity.type])}</span>
            <h1 className="mt-1 font-heading text-2xl font-bold text-ink-900">{pick(entity.name)}</h1>
          </div>
        </Reveal>

        <div className="mt-8">
          <ReviewsSection entity={entity} />
        </div>
      </PageShell>
    </Layout>
  );
}
