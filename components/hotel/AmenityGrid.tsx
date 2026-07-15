import { useLanguage } from '@/lib/language';
import { getAmenity } from '@/data/amenities';
import { getAmenityIcon } from '@/lib/amenityIcons';

export default function AmenityGrid({ amenityIds }: { amenityIds: string[] }) {
  const { pick } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {amenityIds.map((id) => {
        const amenity = getAmenity(id);
        if (!amenity) return null;
        const Icon = getAmenityIcon(amenity.icon);
        return (
          <div key={id} className="flex items-center gap-2.5 rounded-lg bg-neutral-100 px-3 py-2.5 text-sm text-ink-700">
            <Icon size={17} className="shrink-0 text-primary-600" />
            {pick(amenity.label)}
          </div>
        );
      })}
    </div>
  );
}
