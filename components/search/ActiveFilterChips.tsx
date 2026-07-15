import { AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/language';
import { getDestination } from '@/data/destinations';
import { getAmenity } from '@/data/amenities';
import FilterChip from '@/components/ui/FilterChip';
import { formatEtb } from '@/lib/format';
import type { FilterState } from '@/types';

type ActiveFilterChipsProps = {
  filters: FilterState;
  onChange: (next: Partial<FilterState>) => void;
};

export default function ActiveFilterChips({ filters, onChange }: ActiveFilterChipsProps) {
  const { pick } = useLanguage();
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.destination) {
    const dest = getDestination(filters.destination);
    if (dest) chips.push({ key: 'destination', label: dest.name, onRemove: () => onChange({ destination: undefined }) });
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    chips.push({
      key: 'price',
      label: `${formatEtb(filters.minPrice ?? 0)} - ${formatEtb(filters.maxPrice ?? 999999)}`,
      onRemove: () => onChange({ minPrice: undefined, maxPrice: undefined }),
    });
  }
  (filters.stars ?? []).forEach((star) => {
    chips.push({ key: `star-${star}`, label: `${star}★`, onRemove: () => onChange({ stars: (filters.stars ?? []).filter((s) => s !== star) }) });
  });
  if (filters.minGuestRating !== undefined) {
    chips.push({ key: 'rating', label: `${filters.minGuestRating}+`, onRemove: () => onChange({ minGuestRating: undefined }) });
  }
  (filters.amenities ?? []).forEach((id) => {
    const amenity = getAmenity(id);
    if (amenity) chips.push({ key: `amenity-${id}`, label: pick(amenity.label), onRemove: () => onChange({ amenities: (filters.amenities ?? []).filter((a) => a !== id) }) });
  });
  (filters.propertyTypes ?? []).forEach((type) => {
    chips.push({ key: `type-${type}`, label: type, onRemove: () => onChange({ propertyTypes: (filters.propertyTypes ?? []).filter((t) => t !== type) }) });
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence initial={false}>
        {chips.map((chip) => (
          <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}
