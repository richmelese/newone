import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/language';
import RevealItem from '@/components/ui/RevealItem';
import TiltSurface from '@/components/ui/TiltSurface';
import type { Destination } from '@/types';

export default function DestinationCard({
  destination,
  className,
  revealIndex = 0,
}: {
  destination: Destination;
  className?: string;
  revealIndex?: number;
}) {
  const { pick } = useLanguage();

  return (
    <RevealItem index={revealIndex} className={`block w-full ${className ?? ''}`}>
      <TiltSurface className="w-full" innerClassName="rounded-card-lg" maxTilt={5}>
        <Link
          href={`/destinations/${destination.slug}`}
          className="group relative block aspect-[3/4] w-full overflow-hidden rounded-card-lg shadow-card transition-shadow hover:shadow-lift"
        >
          <Image
            src={destination.cardPhoto}
            alt={destination.name}
            fill
            unoptimized={destination.cardPhoto.includes('commons.wikimedia.org')}
            sizes="(max-width: 640px) 45vw, 256px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-hero-scrim" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <h3 className="font-heading text-lg font-bold">{destination.name}</h3>
            <p className="text-sm text-white/85">{pick(destination.tagline)}</p>
          </div>
        </Link>
      </TiltSurface>
    </RevealItem>
  );
}
