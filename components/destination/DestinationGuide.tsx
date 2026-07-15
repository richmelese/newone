import Image from 'next/image';
import clsx from 'clsx';
import { useLanguage } from '@/lib/language';
import Reveal from '@/components/ui/Reveal';
import RevealImage from '@/components/ui/RevealImage';
import RevealItem from '@/components/ui/RevealItem';
import type { Destination, DestinationGuide as DestinationGuideData } from '@/types';

type DestinationGuideProps = {
  destination: Destination;
  guide: DestinationGuideData;
};

export default function DestinationGuide({ destination, guide }: DestinationGuideProps) {
  const { t, pick } = useLanguage();

  return (
    <div className="space-y-12 sm:space-y-16">
      <Reveal className="max-w-3xl">
        <p className="text-lg leading-relaxed text-ink-600">{pick(destination.guide)}</p>
        <p className="mt-3 text-sm font-semibold text-primary-700">
          {t.bestTimeToVisit}: {pick(destination.bestTime)}
        </p>
      </Reveal>

      {guide.sections.map((section, i) => {
        const imageRight = i % 2 === 1;
        return (
          <RevealItem key={section.title.en} index={i}>
            <div
              className={clsx(
                'grid items-center gap-6 lg:grid-cols-2 lg:gap-10',
                imageRight && 'lg:[&>div:first-child]:order-2',
              )}
            >
              <RevealImage className="relative aspect-[4/3] overflow-hidden rounded-card-lg shadow-card">
                <Image
                  src={section.photo}
                  alt={pick(section.title)}
                  fill
                  unoptimized={section.photo.includes('commons.wikimedia.org')}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </RevealImage>
              <div>
                <h2 className="font-heading text-xl font-bold text-ink-900 sm:text-2xl">{pick(section.title)}</h2>
                <p className="mt-3 leading-relaxed text-ink-600">{pick(section.body)}</p>
              </div>
            </div>
          </RevealItem>
        );
      })}

      {guide.gallery.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {guide.gallery.map((photo, i) => (
            <RevealImage
              key={photo}
              index={i}
              className={clsx(
                'relative overflow-hidden rounded-card-lg shadow-soft',
                i === 0 && 'col-span-2 aspect-[16/10] sm:row-span-2 sm:aspect-auto sm:min-h-full',
                i > 0 && 'aspect-[4/3]',
              )}
            >
              <Image
                src={photo}
                alt=""
                fill
                unoptimized={photo.includes('commons.wikimedia.org')}
                sizes={i === 0 ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 50vw, 25vw'}
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </RevealImage>
          ))}
        </div>
      )}
    </div>
  );
}
