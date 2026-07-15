import Image from 'next/image';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import {
  getInterest,
  getExperiencesForInterest,
  getDestinationsForInterest,
  getHotelsForInterest,
  interests,
} from '@/data/interests';
import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SectionHeader from '@/components/ui/SectionHeader';
import InterestHighlightSections from '@/components/interest/InterestHighlightSections';
import EnjoyLocalFlavor from '@/components/interest/EnjoyLocalFlavor';
import ExperienceCard from '@/components/destination/ExperienceCard';
import HotelCard from '@/components/hotel/HotelCard';
import Reveal from '@/components/ui/Reveal';
import RevealItem from '@/components/ui/RevealItem';
import type { Interest } from '@/types';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: interests.map((interest) => ({ params: { slug: interest.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ interest: Interest }> = async ({ params }) => {
  const interest = getInterest(params?.slug as string);
  if (!interest) return { notFound: true };
  return { props: { interest } };
};

export default function InterestPage({ interest }: { interest: Interest }) {
  const { t, pick } = useLanguage();
  const relatedExperiences = getExperiencesForInterest(interest);
  const relatedDestinations = getDestinationsForInterest(interest);
  const relatedHotels = getHotelsForInterest(interest).slice(0, 6);

  return (
    <Layout
      seo={{
        title: `${pick(interest.name)} — Ethiopia travel guide`,
        description: pick(interest.guide),
        image: interest.heroPhoto,
        path: `/interests/${interest.slug}`,
      }}
    >
      <section className="relative flex min-h-[360px] items-end overflow-hidden sm:min-h-[420px]">
        <Image src={interest.heroPhoto} alt={pick(interest.name)} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-hero-scrim" />
        <PageShell className="relative pb-10 pt-32 text-white">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-300">{t.interestBreadcrumb}</p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">{pick(interest.name)}</h1>
            <p className="mt-2 max-w-2xl text-white/90">{pick(interest.tagline)}</p>
          </Reveal>
        </PageShell>
      </section>

      <PageShell className="py-8">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: t.interestBreadcrumb, href: '/interests' },
            { label: pick(interest.name) },
          ]}
        />

        <Reveal className="mt-6 max-w-3xl">
          <p className="leading-relaxed text-ink-600">{pick(interest.guide)}</p>
        </Reveal>

        <InterestHighlightSections sections={interest.highlightSections} />

        {interest.localFlavor && <EnjoyLocalFlavor section={interest.localFlavor} />}

        {relatedDestinations.length > 0 && (
          <Reveal className="mt-10">
            <SectionHeader title={t.interestDestinations} className="mb-6" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedDestinations.map((destination, i) => (
                <RevealItem key={destination.slug} index={i}>
                  <Link
                    href={`/destinations/${destination.slug}`}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-card-lg shadow-card transition-shadow hover:shadow-lift"
                  >
                    <Image
                      src={destination.cardPhoto}
                      alt={destination.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-xs font-medium text-white/85">{destination.region}</p>
                      <h3 className="mt-0.5 font-heading text-lg font-bold text-white">{destination.name}</h3>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </div>
          </Reveal>
        )}

        {relatedExperiences.length > 0 && (
          <section className="mt-10">
            <Reveal>
              <SectionHeader title={t.interestThingsToDo} className="mb-6" />
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedExperiences.map((experience, i) => (
                <ExperienceCard key={experience.id} experience={experience} revealIndex={i} />
              ))}
            </div>
          </section>
        )}

        {relatedHotels.length > 0 && (
          <section className="mt-10">
            <Reveal>
              <SectionHeader title={t.interestWhereToStay} className="mb-6" />
            </Reveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedHotels.map((hotel, i) => (
                <HotelCard key={hotel.id} hotel={hotel} revealIndex={i} />
              ))}
            </div>
          </section>
        )}
      </PageShell>
    </Layout>
  );
}
