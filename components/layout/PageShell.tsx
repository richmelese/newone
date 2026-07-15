import type { ReactNode } from 'react';
import clsx from 'clsx';

export default function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}
