import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '@/lib/language';
import { formatDate } from '@/lib/format';
import { hasVotedHelpful, voteHelpful } from '@/lib/reviewsService';
import StarRating from '@/components/reviews/StarRating';
import TripTypeChips from '@/components/reviews/TripTypeChips';
import VerifiedBadge from '@/components/reviews/VerifiedBadge';
import Lightbox from '@/components/ui/Lightbox';
import RevealItem from '@/components/ui/RevealItem';
import type { EntityReview } from '@/types';

const AVATAR_COLORS = ['bg-primary-600', 'bg-primary-500', 'bg-ink-700', 'bg-primary-400'];

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

type ReviewCardProps = {
  review: EntityReview;
  revealIndex?: number;
  standalone?: boolean;
};

export default function ReviewCard({ review, revealIndex = 0, standalone = false }: ReviewCardProps) {
  const { language, pick, t } = useLanguage();
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount);
  const [voted, setVoted] = useState(() => hasVotedHelpful(review.id));
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const colorIndex = review.id.charCodeAt(review.id.length - 1) % AVATAR_COLORS.length;

  const title = review.title[language] || review.title.en || review.title.am;
  const text = review.text[language] || review.text.en || review.text.am;

  async function handleHelpful() {
    setVoted((v) => !v);
    setHelpfulCount((c) => (voted ? c - 1 : c + 1));
    const result = await voteHelpful(review.id);
    setVoted(result.voted);
    setHelpfulCount(result.helpfulCount);
  }

  return (
    <RevealItem index={revealIndex}>
      <div className={clsx('py-6', standalone ? 'rounded-card-lg border border-neutral-200 bg-white px-5 shadow-card sm:px-6' : 'border-b border-neutral-200 last:border-b-0')}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${AVATAR_COLORS[colorIndex]}`}>
              {initials(review.author.name)}
            </span>
            <div>
              <p className="flex items-center gap-2 text-base font-semibold text-ink-900">
                {review.author.name}
                {review.verified && <VerifiedBadge />}
              </p>
              <p className="text-sm text-ink-400">{formatDate(review.visitDate, language)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TripTypeChips mode="display" value={review.tripType} />
            <StarRating value={review.rating} readOnly size={15} />
          </div>
        </div>

        {title && <h4 className="mt-3 font-heading text-base font-bold text-ink-900">{title}</h4>}
        {text && <p className="mt-1.5 text-base leading-relaxed text-ink-600">{text}</p>}

        {review.photos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {review.photos.map((photo, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="Review photo" className="h-full w-full object-cover transition-transform hover:scale-105" />
              </button>
            ))}
          </div>
        )}

        {lightboxIndex !== null && (
          <Lightbox
            photos={review.photos}
            index={lightboxIndex}
            alt="Review photo"
            onClose={() => setLightboxIndex(null)}
            onIndexChange={setLightboxIndex}
          />
        )}

        <button
          type="button"
          onClick={handleHelpful}
          aria-pressed={voted}
          className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
            voted ? 'text-primary-700' : 'text-ink-400 hover:text-primary-700'
          }`}
        >
          <ThumbsUp size={15} fill={voted ? 'currentColor' : 'none'} />
          {t.reviewHelpfulPrefix} ({helpfulCount})
        </button>
      </div>
    </RevealItem>
  );
}
