import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/language';
import { interests } from '@/data/interests';
import PageShell from '@/components/layout/PageShell';
import RevealItem from '@/components/ui/RevealItem';
import TiltSurface from '@/components/ui/TiltSurface';

export default function DiscoverByInterest() {
  const { t, pick } = useLanguage();

  return (
    <section className="bg-neutral-100 py-10 sm:py-12">
      <PageShell>
        <div className="mb-6 sm:mb-8">
          <h2 className="font-heading text-2xl font-bold text-ink-900 sm:text-3xl">{t.discoverByInterestTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-500 sm:text-base">{t.discoverByInterestSubtitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {interests.map((interest, i) => (
            <RevealItem key={interest.id} index={i}>
              <TiltSurface innerClassName="rounded-card-lg" maxTilt={5}>
                <Link
                  href={`/interests/${interest.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-card-lg shadow-card transition-shadow hover:shadow-lift"
                >
                  <Image
                    src={interest.cardPhoto}
                    alt={pick(interest.name)}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-4 font-heading text-xl font-bold text-white sm:text-2xl">
                    {pick(interest.name)}
                  </span>
                </Link>
              </TiltSurface>
            </RevealItem>
          ))}
        </div>
      </PageShell>
    </section>
  );
}
