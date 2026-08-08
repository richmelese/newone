import { useLanguage } from '@/lib/language';
import { TRIP_TYPES, TRIP_TYPE_LABELS } from '@/data/serviceConfig';
import MobileFilterSheet from '@/components/search/MobileFilterSheet';
import type { TripType } from '@/types';

export type ReviewSort = 'newest' | 'highest' | 'lowest' | 'helpful';
export type ReviewLanguageFilter = 'all' | 'en' | 'am';

export type ReviewFilterState = {
  sort: ReviewSort;
  verifiedOnly: boolean;
  tripType: TripType | 'all';
  language: ReviewLanguageFilter;
};

export const DEFAULT_REVIEW_FILTERS: ReviewFilterState = {
  sort: 'newest',
  verifiedOnly: false,
  tripType: 'all',
  language: 'all',
};

type ReviewFiltersProps = {
  value: ReviewFilterState;
  onChange: (value: ReviewFilterState) => void;
};

function FilterControls({ value, onChange }: ReviewFiltersProps) {
  const { t, pick } = useLanguage();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 text-sm">
        <span className="hidden font-medium text-ink-500 sm:inline">{t.sortLabel}</span>
        <select
          value={value.sort}
          onChange={(e) => onChange({ ...value, sort: e.target.value as ReviewSort })}
          className="rounded-pill border border-neutral-300 bg-white px-3.5 py-2 text-sm font-semibold text-ink-800 outline-none focus:border-primary-500"
        >
          <option value="newest">{t.reviewSortNewest}</option>
          <option value="highest">{t.reviewSortHighest}</option>
          <option value="lowest">{t.reviewSortLowest}</option>
          <option value="helpful">{t.reviewSortHelpful}</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <select
          value={value.tripType}
          onChange={(e) => onChange({ ...value, tripType: e.target.value as TripType | 'all' })}
          className="rounded-pill border border-neutral-300 bg-white px-3.5 py-2 text-sm font-semibold text-ink-800 outline-none focus:border-primary-500"
        >
          <option value="all">{t.allTripTypes}</option>
          {TRIP_TYPES.map((tt) => (
            <option key={tt} value={tt}>
              {pick(TRIP_TYPE_LABELS[tt])}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <select
          value={value.language}
          onChange={(e) => onChange({ ...value, language: e.target.value as ReviewLanguageFilter })}
          className="rounded-pill border border-neutral-300 bg-white px-3.5 py-2 text-sm font-semibold text-ink-800 outline-none focus:border-primary-500"
        >
          <option value="all">{t.allLanguages}</option>
          <option value="en">English</option>
          <option value="am">አማርኛ</option>
        </select>
      </label>

      <button
        type="button"
        onClick={() => onChange({ ...value, verifiedOnly: !value.verifiedOnly })}
        aria-pressed={value.verifiedOnly}
        className={`rounded-pill border px-3.5 py-2 text-sm font-semibold transition-colors ${
          value.verifiedOnly
            ? 'border-primary-600 bg-primary-600 text-white'
            : 'border-neutral-300 bg-white text-ink-700 hover:border-primary-400 hover:text-primary-700'
        }`}
      >
        {t.verifiedOnlyLabel}
      </button>
    </div>
  );
}

export default function ReviewFilters({ value, onChange }: ReviewFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden lg:flex">
        <FilterControls value={value} onChange={onChange} />
      </div>
      <div className="lg:hidden">
        <MobileFilterSheet>
          <FilterControls value={value} onChange={onChange} />
        </MobileFilterSheet>
      </div>
    </div>
  );
}
