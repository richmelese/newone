import clsx from 'clsx';

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('animate-pulse rounded-md bg-neutral-200', className)} />;
}

export function SkeletonHotelCard({ variant = 'compact' }: { variant?: 'compact' | 'detailed' }) {
  const detailed = variant === 'detailed';
  return (
    <div className="overflow-hidden rounded-card-lg bg-white shadow-card">
      <Skeleton className="aspect-[6/5] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        {detailed && <Skeleton className="h-4 w-2/5" />}
        <Skeleton className="h-4 w-1/2" />
        {detailed && (
          <div className="flex gap-1.5 pt-1">
            <Skeleton className="h-5 w-16 rounded-pill" />
            <Skeleton className="h-5 w-20 rounded-pill" />
            <Skeleton className="h-5 w-14 rounded-pill" />
          </div>
        )}
      </div>
    </div>
  );
}
