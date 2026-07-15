import { useState } from 'react';
import { Users, Minus, Plus } from 'lucide-react';
import { useLanguage } from '@/lib/language';

export type Guests = { adults: number; children: number; rooms: number };

type GuestsSelectorProps = {
  value: Guests;
  onChange: (value: Guests) => void;
  bare?: boolean;
};

function Counter({ label, value, onDecrement, onIncrement, min = 0 }: { label: string; value: number; onDecrement: () => void; onIncrement: () => void; min?: number }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-ink-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={value <= min}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-ink-700 disabled:opacity-30"
        >
          <Minus size={14} />
        </button>
        <span className="w-4 text-center text-sm font-semibold">{value}</span>
        <button type="button" onClick={onIncrement} className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-ink-700">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

export default function GuestsSelector({ value, onChange, bare }: GuestsSelectorProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full min-w-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          bare
            ? 'flex w-full items-center gap-2 bg-transparent text-left text-sm font-semibold text-ink-900'
            : 'flex w-full items-center gap-2 rounded-pill border border-neutral-300 bg-white px-4 py-3 text-left text-sm text-ink-900'
        }
      >
        <Users size={bare ? 16 : 18} className="shrink-0 text-ink-400" />
        <span className="whitespace-nowrap">
          {value.adults + value.children} {t.searchGuests.toLowerCase()} · {value.rooms} {t.searchGuestsRooms.toLowerCase()}
        </span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 w-72 rounded-card bg-white p-4 shadow-lift">
          <Counter label={t.searchGuestsAdults} value={value.adults} min={1} onDecrement={() => onChange({ ...value, adults: Math.max(1, value.adults - 1) })} onIncrement={() => onChange({ ...value, adults: value.adults + 1 })} />
          <Counter label={t.searchGuestsChildren} value={value.children} onDecrement={() => onChange({ ...value, children: Math.max(0, value.children - 1) })} onIncrement={() => onChange({ ...value, children: value.children + 1 })} />
          <Counter label={t.searchGuestsRooms} value={value.rooms} min={1} onDecrement={() => onChange({ ...value, rooms: Math.max(1, value.rooms - 1) })} onIncrement={() => onChange({ ...value, rooms: value.rooms + 1 })} />
          <button type="button" onClick={() => setOpen(false)} className="mt-2 w-full rounded-pill bg-primary-600 py-2 text-sm font-semibold text-white">
            {t.searchGuestsDone}
          </button>
        </div>
      )}
    </div>
  );
}
