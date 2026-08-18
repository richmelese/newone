import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Sparkles, Compass } from 'lucide-react';
import { citiesApi, resolveApiAssetUrl, type City, type ThingsToDo } from '@/lib/api';
import { destinations, getDestination } from '@/data/destinations';
import { getDestinationGuide } from '@/data/destinationGuides';
import { getHotelsByDestination } from '@/data/hotels';
import { getExperiencesByDestination } from '@/data/experiences';
import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SectionHeader from '@/components/ui/SectionHeader';
import HotelCard from '@/components/hotel/HotelCard';
import DestinationGreatFor from '@/components/destination/DestinationGreatFor';
import Reveal from '@/components/ui/Reveal';
import DestinationGuide from '@/components/destination/DestinationGuide';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function DestinationDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const targetIdOrSlug = typeof slug === 'string' ? slug : undefined;

  const { t, pick, language } = useLanguage();
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const localDestination = useMemo(() => {
    if (!targetIdOrSlug) return null;
    return getDestination(targetIdOrSlug) ?? destinations.find((d) => d.slug === slugify(targetIdOrSlug));
  }, [targetIdOrSlug]);

  const loadCityData = useCallback(async () => {
    if (!targetIdOrSlug) return;
    setLoading(true);
    setError('');

    try {
      const fetchedCity = await citiesApi.getById(targetIdOrSlug);
      setCity(fetchedCity);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load city details.');
      setCity(null);
    } finally {
      setLoading(false);
    }
  }, [targetIdOrSlug]);

  useEffect(() => {
    if (router.isReady) {
      void loadCityData();
    }
  }, [router.isReady, loadCityData]);

  if (!router.isReady || loading) {
    return (
      <Layout seo={{ title: 'Loading...', description: 'Loading city details' }}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (!city && !localDestination) {
    return (
      <Layout seo={{ title: 'Destination Not Found', description: 'The requested destination could not be found.' }}>
        <PageShell className="py-12">
          <ErrorState
            title="Destination not found"
            subtitle={error || "We couldn't find the city or destination you're looking for."}
            retryLabel="Browse destinations"
            onRetry={() => void router.push('/destinations')}
          />
        </PageShell>
      </Layout>
    );
  }

  // Derive display values from API city or local destination fallback
  const cityName = city
    ? language === 'am'
      ? city.name_am
      : city.name_en
    : localDestination?.name ?? '';

  const cityDescription = city
    ? language === 'am'
      ? city.description_am
      : city.description_en
    : localDestination
    ? pick(localDestination.guide)
    : '';

  const heroPhoto = city?.hero_image
    ? resolveApiAssetUrl(city.hero_image)
    : localDestination?.heroPhoto ?? '';

  const destinationSlug = localDestination?.slug ?? (city ? slugify(city.name_en) : '');
  const hotels = getHotelsByDestination(destinationSlug);
  const experiences = getExperiencesByDestination(destinationSlug);
  const guide = localDestination ? getDestinationGuide(localDestination.slug) : null;

  // Extract gallery images directly from API city
  const galleryImages: string[] = [];
  if (city?.galleries && Array.isArray(city.galleries)) {
    city.galleries.forEach((gal) => {
      if (Array.isArray(gal.images)) {
        gal.images.forEach((img) => {
          const url = typeof img === 'string' ? img : img?.url || img?.path;
          if (url) galleryImages.push(resolveApiAssetUrl(url));
        });
      }
    });
  }

  const thingsToDo: ThingsToDo[] = city?.things_to_do && Array.isArray(city.things_to_do) ? city.things_to_do : [];
  const categorySections = (city?.categories ?? []).filter((category) => typeof category !== 'string');

  return (
    <Layout
      seo={{
        title: cityName ? `Explore ${cityName}` : 'Destination',
        description: cityDescription.slice(0, 160),
        image: heroPhoto || undefined,
        path: `/destinations/${targetIdOrSlug}`,
      }}
    >
      {/* Hero Section */}
      <section className="relative flex min-h-[380px] items-end overflow-hidden sm:min-h-[440px]">
        {heroPhoto ? (
          <Image
            src={heroPhoto}
            alt={cityName}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-primary-900" />
        )}
        <div className="absolute inset-0 bg-hero-scrim" />
        <PageShell className="relative pb-10 pt-32 text-white">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-widest text-accent-300">
                {localDestination?.region || 'Ethiopia'}
              </span>
              {city?.is_iconic && (
                <span className="inline-flex items-center gap-1 rounded-pill bg-accent-500/90 px-2.5 py-0.5 text-xs font-bold uppercase text-white shadow-sm">
                  <Sparkles size={12} /> Iconic
                </span>
              )}
            </div>
            <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">{cityName}</h1>
            <p className="mt-2 max-w-2xl leading-relaxed text-white/90">{cityDescription}</p>
          </Reveal>
        </PageShell>
      </section>

      <PageShell className="py-8">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: t.navDestinations, href: '/destinations' },
            { label: cityName },
          ]}
        />

        {/* Guide / Description */}
        <Reveal className="mt-6">
          {guide ? (
            <DestinationGuide destination={localDestination!} guide={guide} />
          ) : (
            <div className="max-w-3xl rounded-card-lg border border-neutral-200 bg-white p-6 shadow-card">
              <h2 className="font-heading text-xl font-bold text-ink-900">About {cityName}</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-600">{cityDescription}</p>
              {localDestination && (
                <p className="mt-4 text-sm font-semibold text-primary-700">
                  {t.bestTimeToVisit}: {pick(localDestination.bestTime)}
                </p>
              )}
            </div>
          )}
        </Reveal>

        {/* Destination category stories (from API /cities/{id}) */}
        {categorySections.length > 0 && (
          <section className="mx-auto mt-14 max-w-5xl space-y-14 sm:space-y-20">
            {categorySections.map((category, index) => {
              const categoryImage = resolveApiAssetUrl(category.hero_image);
              const categoryId = category.id ?? category._id ?? `${category.title}-${index}`;
              const imageFirst = index % 2 === 0;

              return (
                <Reveal key={categoryId}>
                  <article className="grid items-center gap-7 md:grid-cols-2 md:gap-12 lg:gap-16">
                    <div className={`relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-neutral-100 shadow-card ${imageFirst ? '' : 'md:order-2'}`}>
                      {categoryImage ? (
                        <Image
                          src={categoryImage}
                          alt={category.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-ink-300">
                          <Compass size={36} />
                        </div>
                      )}
                    </div>
                    <div className={imageFirst ? '' : 'md:order-1'}>
                      <h2 className="font-heading text-xl font-extrabold text-primary-950 sm:text-2xl">{category.title}</h2>
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink-600 sm:text-base">{category.description}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </section>
        )}

        {/* Things To Do Section (from API /cities/{id}) */}
        {thingsToDo.length > 0 && (
          <Reveal className="mt-12">
            <SectionHeader
              title={`Things to Do in ${cityName}`}
              subtitle={`${thingsToDo.length} activities & attractions`}
              className="mb-6"
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {thingsToDo.map((item, index) => {
                const itemTitle = language === 'am' ? item.name_am : item.name_en;
                const itemDesc = language === 'am' ? item.description_am : item.description_en;
                const itemPhoto = resolveApiAssetUrl(item.hero_image);
                return (
                  <div
                    key={item._id ?? item.id ?? index}
                    className="group overflow-hidden rounded-card-lg border border-neutral-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                      {itemPhoto ? (
                        <Image
                          src={itemPhoto}
                          alt={itemTitle}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-ink-300">
                          <Compass size={32} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                        <h3 className="font-heading text-lg font-bold">{itemTitle}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-3 text-sm text-ink-600">{itemDesc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        )}

        {/* City Photo Gallery (from API /cities/{id}) */}
        {galleryImages.length > 0 && (
          <Reveal className="mt-12">
            <SectionHeader
              title={`Photos of ${cityName}`}
              subtitle={`${galleryImages.length} gallery images`}
              className="mb-6"
            />
            <div className="grid grid-cols-2 gap-3 md:h-[510px] md:grid-cols-4 md:grid-rows-2 md:gap-4">
              {galleryImages.slice(0, 5).map((imgUrl, i) => {
                const secondaryCount = Math.min(Math.max(galleryImages.length - 1, 0), 4);
                const desktopSpan = i === 0
                  ? galleryImages.length === 1 ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-2'
                  : secondaryCount === 1
                    ? 'md:col-span-2 md:row-span-2'
                    : secondaryCount === 2
                      ? 'md:col-span-2'
                      : secondaryCount === 3 && i === 1
                        ? 'md:col-span-2'
                        : '';
                const remaining = galleryImages.length - 5;

                return (
                  <div
                    key={`${imgUrl}-${i}`}
                    className={`group relative overflow-hidden rounded-[1.25rem] bg-neutral-100 shadow-card ${i === 0 ? 'col-span-2 aspect-[4/3]' : 'aspect-[4/3]'} ${desktopSpan} md:aspect-auto`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${cityName} photo ${i + 1}`}
                      fill
                      unoptimized
                      sizes={i === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    {i === 4 && remaining > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary-950/55 text-xl font-extrabold text-white backdrop-blur-[1px]">
                        +{remaining} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Reveal>
        )}

        {/* Hotels Section */}
        <Reveal className="mt-12">
          <SectionHeader
            title={`${t.navHotels} — ${cityName}`}
            subtitle={`${hotels.length} ${t.hotelsCount}`}
            className="mb-6"
          />
          {hotels.length === 0 ? (
            <EmptyState title={t.emptyResultsTitle} subtitle={t.emptyResultsSubtitle} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {hotels.map((hotel, i) => (
                <HotelCard key={hotel.id} hotel={hotel} revealIndex={i} />
              ))}
            </div>
          )}
        </Reveal>

        {/* Experiences Section */}
        {experiences.length > 0 && localDestination && (
          <div className="mt-12">
            <DestinationGreatFor destination={localDestination} experiences={experiences} />
          </div>
        )}
      </PageShell>
    </Layout>
  );
}
