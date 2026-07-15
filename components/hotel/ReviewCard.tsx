import Image from 'next/image';
import Link from 'next/link';
import { ThumbsUp } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { formatDate } from '@/lib/format';
import { helpfulCountFor } from '@/lib/rating';
import RatingStars from '@/components/ui/RatingStars';
import RevealItem from '@/components/ui/RevealItem';
import type { Review } from '@/types';

const AVATAR_COLORS = ['bg-primary-600', 'bg-primary-500', 'bg-ink-700', 'bg-primary-400'];

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

type ReviewCardProps = {
  review: Review;
  photo?: string;
  hotelName?: string;
  hotelHref?: string;
  revealIndex?: number;
};

export default function ReviewCard({ review, photo, hotelName, hotelHref, revealIndex = 0 }: ReviewCardProps) {
  const { language, pick, t } = useLanguage();
  const colorIndex = review.id.charCodeAt(review.id.length - 1) % AVATAR_COLORS.length;

  return (
    <RevealItem index={revealIndex}>
      <div className="border-b border-neutral-200 py-6 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white ${AVATAR_COLORS[colorIndex]}`}>
            {initials(review.author)}
          </span>
          <div>
            <p className="text-base font-semibold text-ink-900">{review.author}</p>
            <p className="text-sm text-ink-400">{formatDate(review.date, language)}</p>
          </div>
        </div>
        <RatingStars rating={review.rating} size={16} />
      </div>
      {hotelName && hotelHref && (
        <Link href={hotelHref} className="mt-2 inline-block text-sm font-semibold text-primary-700 hover:underline">
          {hotelName}
        </Link>
      )}
      <p className="mt-3 text-base leading-relaxed text-ink-600">{pick(review.comment)}</p>
      {photo && (
        <div className="relative mt-3 h-32 w-44 overflow-hidden rounded-lg">
          <Image src={photo} alt="Review photo" fill sizes="176px" className="object-cover" />
        </div>
      )}
      <button type="button" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 hover:text-primary-700">
        <ThumbsUp size={15} />
        {t.reviewHelpfulPrefix} ({helpfulCountFor(review.id)})
      </button>
      </div>
    </RevealItem>
  );
}
