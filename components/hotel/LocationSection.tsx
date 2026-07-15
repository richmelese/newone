import Image from 'next/image';
import { useLanguage } from '@/lib/language';
import { getExperiencesByDestination } from '@/data/experiences';
import MapPanel, { type MapPoint } from '@/components/search/MapPanel';
import type { Hotel } from '@/types';

export default function LocationSection({ hotel }: { hotel: Hotel }) {
  const { t, pick } = useLanguage();
  const nearby = getExperiencesByDestination(hotel.destinationSlug).slice(0, 4);

  const points: MapPoint[] = [
    { id: hotel.id, x: hotel.coords.x, y: hotel.coords.y, label: hotel.name },
    ...nearby.map((exp, i) => ({ id: exp.id, x: hotel.coords.x + (i % 2 === 0 ? 8 : -8), y: hotel.coords.y + (i < 2 ? -8 : 8), label: pick(exp.name) })),
  ];

  return (
    <div>
      <MapPanel points={points} activeId={hotel.id} heightClassName="h-72" />
      {nearby.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-3 font-heading text-sm font-bold text-ink-800">{t.nearbyAttractions}</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {nearby.map((exp) => (
              <div key={exp.id} className="overflow-hidden rounded-card bg-neutral-100">
                <div className="relative aspect-square w-full">
                  <Image src={exp.photo} alt={pick(exp.name)} fill sizes="150px" className="object-cover" />
                </div>
                <p className="p-2 text-xs font-semibold text-ink-700">{pick(exp.name)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
