import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Check, CircleAlert, Tag } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { formatEtb } from '@/lib/format';
import { getBookingOptions, type BookingOption } from '@/lib/bookingOptions';
import Reveal from '@/components/ui/Reveal';
import GuestsSelector, { type Guests } from '@/components/search/GuestsSelector';
import type { Hotel } from '@/types';

type RoomAvailabilityTableProps = {
  hotel: Hotel;
};

const brandTextClass: Record<BookingOption['id'], string> = {
  official: 'text-primary-700',
  booking: 'text-[#003580]',
  tripadvisor: 'text-[#00AF87]',
};

export default function RoomAvailabilityTable({ hotel }: RoomAvailabilityTableProps) {
  const { t } = useLanguage();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState<Guests>({ adults: 2, children: 0, rooms: 1 });

  const datesSelected = Boolean(checkIn && checkOut);
  const options = getBookingOptions(hotel, t);

  const perksById: Record<BookingOption['id'], string[]> = {
    official: [t.bookDirectLabel, t.perkBestPrice],
    booking: [t.perkFullyRefundable, t.perkNoPrepayment],
    tripadvisor: [t.perkCompareMore],
  };

  const lowestPrice = Math.min(
    ...options.filter((o) => o.priceEtb !== undefined).map((o) => o.priceEtb as number),
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-bold text-ink-900">{t.availabilityTitle}</h2>
        <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-700">
          <Tag size={15} />
          {t.priceMatchLabel}
        </span>
      </div>

      {!datesSelected && (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-danger-500">
          <CircleAlert size={15} className="shrink-0" />
          {t.selectDatesAlert}
        </p>
      )}

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 rounded-card-lg border border-neutral-200 bg-white px-4 py-2.5 focus-within:border-primary-500">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{t.checkInLabel}</span>
          <span className="flex items-center gap-2">
            <Calendar size={16} className="shrink-0 text-ink-400" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              aria-label={t.searchCheckIn}
              className="w-full min-w-0 bg-transparent text-sm font-semibold text-ink-900 outline-none"
            />
          </span>
        </label>

        <label className="flex flex-col gap-1 rounded-card-lg border border-neutral-200 bg-white px-4 py-2.5 focus-within:border-primary-500">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{t.checkOutLabel}</span>
          <span className="flex items-center gap-2">
            <Calendar size={16} className="shrink-0 text-ink-400" />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              aria-label={t.searchCheckOut}
              className="w-full min-w-0 bg-transparent text-sm font-semibold text-ink-900 outline-none"
            />
          </span>
        </label>

        <div className="flex flex-col gap-1 rounded-card-lg border border-neutral-200 bg-white px-4 py-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{t.searchGuests}</span>
          <GuestsSelector value={guests} onChange={setGuests} bare />
        </div>
      </div>

      <Reveal className="mt-4 divide-y divide-neutral-200 overflow-hidden rounded-card-lg border border-neutral-200 bg-white">
        {options.map((option) => {
          const isBest = option.priceEtb !== undefined && option.priceEtb === lowestPrice;
          const content = (
            <>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`text-base font-bold ${brandTextClass[option.id]}`}>{option.name}</p>
                  {isBest && (
                    <span className="rounded-pill bg-success-50 px-2 py-0.5 text-[11px] font-semibold text-success-600">
                      {t.bestDealBadge}
                    </span>
                  )}
                </div>
                <ul className="mt-1.5 flex flex-col gap-1">
                  {perksById[option.id].map((perk) => (
                    <li key={perk} className="flex items-center gap-1.5 text-xs text-ink-500">
                      <Check size={13} className="shrink-0 text-success-500" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                {option.priceEtb !== undefined && (
                  <p className="whitespace-nowrap font-heading text-lg font-bold text-ink-900">
                    {formatEtb(option.priceEtb)}
                    <span className="ml-1 text-xs font-normal text-ink-400">{t.perNight}</span>
                  </p>
                )}
                <span
                  className={`inline-flex items-center justify-center gap-1.5 rounded-pill px-5 py-2.5 text-sm font-semibold transition-all duration-150 ease-out ${
                    isBest
                      ? 'bg-accent-500 text-white shadow-cta hover:bg-accent-600'
                      : 'border border-neutral-300 text-ink-800 hover:bg-neutral-100'
                  }`}
                >
                  {t.viewDealLabel}
                  <ArrowRight size={14} />
                </span>
              </div>
            </>
          );

          const rowClasses = 'flex flex-col gap-3 p-4 transition-colors hover:bg-primary-50/40 sm:flex-row sm:items-center sm:justify-between';

          return option.external ? (
            <a key={option.id} href={option.href} target="_blank" rel="noopener noreferrer" className={rowClasses}>
              {content}
            </a>
          ) : (
            <Link key={option.id} href={option.href} className={rowClasses}>
              {content}
            </Link>
          );
        })}
      </Reveal>
    </div>
  );
}
