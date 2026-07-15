import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { getAmenity, isRoomCategoryId } from '@/data/amenities';
import { getAmenityIcon } from '@/lib/amenityIcons';
import Reveal from '@/components/ui/Reveal';
import type { Hotel } from '@/types';

const VISIBLE_COUNT = 8;

type AmenityListProps = {
  title: string;
  ids: string[];
  showToggle?: boolean;
};

function AmenityList({ title, ids, showToggle = true }: AmenityListProps) {
  const { t, pick } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? ids : ids.slice(0, VISIBLE_COUNT);
  const hasMore = showToggle && ids.length > VISIBLE_COUNT;

  if (ids.length === 0) return null;

  return (
    <div className="border-b border-neutral-200 py-8 last:border-b-0">
      <h3 className="font-heading text-lg font-bold text-primary-700">{title}</h3>
      <ul className="mt-5 grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
        {visible.map((id) => {
          const amenity = getAmenity(id);
          if (!amenity) return null;
          const Icon = getAmenityIcon(amenity.icon);
          return (
            <li key={id} className="flex items-center gap-2.5 text-sm text-ink-600">
              <Icon size={18} className="shrink-0 text-ink-500" strokeWidth={1.75} />
              {pick(amenity.label)}
            </li>
          );
        })}
      </ul>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:text-primary-800"
        >
          {expanded ? t.showLess : t.showMore}
          <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
}

function getRoomCategoryIds(hotel: Hotel): string[] {
  const ids: string[] = ['non-smoking'];
  const names = hotel.roomTypes.map((room) => room.name.en.toLowerCase());
  const features = new Set(hotel.roomTypes.flatMap((room) => room.featureIds));

  if (features.has('family') || names.some((name) => name.includes('family'))) {
    ids.push('family');
  }
  if (names.some((name) => name.includes('suite'))) {
    ids.push('suites');
  }
  if (hotel.amenityIds.includes('smoking')) {
    ids.push('smoking');
  }

  return ids;
}

export default function HotelAmenitySections({ hotel }: { hotel: Hotel }) {
  const { t } = useLanguage();

  const propertyAmenityIds = hotel.amenityIds.filter((id) => !isRoomCategoryId(id));

  const roomFeatureIds = [
    ...new Set(
      hotel.roomTypes
        .flatMap((room) => room.featureIds)
        .filter((id) => !hotel.amenityIds.includes(id) && !isRoomCategoryId(id)),
    ),
  ];

  const roomCategoryIds = getRoomCategoryIds(hotel);

  return (
    <Reveal>
      <section className="rounded-card-lg border border-neutral-200 bg-white px-5 sm:px-6">
        <AmenityList title={t.propertyAmenities} ids={propertyAmenityIds} />
        <AmenityList title={t.roomFeatures} ids={roomFeatureIds} />
        <AmenityList title={t.hotelRoomTypes} ids={roomCategoryIds} showToggle={false} />
      </section>
    </Reveal>
  );
}
