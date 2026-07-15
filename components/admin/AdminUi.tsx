import type { ReactNode } from 'react';
import clsx from 'clsx';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

export function MetricCard({
  label,
  value,
  detail,
  trend,
  icon,
  tone = 'blue',
}: {
  label: string;
  value: string | number;
  detail: string;
  trend?: 'up' | 'down' | 'flat';
  icon: ReactNode;
  tone?: 'blue' | 'orange' | 'green' | 'purple';
}) {
  const tones = {
    blue: 'bg-primary-50 text-primary-700',
    orange: 'bg-accent-50 text-accent-600',
    green: 'bg-success-500/10 text-success-500',
    purple: 'bg-violet-50 text-violet-600',
  };
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;

  return (
    <article className="rounded-card-lg border border-neutral-200 bg-white p-5 shadow-[0_10px_30px_rgba(11,36,54,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink-400">{label}</p>
          <p className="mt-2 font-heading text-3xl font-extrabold text-primary-900">{value}</p>
        </div>
        <span className={clsx('flex h-11 w-11 items-center justify-center rounded-xl', tones[tone])}>{icon}</span>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-ink-400">
        {trend && <TrendIcon size={14} className={trend === 'up' ? 'text-success-500' : trend === 'down' ? 'text-danger-500' : 'text-ink-300'} />}
        {detail}
      </p>
    </article>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={clsx('overflow-hidden rounded-card-lg border border-neutral-200 bg-white shadow-[0_10px_30px_rgba(11,36,54,0.04)]', className)}>{children}</section>;
}

export function PanelHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-5 py-4 sm:px-6">
      <div>
        <h2 className="font-heading text-base font-extrabold text-primary-900">{title}</h2>
        {description && <p className="mt-1 text-xs text-ink-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusPill({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'amber' | 'red' | 'blue' | 'gray' }) {
  const tones = {
    green: 'bg-success-500/10 text-success-500',
    amber: 'bg-amber-500/10 text-amber-500',
    red: 'bg-danger-500/10 text-danger-500',
    blue: 'bg-primary-50 text-primary-700',
    gray: 'bg-neutral-100 text-ink-500',
  };
  return <span className={clsx('inline-flex rounded-pill px-2.5 py-1 text-[11px] font-bold', tones[tone])}>{children}</span>;
}

export function AdminButton({ children, secondary = false, onClick }: { children: ReactNode; secondary?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition active:scale-[0.98]',
        secondary
          ? 'border border-neutral-200 bg-white text-ink-600 hover:border-primary-200 hover:bg-primary-50'
          : 'bg-primary-800 text-white shadow-soft hover:bg-primary-700',
      )}
    >
      {children}
    </button>
  );
}

export function TableEmpty({ message }: { message: string }) {
  return <div className="px-6 py-12 text-center text-sm text-ink-400">{message}</div>;
}
