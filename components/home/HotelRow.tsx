import type { ReactNode } from 'react';
import type { Hotel } from '@/types';
import SectionHeader from '@/components/ui/SectionHeader';
import Carousel from '@/components/ui/Carousel';
import HotelCard from '@/components/hotel/HotelCard';
import PageShell from '@/components/layout/PageShell';

type HotelRowProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  hotels: Hotel[];
  action?: ReactNode;
  autoPlay?: boolean;
  showFeaturedBadge?: boolean;
};

export default function HotelRow({ eyebrow, title, subtitle, hotels, action, autoPlay = false, showFeaturedBadge = false }: HotelRowProps) {
  if (hotels.length === 0) return null;

  return (
    <section className="py-10 sm:py-12">
      <PageShell>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} action={action} className="mb-6" />
        <Carousel autoPlay={autoPlay}>
          {hotels.map((hotel, i) => (
            <div
              key={hotel.id}
              className="w-[78%] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] xl:w-[calc(25%-0.75rem)]"
            >
              <HotelCard hotel={hotel} variant="detailed" showFeaturedBadge={showFeaturedBadge} revealIndex={i} />
            </div>
          ))}
        </Carousel>
      </PageShell>
    </section>
  );
}
