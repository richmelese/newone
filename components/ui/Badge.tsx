import clsx from 'clsx';
import { Crown, Sparkle, Star } from 'lucide-react';
import type { Badge as BadgeType } from '@/types';

const config: Record<BadgeType, { icon: typeof Crown; classes: string }> = {
  premium: { icon: Crown, classes: 'bg-ink-900 text-white' },
  featured: { icon: Star, classes: 'bg-accent-500 text-white' },
  new: { icon: Sparkle, classes: 'bg-accent-600 text-white' },
};

type BadgeProps = {
  kind: BadgeType;
  label: string;
  className?: string;
};

export default function Badge({ kind, label, className }: BadgeProps) {
  const { icon: Icon, classes } = config[kind];
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-xs font-semibold shadow-soft', classes, className)}>
      <Icon size={12} fill="currentColor" strokeWidth={0} />
      {label}
    </span>
  );
}
