import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import RevealItem from '@/components/ui/RevealItem';
import TiltSurface from '@/components/ui/TiltSurface';
import { resolveApiAssetUrl, type City } from '@/lib/api';
import { useLanguage } from '@/lib/language';

export default function DestinationFeaturedCard({
  destination,
  badge,
  featured = false,
  revealIndex = 0,
  className,
}: {
  destination: City;
  badge: string;
  featured?: boolean;
  revealIndex?: number;
  className?: string;
}) {
  const { language } = useLanguage();
  const name = language === 'am' ? destination.name_am : destination.name_en;
  const image = resolveApiAssetUrl(destination.hero_image);
  const targetId = destination.id ?? destination._id;

  return (
    <RevealItem index={revealIndex} className={`h-full ${className ?? ''}`}>
      <TiltSurface className="h-full" innerClassName="h-full rounded-[1.25rem]" maxTilt={featured ? 4.5 : 6}>
        <Link
          href={`/destinations/${encodeURIComponent(String(targetId ?? destination.name_en))}`}
          className={`group relative block h-full w-full rounded-[1.25rem] shadow-card [transform-style:preserve-3d] ${
            featured ? 'min-h-[340px]' : 'min-h-[200px]'
          }`}
        >
          <span className="absolute inset-0 overflow-hidden rounded-[1.25rem]">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                unoptimized
                sizes={featured ? '(max-width: 1024px) 100vw, 33vw' : '(max-width: 1024px) 50vw, 25vw'}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <span className="flex h-full items-center justify-center bg-primary-100 text-primary-300"><ImageIcon size={42} /></span>
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />
          </span>
          <span className="depth-layer absolute left-4 top-4 rounded-md bg-accent-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md sm:text-xs">
            {badge}
          </span>
          <div className="depth-layer-lg absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <h3 className={`font-heading font-bold text-white ${featured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              {name}
            </h3>
          </div>
        </Link>
      </TiltSurface>
    </RevealItem>
  );
}
