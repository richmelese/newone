import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/language';
import { citiesApi, resolveApiAssetUrl, type City } from '@/lib/api';
import { destinations } from '@/data/destinations';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import RevealItem from '@/components/ui/RevealItem';
import TiltSurface from '@/components/ui/TiltSurface';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function CityCard({ city, index }: { city: City; index: number }) {
  const { language } = useLanguage();
  const name = language === 'am' ? city.name_am : city.name_en;
  const description = language === 'am' ? city.description_am : city.description_en;
  const image = resolveApiAssetUrl(city.hero_image);
  const localDestination = destinations.find((item) => item.slug === slugify(city.name_en));
  const content = (
    <>
      {image ? (
        <Image src={image} alt={name} fill unoptimized sizes="(max-width: 640px) 45vw, 256px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 bg-primary-100" />
      )}
      <div className="absolute inset-0 bg-hero-scrim" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h2 className="font-heading text-lg font-bold">{name}</h2>
        <p className="mt-1 line-clamp-3 text-sm text-white/85">{description}</p>
      </div>
    </>
  );

  const targetId = city._id ?? city.id ?? localDestination?.slug ?? slugify(city.name_en);

  return (
    <RevealItem index={index} className="block w-full">
      <TiltSurface className="w-full" innerClassName="rounded-card-lg" maxTilt={5}>
        <Link href={`/destinations/${targetId}`} className="group relative block aspect-[3/4] w-full overflow-hidden rounded-card-lg shadow-card transition-shadow hover:shadow-lift">
          {content}
        </Link>
      </TiltSurface>
    </RevealItem>
  );
}

export default function DestinationsIndexPage() {
  const { t } = useLanguage();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCities(await citiesApi.list());
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load destinations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCities();
  }, [loadCities]);

  return (
    <Layout
      seo={{
        title: t.navDestinations,
        description: 'Browse Ethiopia’s top travel destinations and discover hotels in each — Addis Ababa, Bahir Dar, Lalibela, Gondar, Hawassa, Axum, and Harar.',
        path: '/destinations',
      }}
    >
      <PageHero photo={destinations[2].heroPhoto} title={t.popularDestinationsTitle} subtitle={t.popularDestinationsSubtitle} />
      <PageShell className="py-8">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.navDestinations }]} />
        <p className="mt-6 max-w-3xl leading-relaxed text-ink-600">{t.destinationsOverviewText}</p>
        {loading ? (
          <div className="flex min-h-72 items-center justify-center"><Spinner /></div>
        ) : error ? (
          <div className="mt-6"><ErrorState title="Could not load destinations" subtitle={error} retryLabel="Try again" onRetry={() => void loadCities()} /></div>
        ) : cities.length === 0 ? (
          <div className="mt-6"><EmptyState title="No destinations found" subtitle="Cities added to Ethiopidia will appear here." /></div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {cities.map((city, index) => <CityCard key={city.id ?? city._id ?? `${city.name_en}-${index}`} city={city} index={index} />)}
            </div>
            <p className="mt-4 text-xs text-ink-400">{cities.length} destinations</p>
          </>
        )}
      </PageShell>
    </Layout>
  );
}
