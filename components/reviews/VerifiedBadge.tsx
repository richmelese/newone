import { BadgeCheck } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '@/lib/language';

export default function VerifiedBadge({ className }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-pill bg-success-500/10 px-2.5 py-1 text-xs font-semibold text-success-500', className)}>
      <BadgeCheck size={13} />
      {t.verifiedStayLabel}
    </span>
  );
}
