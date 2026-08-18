import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/language';
import { useToast } from '@/lib/toast';
import { serviceConfig } from '@/data/serviceConfig';
import { reviewsApi, reviewSubjectsApi, type CreateReviewPayload } from '@/lib/api';
import StarRating from '@/components/reviews/StarRating';
import TripTypeChips from '@/components/reviews/TripTypeChips';
import Button from '@/components/ui/Button';
import type { ReviewEntityRef, TripType } from '@/types';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function ReviewPageForm({ entity, returnHref, onSubmitted }: { entity: ReviewEntityRef; returnHref: string; onSubmitted?: () => void }) {
  const { user, token } = useAuth();
  const { t, pick } = useLanguage();
  const { show } = useToast();
  const router = useRouter();
  const config = serviceConfig[entity.type];
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [subRatings, setSubRatings] = useState<Record<string, number>>({});
  const [tripType, setTripType] = useState<TripType | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [certified, setCertified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const allRatingsSet = config.subRatings.every((item) => (subRatings[item.key] ?? 0) > 0);
  const canSubmit = Boolean(user && title.trim() && content.trim().length >= 20 && rating && allRatingsSet && tripType && visitDate && certified);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !tripType || !canSubmit) {
      setError(t.reviewFormIncompleteError);
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const tripTypes: Record<TripType, CreateReviewPayload['trip_type']> = {
        solo: 'Solo',
        couple: 'Couple',
        family: 'Family',
        friends: 'Friends',
        business: 'Business',
      };
      if (entity.type !== 'hotel') {
        throw new Error('API review subjects are currently available for hotels only.');
      }
      const reviewSubjectId = await reviewSubjectsApi.resolveHotel(entity.id, token || undefined);
      await reviewsApi.create({
        review_subject: reviewSubjectId,
        title: title.trim(),
        content: content.trim(),
        overall_rating: rating,
        cleanliness_rating: subRatings.cleanliness ?? rating,
        service_rating: subRatings.service ?? rating,
        location_rating: subRatings.location ?? rating,
        value_rating: subRatings.value ?? rating,
        trip_type: tripTypes[tripType],
      }, token || undefined);
      show(t.reviewPendingToast, 'success');
      if (onSubmitted) onSubmitted();
      else await router.push(returnHref);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to submit your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card-lg border border-neutral-200 bg-white p-5 shadow-card sm:p-8">
      <div className="border-b border-neutral-200 pb-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary-600">{pick(entity.name)}</p>
        <h1 className="mt-1 font-heading text-2xl font-extrabold text-ink-900">{t.writeReviewTitle}</h1>
        <p className="mt-1 text-sm text-ink-500">Signed in as {user?.name}</p>
      </div>

      <div className="mt-6">
        <label htmlFor="review-title" className="sr-only">{t.reviewTitleLabel}</label>
        <input
          id="review-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          className="h-12 w-full rounded-xl border border-neutral-300 bg-neutral-100 px-4 text-sm outline-none transition focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
        <div>
          <label htmlFor="review-content" className="sr-only">{t.reviewTextLabel}</label>
          <textarea
            id="review-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Review content"
            rows={11}
            className="h-full min-h-[280px] w-full resize-y rounded-xl border border-neutral-300 bg-neutral-100 p-4 text-sm outline-none transition focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-50"
          />
          <p className="mt-1.5 text-xs text-ink-400">Write at least 20 characters about your experience.</p>
        </div>

        <aside className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="border-b border-neutral-200 pb-4">
            <p className="text-sm font-bold text-ink-800">{t.overallRatingLabel}</p>
            <StarRating value={rating} onChange={setRating} size={23} label={t.overallRatingLabel} className="mt-2" />
          </div>
          <div className="mt-4 space-y-4">
            {config.subRatings.map((item) => (
              <div key={item.key}>
                <p className="text-sm font-medium text-ink-700">{pick(item.label)}</p>
                <StarRating
                  value={subRatings[item.key] ?? 0}
                  onChange={(value) => setSubRatings((current) => ({ ...current, [item.key]: value }))}
                  size={18}
                  label={pick(item.label)}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-6 grid gap-5 border-t border-neutral-200 pt-6 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-ink-800">{t.tripTypeLabel}</p>
          <TripTypeChips mode="select" value={tripType} onChange={setTripType} />
        </div>
        <label className="text-sm font-semibold text-ink-800">
          {t.visitDateLabel}
          <input
            type="date"
            max={todayIso()}
            value={visitDate}
            onChange={(event) => setVisitDate(event.target.value)}
            className="mt-2 block h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm font-normal outline-none focus:border-primary-500"
          />
        </label>
      </div>

      <label className="mt-5 flex items-start gap-2.5 text-sm text-ink-600">
        <input type="checkbox" checked={certified} onChange={(event) => setCertified(event.target.checked)} className="mt-0.5 h-4 w-4 accent-primary-600" />
        {t.certifyLabel}
      </label>

      {error && <p className="mt-4 text-sm font-semibold text-danger-500">{error}</p>}

      <div className="mt-6 flex justify-center">
        <Button type="submit" size="lg" disabled={!canSubmit || submitting}>
          {submitting ? t.submittingLabel : t.submitReviewLabel}
        </Button>
      </div>
    </form>
  );
}
