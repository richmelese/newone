import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '@/lib/language';
import { filterHotels, paginate, RESULTS_PAGE_SIZE } from '@/lib/search';
import { getDestination } from '@/data/destinations';
import { getExperiencesByDestination } from '@/data/experiences';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import DestinationInfoCard from '@/components/search/DestinationInfoCard';
import FilterSidebar from '@/components/search/FilterSidebar';
import MobileFilterSheet from '@/components/search/MobileFilterSheet';
import ActiveFilterChips from '@/components/search/ActiveFilterChips';
import ResultsToolbar from '@/components/search/ResultsToolbar';
import HotelCard from '@/components/hotel/HotelCard';
import HotelListCard from '@/components/hotel/HotelListCard';
import { SkeletonHotelCard } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import type { FilterState, SortOption } from '@/types';

function parseQuery(query: Record<string, string | string[] | undefined>): FilterState {
  const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const list = (v: string | string[] | undefined) => (str(v) ? str(v)!.split(',').filter(Boolean) : []);

  return {
    destination: str(query.destination),
    q: str(query.q),
    minPrice: query.minPrice ? Number(str(query.minPrice)) : undefined,
    maxPrice: query.maxPrice ? Number(str(query.maxPrice)) : undefined,
    stars: list(query.stars).map(Number),
    minGuestRating: query.minGuestRating ? Number(str(query.minGuestRating)) : undefined,
    amenities: list(query.amenities),
    propertyTypes: list(query.propertyTypes) as FilterState['propertyTypes'],
    sort: (str(query.sort) as SortOption) ?? 'recommended',
    page: query.page ? Number(str(query.page)) : 1,
    view: (str(query.view) as 'list' | 'grid') ?? 'list',
  };
}

function toQuery(filters: FilterState): Record<string, string> {
  const q: Record<string, string> = {};
  if (filters.destination) q.destination = filters.destination;
  if (filters.q) q.q = filters.q;
  if (filters.minPrice !== undefined) q.minPrice = String(filters.minPrice);
  if (filters.maxPrice !== undefined) q.maxPrice = String(filters.maxPrice);
  if (filters.stars && filters.stars.length) q.stars = filters.stars.join(',');
  if (filters.minGuestRating !== undefined) q.minGuestRating = String(filters.minGuestRating);
  if (filters.amenities && filters.amenities.length) q.amenities = filters.amenities.join(',');
  if (filters.propertyTypes && filters.propertyTypes.length) q.propertyTypes = filters.propertyTypes.join(',');
  if (filters.sort && filters.sort !== 'recommended') q.sort = filters.sort;
  if (filters.page && filters.page > 1) q.page = String(filters.page);
  if (filters.view && filters.view !== 'list') q.view = filters.view;
  return q;
}

export default function SearchPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({ sort: 'recommended', page: 1, view: 'list' });
  const [loading, setLoading] = useState(false);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (!router.isReady) return;
    setFilters(parseQuery(router.query as Record<string, string | string[] | undefined>));
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [filters]);

  const updateFilters = (next: Partial<FilterState>, resetPage = true) => {
    const merged: FilterState = { ...filters, ...next, page: resetPage ? 1 : (next.page ?? filters.page) };
    setFilters(merged);
    router.push({ pathname: '/search', query: toQuery(merged) }, undefined, { shallow: true });
  };

  const results = useMemo(() => filterHotels(filters), [filters]);
  const page = filters.page ?? 1;
  const paged = useMemo(() => paginate(results, page), [results, page]);
  const totalPages = Math.max(1, Math.ceil(results.length / RESULTS_PAGE_SIZE));
  const destination = filters.destination ? getDestination(filters.destination) : undefined;
  const destinationExperiences = useMemo(
    () => (destination ? getExperiencesByDestination(destination.slug) : []),
    [destination]
  );

  return (
    <Layout
      seo={{
        title: destination ? `Hotels in ${destination.name}` : 'Search hotels in Ethiopia',
        description: 'Compare hotels across Ethiopia by price, rating, amenities, and location.',
        path: '/search',
      }}
    >
      <PageShell className="py-6">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: t.navHotels, href: '/search' },
            ...(destination ? [{ label: destination.name }] : []),
          ]}
        />

        {destination && (
          <div className="mt-4">
            <DestinationInfoCard destination={destination} experiences={destinationExperiences} />
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-bold text-ink-900 sm:text-3xl">
            {destination ? `Hotels in ${destination.name}` : t.navHotels}
          </h1>
          <MobileFilterSheet>
            <FilterSidebar filters={filters} onChange={updateFilters} />
          </MobileFilterSheet>
        </div>

        <div className="mt-3">
          <ActiveFilterChips filters={filters} onChange={updateFilters} />
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} onChange={updateFilters} />
          </div>

          <div>
            <ResultsToolbar
              count={results.length}
              sort={filters.sort ?? 'recommended'}
              onSortChange={(sort) => updateFilters({ sort }, false)}
              view={filters.view ?? 'list'}
              onViewChange={(view) => updateFilters({ view }, false)}
            />

            <div className="mt-5">
              {loading ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: RESULTS_PAGE_SIZE }).map((_, i) => (
                    <SkeletonHotelCard key={i} variant="detailed" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <EmptyState
                  title={t.emptyResultsTitle}
                  subtitle={t.emptyResultsSubtitle}
                  action={
                    <Button variant="secondary" onClick={() => updateFilters({ minPrice: undefined, maxPrice: undefined, stars: [], amenities: [], propertyTypes: [], minGuestRating: undefined, destination: undefined })}>
                      {t.filterClearAll}
                    </Button>
                  }
                />
              ) : (filters.view ?? 'list') === 'grid' ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {paged.map((hotel, i) => (
                    <HotelCard key={hotel.id} hotel={hotel} variant="detailed" revealIndex={i} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {paged.map((hotel, i) => (
                    <HotelListCard key={hotel.id} hotel={hotel} revealIndex={i} />
                  ))}
                </div>
              )}
            </div>

            {!loading && results.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => updateFilters({ page: i + 1 }, false)}
                    className={`h-9 w-9 rounded-full text-sm font-semibold transition-colors ${
                      page === i + 1 ? 'bg-primary-600 text-white' : 'text-ink-600 hover:bg-neutral-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageShell>
    </Layout>
  );
}
