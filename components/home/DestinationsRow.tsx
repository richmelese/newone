import { useCallback, useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import DestinationFeaturedCard from '@/components/home/DestinationFeaturedCard';
import PageShell from '@/components/layout/PageShell';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import { citiesApi, type City } from '@/lib/api';
import { useLanguage } from '@/lib/language';

const badgeKeys = ['badgeTrending', 'badgePopular', 'badgeNew', 'badgeHot', 'badgeFeatured'] as const;

export default function DestinationsRow() {
  const { t } = useLanguage();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await citiesApi.list();
      setCities(response.filter((city) => city.is_iconic === false));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load destinations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadCities(); }, [loadCities]);

  return (
    <section className="bg-white py-10 sm:py-14">
      <PageShell>
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="font-heading text-2xl font-bold text-ink-900 sm:text-3xl lg:text-4xl">
            <TwoToneHeading text={t.popularDestinationsTitle} />
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-ink-500 sm:text-base">{t.popularDestinationsSubtitle}</p>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center"><Spinner /></div>
        ) : error ? (
          <ErrorState title="Could not load destinations" subtitle={error} retryLabel="Try again" onRetry={() => void loadCities()} />
        ) : cities.length === 0 ? (
          <EmptyState title="No destinations found" subtitle="Cities added to Ethiopidia will appear here." icon={MapPin} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[230px] lg:gap-5">
            {cities.map((city, index) => {
              const featured = index === 0;
              return (
                <DestinationFeaturedCard
                  key={city.id ?? city._id ?? `${city.name_en}-${index}`}
                  destination={city}
                  badge={t[badgeKeys[index % badgeKeys.length]]}
                  featured={featured}
                  revealIndex={index}
                  className={featured ? 'lg:row-span-2' : undefined}
                />
              );
            })}
          </div>
        )}
      </PageShell>
    </section>
  );
}
