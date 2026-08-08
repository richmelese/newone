import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/language';
import { computeAverage } from '@/lib/reviewStats';
import { getReviewsSync } from '@/lib/reviewsService';
import { reviewEntities } from '@/data/reviewEntities';
import { destinations } from '@/data/destinations';
import { SERVICE_TYPES, SERVICE_TYPE_LABELS } from '@/data/serviceConfig';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import FilterChip from '@/components/ui/FilterChip';
import StarRating from '@/components/reviews/StarRating';
import RevealItem from '@/components/ui/RevealItem';
import type { ServiceType } from '@/types';

function EntityCard({ entityId, entityType, revealIndex }: { entityId: string; entityType: ServiceType; revealIndex: number }) {
  const { t, pick } = useLanguage();
  const entity = reviewEntities.find((e) => e.id === entityId && e.type === entityType);
  if (!entity) return null;
  const reviews = getReviewsSync(entity.id, entity.type);
  const average = computeAverage(reviews);

  return (
    <RevealItem index={revealIndex} className="h-full w-full">
      <Link
        href={`/reviews/${entity.type}/${entity.id}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-card-lg bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
      >
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
          {entity.photo && (
            <Image
              src={entity.photo}
              alt={pick(entity.name)}
              fill
              sizes="(max-width: 640px) 90vw, 320px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <span className="absolute left-2.5 top-2.5 rounded-pill bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {pick(SERVICE_TYPE_LABELS[entity.type])}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 font-heading text-base font-bold text-ink-900 group-hover:text-primary-700">{pick(entity.name)}</h3>
          {reviews.length > 0 ? (
            <div className="flex items-center gap-2">
              <StarRating value={average} readOnly size={14} />
              <span className="text-sm font-semibold text-ink-700">{average.toFixed(1)}</span>
              <span className="text-sm text-ink-400">
                ({reviews.length} {t.reviewsSuffix})
              </span>
            </div>
          ) : (
            <span className="text-sm text-ink-400">{t.reviewsEmptyTitle}</span>
          )}
        </div>
      </Link>
    </RevealItem>
  );
}

export default function ReviewsHubPage() {
  const { t, pick } = useLanguage();
  const [activeType, setActiveType] = useState<ServiceType | 'all'>('all');

  const filtered = useMemo(
    () => (activeType === 'all' ? reviewEntities : reviewEntities.filter((e) => e.type === activeType)),
    [activeType],
  );

  return (
    <Layout
      seo={{
        title: t.navReviews,
        description: t.reviewsHubSubtitle,
        path: '/reviews',
      }}
    >
      <PageHero photo={destinations[6].heroPhoto} title={t.reviewsHubTitle} subtitle={t.reviewsHubSubtitle} />
      <PageShell className="py-8">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.navReviews }]} />

        <div className="mb-6 mt-6 flex flex-wrap gap-2">
          <FilterChip label={t.categoryAll} active={activeType === 'all'} onClick={() => setActiveType('all')} />
          {SERVICE_TYPES.map((type) => (
            <FilterChip key={type} label={pick(SERVICE_TYPE_LABELS[type])} active={activeType === type} onClick={() => setActiveType(type)} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entity, i) => (
            <EntityCard key={`${entity.type}-${entity.id}`} entityId={entity.id} entityType={entity.type} revealIndex={i} />
          ))}
        </div>
      </PageShell>
    </Layout>
  );
}
