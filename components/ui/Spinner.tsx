import clsx from 'clsx';

export default function Spinner({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={clsx('inline-block animate-spin rounded-full border-solid border-primary-600 border-t-transparent', className)}
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 10) }}
    />
  );
}
