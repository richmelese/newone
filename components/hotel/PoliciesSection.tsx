import { Coffee, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import type { Hotel } from '@/types';

export default function PoliciesSection({ policies }: { policies: Hotel['policies'] }) {
  const { t, pick } = useLanguage();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-start gap-3 rounded-card-lg bg-neutral-100 p-4">
        <LogIn size={18} className="mt-0.5 shrink-0 text-primary-600" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t.checkInLabel}</p>
          <p className="text-sm font-semibold text-ink-900">{policies.checkIn}</p>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-card-lg bg-neutral-100 p-4">
        <LogOut size={18} className="mt-0.5 shrink-0 text-primary-600" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t.checkOutLabel}</p>
          <p className="text-sm font-semibold text-ink-900">{policies.checkOut}</p>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-card-lg bg-neutral-100 p-4">
        <Coffee size={18} className="mt-0.5 shrink-0 text-primary-600" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t.breakfastTitle}</p>
          <p className="text-sm text-ink-700">{pick(policies.breakfast)}</p>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-card-lg bg-neutral-100 p-4">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary-600" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t.cancellationTitle}</p>
          <p className="text-sm text-ink-700">{pick(policies.cancellation)}</p>
        </div>
      </div>
    </div>
  );
}
