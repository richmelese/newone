import { mockReviews } from '@/data/mockReviews';
import type { EntityReview, ReviewAuthor, ServiceType, TripType, Localized } from '@/types';

const USER_REVIEWS_KEY = 'ethiopidia:reviews:user';
const VOTES_KEY = 'ethiopidia:reviews:votes';
const VOTE_DELTA_KEY = 'ethiopidia:reviews:vote-delta';

function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getUserReviews(): EntityReview[] {
  return readJson<EntityReview[]>(USER_REVIEWS_KEY, []);
}

function getVotes(): Record<string, boolean> {
  return readJson<Record<string, boolean>>(VOTES_KEY, {});
}

function getVoteDeltas(): Record<string, number> {
  return readJson<Record<string, number>>(VOTE_DELTA_KEY, {});
}

function applyVoteDelta(review: EntityReview, deltas: Record<string, number>): EntityReview {
  const delta = deltas[review.id] ?? 0;
  return delta === 0 ? review : { ...review, helpfulCount: review.helpfulCount + delta };
}

function allReviewsRaw(): EntityReview[] {
  return [...mockReviews, ...getUserReviews()];
}

export type NewReviewInput = {
  entityId: string;
  entityType: ServiceType;
  entityName: Localized;
  author: ReviewAuthor;
  rating: number;
  subRatings: Record<string, number>;
  title: Localized;
  text: Localized;
  tripType: TripType;
  visitDate: string;
  photos: string[];
};

/** Synchronous read for lightweight list/card contexts (e.g. the service hub grid) that don't need the loading/error simulation. */
export function getReviewsSync(entityId: string, type: ServiceType): EntityReview[] {
  const deltas = getVoteDeltas();
  return allReviewsRaw()
    .filter((r) => r.entityId === entityId && r.entityType === type && r.status === 'published')
    .map((r) => applyVoteDelta(r, deltas));
}

export async function getReviews(entityId: string, type: ServiceType): Promise<EntityReview[]> {
  const deltas = getVoteDeltas();
  const reviews = allReviewsRaw()
    .filter((r) => r.entityId === entityId && r.entityType === type && r.status === 'published')
    .map((r) => applyVoteDelta(r, deltas))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return delay(reviews);
}

export async function submitReview(input: NewReviewInput): Promise<EntityReview> {
  const review: EntityReview = {
    ...input,
    id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    verified: false,
    status: 'pending',
    helpfulCount: 0,
    createdAt: new Date().toISOString(),
  };
  writeJson(USER_REVIEWS_KEY, [review, ...getUserReviews()]);
  return delay(review);
}

export async function voteHelpful(reviewId: string): Promise<{ helpfulCount: number; voted: boolean }> {
  const source = allReviewsRaw().find((r) => r.id === reviewId);
  if (!source) return delay({ helpfulCount: 0, voted: false });

  const votes = getVotes();
  const deltas = getVoteDeltas();
  const alreadyVoted = Boolean(votes[reviewId]);
  const nextVoted = !alreadyVoted;
  const nextDelta = (deltas[reviewId] ?? 0) + (nextVoted ? 1 : -1);

  writeJson(VOTES_KEY, { ...votes, [reviewId]: nextVoted });
  writeJson(VOTE_DELTA_KEY, { ...deltas, [reviewId]: nextDelta });

  return delay({ helpfulCount: source.helpfulCount + nextDelta, voted: nextVoted });
}

export function hasVotedHelpful(reviewId: string): boolean {
  return Boolean(getVotes()[reviewId]);
}

export async function getMyReviews(email: string): Promise<EntityReview[]> {
  const deltas = getVoteDeltas();
  const reviews = allReviewsRaw()
    .filter((r) => r.author.email.toLowerCase() === email.toLowerCase())
    .map((r) => applyVoteDelta(r, deltas))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return delay(reviews);
}
