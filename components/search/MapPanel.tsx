import { useState } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import clsx from 'clsx';
import { formatEtb } from '@/lib/format';

export type MapPoint = {
  id: string;
  x: number;
  y: number;
  label: string;
  price?: number;
  href?: string;
};

type MapPanelProps = {
  points: MapPoint[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  heightClassName?: string;
};

export default function MapPanel({ points, activeId, onSelect, className, heightClassName = 'h-full min-h-[420px]' }: MapPanelProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className={clsx(
        'relative w-full overflow-hidden rounded-card-lg border border-neutral-200 bg-primary-50',
        heightClassName,
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(rgba(15,118,110,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,0.06) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
      role="img"
      aria-label="Stylized map showing hotel locations"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-100/40 via-transparent to-accent-100/30" />

      {points.length > 6 && (
        <div className="absolute right-4 top-4 flex h-9 items-center justify-center rounded-pill bg-ink-900 px-3 text-xs font-bold text-white shadow-lift">
          +{points.length} nearby
        </div>
      )}

      {points.map((point) => {
        const active = point.id === activeId || point.id === hoveredId;
        const pin = (
          <>
            {active && point.price !== undefined && (
              <span className="mb-1 block whitespace-nowrap rounded-pill bg-ink-900 px-2.5 py-1 text-center text-xs font-bold text-white shadow-lift">
                {formatEtb(point.price)}
              </span>
            )}
            <MapPin
              size={active ? 32 : 26}
              className={clsx('drop-shadow-lift transition-all', active ? 'text-accent-500' : 'text-primary-600')}
              fill="currentColor"
              strokeWidth={1}
              stroke="white"
            />
          </>
        );
        const sharedProps = {
          onMouseEnter: () => setHoveredId(point.id),
          onMouseLeave: () => setHoveredId(null),
          onClick: () => onSelect?.(point.id),
          className: 'absolute -translate-x-1/2 -translate-y-full cursor-pointer',
          style: { left: `${point.x}%`, top: `${point.y}%` },
        };
        return point.href ? (
          <Link key={point.id} href={point.href} {...sharedProps}>
            {pin}
          </Link>
        ) : (
          <button key={point.id} type="button" {...sharedProps}>
            {pin}
          </button>
        );
      })}
    </div>
  );
}
