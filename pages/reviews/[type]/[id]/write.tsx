import { useEffect } from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { useAuth } from '@/lib/auth';
import { useAuthModal } from '@/lib/authModal';
import { useLanguage } from '@/lib/language';
import { getReviewEntity, reviewEntities } from '@/data/reviewEntities';
import { hotels } from '@/data/hotels';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Spinner from '@/components/ui/Spinner';
import ReviewPageForm from '@/components/reviews/ReviewPageForm';
import type { ReviewEntityRef } from '@/types';

type WriteReviewPageProps = {
  entity: ReviewEntityRef;
  returnHref: string;
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: reviewEntities.map((entity) => ({ params: { type: entity.type, id: entity.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<WriteReviewPageProps> = async ({ params }) => {
  const entity = getReviewEntity(params?.type as ReviewEntityRef['type'], params?.id as string);
  if (!entity) return { notFound: true };
  const hotel = entity.type === 'hotel' ? hotels.find((item) => item.id === entity.id) : undefined;
  return {
    props: {
      entity,
      returnHref: hotel ? `/hotels/${hotel.slug}#reviews` : `/reviews/${entity.type}/${entity.id}`,
    },
  };
};

export default function WriteReviewPage({ entity, returnHref }: WriteReviewPageProps) {
  const { user, hydrated } = useAuth();
  const { t, pick } = useLanguage();
  const { openSignIn } = useAuthModal();
  const writePath = `/reviews/${entity.type}/${entity.id}/write`;

  useEffect(() => {
    if (hydrated && !user) {
      openSignIn();
    }
  }, [hydrated, openSignIn, user]);

  return (
    <Layout seo={{ title: `${t.writeReviewTitle} — ${pick(entity.name)}`, description: t.reviewTrustLine, path: writePath, noindex: true }}>
      <PageShell className="pb-16 pt-28 sm:pt-32">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: pick(entity.name), href: returnHref }, { label: t.writeReviewTitle }]} />
        <div className="mx-auto mt-5 max-w-5xl">
          {!hydrated || !user ? (
            <div className="grid min-h-[320px] place-items-center rounded-card-lg bg-white shadow-card"><Spinner size={36} /></div>
          ) : (
            <ReviewPageForm entity={entity} returnHref={returnHref} />
          )}
        </div>
      </PageShell>
    </Layout>
  );
}
