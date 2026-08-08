import { Briefcase, Heart, PartyPopper, User, Users } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '@/lib/language';
import { TRIP_TYPES, TRIP_TYPE_LABELS } from '@/data/serviceConfig';
import type { TripType } from '@/types';

const TRIP_TYPE_ICONS: Record<TripType, typeof User> = {
  solo: User,
  couple: Heart,
  family: Users,
  friends: PartyPopper,
  business: Briefcase,
};

type TripTypeChipsProps =
  | { mode: 'select'; value: TripType | null; onChange: (value: TripType) => void; className?: string }
  | { mode: 'display'; value: TripType; className?: string };

export default function TripTypeChips(props: TripTypeChipsProps) {
  const { pick } = useLanguage();

  if (props.mode === 'display') {
    const Icon = TRIP_TYPE_ICONS[props.value];
    return (
      <span className={clsx('inline-flex items-center gap-1 rounded-pill bg-neutral-100 px-2.5 py-1 text-xs font-medium text-ink-600', props.className)}>
        <Icon size={12} />
        {pick(TRIP_TYPE_LABELS[props.value])}
      </span>
    );
  }

  return (
    <div className={clsx('flex flex-wrap gap-2', props.className)} role="radiogroup" aria-label="Trip type">
      {TRIP_TYPES.map((tripType) => {
        const Icon = TRIP_TYPE_ICONS[tripType];
        const active = props.value === tripType;
        return (
          <button
            key={tripType}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => props.onChange(tripType)}
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-pill border px-3.5 py-2 text-sm font-medium transition-colors',
              active
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-neutral-300 bg-white text-ink-700 hover:border-primary-400 hover:text-primary-700',
            )}
          >
            <Icon size={14} />
            {pick(TRIP_TYPE_LABELS[tripType])}
          </button>
        );
      })}
    </div>
  );
}
