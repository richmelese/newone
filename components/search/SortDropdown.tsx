import { useLanguage } from '@/lib/language';
import type { SortOption } from '@/types';

type SortDropdownProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const { t } = useLanguage();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden font-medium text-ink-500 sm:inline">{t.sortLabel}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="rounded-pill border border-neutral-300 bg-white px-3.5 py-2 text-sm font-semibold text-ink-800 outline-none focus:border-primary-500"
      >
        <option value="recommended">{t.sortRecommended}</option>
        <option value="rating">{t.sortRating}</option>
        <option value="price-asc">{t.sortPriceAsc}</option>
        <option value="price-desc">{t.sortPriceDesc}</option>
      </select>
    </label>
  );
}
