import { useLanguage } from '@/lib/language';
import { amenities } from '@/data/amenities';
import { destinations } from '@/data/destinations';
import PriceRangeSlider from './PriceRangeSlider';
import RatingStars from '@/components/ui/RatingStars';
import { getAmenityIcon } from '@/lib/amenityIcons';
import type { FilterState, PropertyType } from '@/types';

const PROPERTY_TYPES: { type: PropertyType; key: string }[] = [
  { type: 'Hotel', key: 'categoryHotel' },
  { type: 'Resort', key: 'categoryResort' },
  { type: 'Lodge', key: 'categoryLodge' },
  { type: 'Guesthouse', key: 'categoryGuesthouse' },
  { type: 'Boutique', key: 'categoryBoutique' },
];

const PRICE_MIN = 2000;
const PRICE_MAX = 16000;
const TRAVELER_RATINGS = [4.5, 4, 3.5];

type FilterSidebarProps = {
  filters: FilterState;
  onChange: (next: Partial<FilterState>) => void;
};

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const { t, pick } = useLanguage();

  const toggleInArray = (key: 'stars' | 'amenities' | 'propertyTypes', value: string | number) => {
    const current = (filters[key] as (string | number)[] | undefined) ?? [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ [key]: next } as Partial<FilterState>);
  };

  return (
    <aside className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-ink-900">{t.filtersTitle}</h2>
        <button type="button" onClick={() => onChange({ minPrice: undefined, maxPrice: undefined, stars: [], amenities: [], propertyTypes: [], minGuestRating: undefined, destination: undefined })} className="text-sm font-semibold text-primary-700 hover:underline">
          {t.filterClearAll}
        </button>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-ink-800">{t.filterPrice}</h3>
        <PriceRangeSlider
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={[filters.minPrice ?? PRICE_MIN, filters.maxPrice ?? PRICE_MAX]}
          onChange={([lo, hi]) => onChange({ minPrice: lo, maxPrice: hi })}
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-ink-800">{t.filterStarRating}</h3>
        <div className="space-y-2">
          {[5, 4, 3].map((star) => (
            <label key={star} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={(filters.stars ?? []).includes(star)}
                onChange={() => toggleInArray('stars', star)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <RatingStars rating={star} size={14} />
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-ink-800">{t.filterTravelerRating}</h3>
        <div className="flex flex-wrap gap-2">
          {TRAVELER_RATINGS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onChange({ minGuestRating: filters.minGuestRating === r ? undefined : r })}
              className={`rounded-pill border px-3 py-1.5 text-sm font-semibold transition-colors ${
                filters.minGuestRating === r ? 'border-primary-600 bg-primary-600 text-white' : 'border-neutral-300 text-ink-700 hover:border-primary-400'
              }`}
            >
              {r}+
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-ink-800">{t.filterArea}</h3>
        <select
          value={filters.destination ?? ''}
          onChange={(e) => onChange({ destination: e.target.value || undefined })}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-ink-800 outline-none focus:border-primary-500"
        >
          <option value="">{t.filterAnyArea}</option>
          {destinations.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-ink-800">{t.filterPropertyType}</h3>
        <div className="space-y-2">
          {PROPERTY_TYPES.map(({ type, key }) => (
            <label key={type} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
              <input
                type="checkbox"
                checked={(filters.propertyTypes ?? []).includes(type)}
                onChange={() => toggleInArray('propertyTypes', type)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              {t[key as keyof typeof t]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold text-ink-800">{t.filterAmenities}</h3>
        <div className="space-y-2">
          {amenities.slice(0, 10).map((amenity) => {
            const Icon = getAmenityIcon(amenity.icon);
            return (
              <label key={amenity.id} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
                <input
                  type="checkbox"
                  checked={(filters.amenities ?? []).includes(amenity.id)}
                  onChange={() => toggleInArray('amenities', amenity.id)}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <Icon size={14} className="text-ink-400" />
                {pick(amenity.label)}
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
