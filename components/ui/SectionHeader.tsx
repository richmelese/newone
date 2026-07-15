import type { ReactNode } from 'react';
import TwoToneHeading from '@/components/ui/TwoToneHeading';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
};

export default function SectionHeader({ eyebrow, title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className ?? ''}`}>
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-600">{eyebrow}</p>}
        <h2 className="font-heading text-2xl font-bold text-ink-900 sm:text-3xl">
          <TwoToneHeading text={title} />
        </h2>
        {subtitle && <p className="mt-1.5 max-w-2xl text-ink-500">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
