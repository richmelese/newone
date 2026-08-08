import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/lib/auth';
import { formatDate } from '@/lib/format';
import { getMyReviews } from '@/lib/reviewsService';
import { Skeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import type { EntityReview, ReviewStatus } from '@/types';

const STATUS_STYLES: Record<ReviewStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-600',
  published: 'bg-success-500/10 text-success-500',
  rejected: 'bg-danger-500/10 text-danger-500',
};

function StatusPill({ status }: { status: ReviewStatus }) {
  const { t } = useLanguage();
  const label = { pending: t.statusPending, published: t.statusPublished, rejected: t.statusRejected }[status];
  return <span className={`inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}>{label}</span>;
}

export default function MyReviews() {
  const { t, pick, language } = useLanguage();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<EntityReview[] | null>(null);

  useEffect(() => {
    if (!user) return;
    getMyReviews(user.email).then(setReviews);
  }, [user]);

  if (!user) {
    return <EmptyState title={t.accountSignInRequired} action={<Button href="/account/sign-in">{t.signInButton}</Button>} />;
  }

  if (reviews === null) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-card-lg" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        title={t.myReviewsEmptyTitle}
        subtitle={t.myReviewsEmptySubtitle}
        action={<Button href="/reviews">{t.chooseServiceTitle}</Button>}
      />
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const title = review.title[language] || review.title.en || review.title.am;
        return (
          <div key={review.id} className="rounded-card-lg bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink-500">{pick(review.entityName)}</p>
                <h3 className="mt-0.5 font-heading text-base font-bold text-ink-900">{title || t.reviewTitleLabel}</h3>
              </div>
              <StatusPill status={review.status} />
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-ink-500">
              <span className="inline-flex items-center gap-1 text-amber-500">
                <Star size={14} fill="currentColor" strokeWidth={0} />
                {review.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span>{formatDate(review.visitDate, language)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
