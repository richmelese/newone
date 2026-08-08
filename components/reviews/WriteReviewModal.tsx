import { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/language';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { serviceConfig } from '@/data/serviceConfig';
import { submitReview } from '@/lib/reviewsService';
import StarRating from '@/components/reviews/StarRating';
import TripTypeChips from '@/components/reviews/TripTypeChips';
import PhotoUploader from '@/components/reviews/PhotoUploader';
import Button from '@/components/ui/Button';
import type { EntityReview, ReviewEntityRef, TripType } from '@/types';

const MIN_TEXT_LENGTH = 100;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

type WriteReviewModalProps = {
  entity: ReviewEntityRef;
  onClose: () => void;
  onSubmitted: (review: EntityReview) => void;
};

export default function WriteReviewModal({ entity, onClose, onSubmitted }: WriteReviewModalProps) {
  const { t, pick } = useLanguage();
  const { user, signIn } = useAuth();
  const { show } = useToast();
  const config = serviceConfig[entity.type];

  const [signInName, setSignInName] = useState('');
  const [signInEmail, setSignInEmail] = useState('');

  const [rating, setRating] = useState(0);
  const [subRatings, setSubRatings] = useState<Record<string, number>>({});
  const [titleEn, setTitleEn] = useState('');
  const [titleAm, setTitleAm] = useState('');
  const [textEn, setTextEn] = useState('');
  const [textAm, setTextAm] = useState('');
  const [tripType, setTripType] = useState<TripType | null>(null);
  const [visitDate, setVisitDate] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [certified, setCertified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textLongEnough = textEn.trim().length >= MIN_TEXT_LENGTH || textAm.trim().length >= MIN_TEXT_LENGTH;
  const allSubRatingsSet = config.subRatings.every((s) => (subRatings[s.key] ?? 0) > 0);
  const canSubmit =
    rating > 0 &&
    allSubRatingsSet &&
    (titleEn.trim() || titleAm.trim()) &&
    textLongEnough &&
    tripType !== null &&
    visitDate &&
    certified;

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!signInName.trim() || !signInEmail.trim()) return;
    signIn({ name: signInName.trim(), email: signInEmail.trim() });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !user || !tripType) {
      setError(t.reviewFormIncompleteError);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const review = await submitReview({
        entityId: entity.id,
        entityType: entity.type,
        entityName: entity.name,
        author: { name: user.name, email: user.email },
        rating,
        subRatings,
        title: { en: titleEn.trim(), am: titleAm.trim() },
        text: { en: textEn.trim(), am: textAm.trim() },
        tripType,
        visitDate,
        photos,
      });
      onSubmitted(review);
      show(t.reviewPendingToast, 'success');
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="write-review-title">
      <button type="button" className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" onClick={onClose} aria-label={t.filterApply} />
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-hero sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-xl sm:rounded-card-lg"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-neutral-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <div>
            <h2 id="write-review-title" className="font-heading text-lg font-bold text-ink-900 sm:text-xl">
              {t.writeReviewTitle}
            </h2>
            <p className="mt-1 text-sm text-ink-500">{pick(entity.name)}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg border border-neutral-200 p-2 text-ink-500 hover:bg-neutral-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {!user ? (
            <div>
              <p className="mb-4 text-sm text-ink-600">{t.writeReviewSignInPrompt}</p>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label htmlFor="wr-name" className="mb-1.5 block text-sm font-semibold text-ink-700">
                    {t.nameLabel}
                  </label>
                  <input
                    id="wr-name"
                    required
                    value={signInName}
                    onChange={(e) => setSignInName(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="wr-email" className="mb-1.5 block text-sm font-semibold text-ink-700">
                    {t.emailLabel}
                  </label>
                  <input
                    id="wr-email"
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
                  />
                </div>
                <Button type="submit" fullWidth>
                  {t.signInButton}
                </Button>
              </form>
            </div>
          ) : (
            <form id="write-review-form" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-semibold text-ink-800">{t.overallRatingLabel}</p>
                <StarRating value={rating} onChange={setRating} size={28} label={t.overallRatingLabel} />
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-ink-800">{t.subRatingsTitle}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {config.subRatings.map((sub) => (
                    <div key={sub.key} className="flex items-center justify-between gap-3 rounded-lg bg-neutral-100 px-3.5 py-2.5">
                      <span className="text-sm font-medium text-ink-700">{pick(sub.label)}</span>
                      <StarRating
                        value={subRatings[sub.key] ?? 0}
                        onChange={(v) => setSubRatings((prev) => ({ ...prev, [sub.key]: v }))}
                        size={16}
                        label={pick(sub.label)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="wr-title-en" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  {t.reviewTitleLabel} (EN)
                </label>
                <input
                  id="wr-title-en"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
                />
                <label htmlFor="wr-title-am" className="mb-1.5 mt-3 block text-sm font-semibold text-ink-700">
                  {t.reviewTitleLabel} (አማ)
                </label>
                <input
                  id="wr-title-am"
                  value={titleAm}
                  onChange={(e) => setTitleAm(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label htmlFor="wr-text-en" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  {t.reviewTextLabel} (EN)
                </label>
                <textarea
                  id="wr-text-en"
                  rows={4}
                  value={textEn}
                  onChange={(e) => setTextEn(e.target.value)}
                  className="w-full resize-none rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
                />
                <label htmlFor="wr-text-am" className="mb-1.5 mt-3 block text-sm font-semibold text-ink-700">
                  {t.reviewTextLabel} (አማ)
                </label>
                <textarea
                  id="wr-text-am"
                  rows={4}
                  value={textAm}
                  onChange={(e) => setTextAm(e.target.value)}
                  className="w-full resize-none rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500"
                />
                <p className="mt-1.5 text-xs text-ink-400">{t.reviewTextMinHint}</p>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-ink-800">{t.tripTypeLabel}</p>
                <TripTypeChips mode="select" value={tripType} onChange={setTripType} />
              </div>

              <div>
                <label htmlFor="wr-visit-date" className="mb-1.5 block text-sm font-semibold text-ink-700">
                  {t.visitDateLabel}
                </label>
                <input
                  id="wr-visit-date"
                  type="date"
                  required
                  max={todayIso()}
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm outline-none focus:border-primary-500 sm:w-56"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-ink-800">{t.photosLabel}</p>
                <PhotoUploader photos={photos} onChange={setPhotos} />
              </div>

              <label className="flex items-start gap-2.5 text-sm text-ink-600">
                <input
                  type="checkbox"
                  checked={certified}
                  onChange={(e) => setCertified(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                {t.certifyLabel}
              </label>

              <p className="text-xs text-ink-400">{t.reviewTrustLine}</p>

              {error && <p className="text-sm font-medium text-danger-500">{error}</p>}
            </form>
          )}
        </div>

        {user && (
          <div className="sticky bottom-0 border-t border-neutral-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
            <Button type="submit" form="write-review-form" fullWidth disabled={!canSubmit || submitting}>
              {submitting ? t.submittingLabel : t.submitReviewLabel}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
