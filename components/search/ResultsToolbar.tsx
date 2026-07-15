import { List, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import SortDropdown from './SortDropdown';
import type { SortOption } from '@/types';

type ResultsToolbarProps = {
  count: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  view: 'list' | 'grid';
  onViewChange: (view: 'list' | 'grid') => void;
};

export default function ResultsToolbar({ count, sort, onSortChange, view, onViewChange }: ResultsToolbarProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-semibold text-ink-800">
        {count.toLocaleString()} {t.resultsFound}
      </p>
      <div className="flex items-center gap-3">
        <SortDropdown value={sort} onChange={onSortChange} />
        <div className="flex rounded-pill border border-neutral-300 p-0.5">
          <button
            type="button"
            onClick={() => onViewChange('list')}
            className={`flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-sm font-semibold transition-colors ${view === 'list' ? 'bg-primary-600 text-white' : 'text-ink-600'}`}
          >
            <List size={15} /> {t.viewList}
          </button>
          <button
            type="button"
            onClick={() => onViewChange('grid')}
            className={`flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-sm font-semibold transition-colors ${view === 'grid' ? 'bg-primary-600 text-white' : 'text-ink-600'}`}
          >
            <LayoutGrid size={15} /> {t.viewGrid}
          </button>
        </div>
      </div>
    </div>
  );
}
