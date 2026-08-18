import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Compass, ImageIcon, MapPin, Search, Sparkles, Tag, ArrowRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import { destinations } from '@/data/destinations';
import { activitiesApi, resolveApiAssetUrl, thingsToDoApi, type Activity, type ThingsToDo } from '@/lib/api';
import { useLanguage } from '@/lib/language';

function recordId(record?: { id?: string | number; _id?: string } | null) {
  const id = record?.id ?? record?._id;
  return id === undefined ? '' : String(id);
}

function activityKey(activity: Activity) {
  return recordId(activity) || activity.slug || activity.name_en;
}

export default function ThingsToDoIndexPage() {
  const { language, t } = useLanguage();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [thingsToDo, setThingsToDo] = useState<ThingsToDo[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [activityList, thingsList] = await Promise.all([
        activitiesApi.list({ page: 1, limit: 10 }),
        thingsToDoApi.list(),
      ]);
      setActivities(activityList);
      setThingsToDo(thingsList);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load activities.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // Count things to do per activity
  const countsByActivity = useMemo(() => {
    const map = new Map<string, number>();
    thingsToDo.forEach((item) => {
      let actId = '';
      if (typeof item.activity === 'string') {
        actId = item.activity;
      } else if (item.activity && typeof item.activity === 'object') {
        actId = recordId(item.activity) || (item.activity as Activity).slug || '';
      }
      if (actId) {
        map.set(actId, (map.get(actId) ?? 0) + 1);
      }
    });
    return map;
  }, [thingsToDo]);

  // Filtered things to do items
  const filteredThings = useMemo(() => {
    return thingsToDo.filter((item) => {
      // Activity filter
      if (selectedActivityId !== 'all') {
        let itemActId = '';
        let itemActSlug = '';
        if (typeof item.activity === 'string') {
          itemActId = item.activity;
        } else if (item.activity && typeof item.activity === 'object') {
          itemActId = recordId(item.activity);
          itemActSlug = (item.activity as Activity).slug || '';
        }

        const matchesActivity =
          itemActId === selectedActivityId ||
          itemActSlug === selectedActivityId ||
          (item.activity && typeof item.activity === 'object' && (item.activity as Activity).name_en === selectedActivityId);

        if (!matchesActivity) return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const nameEn = (item.name_en || '').toLowerCase();
        const nameAm = (item.name_am || '').toLowerCase();
        const descEn = (item.description_en || '').toLowerCase();
        const descAm = (item.description_am || '').toLowerCase();
        const cityName = typeof item.city === 'object' ? `${item.city.name_en} ${item.city.name_am}`.toLowerCase() : '';
        return nameEn.includes(q) || nameAm.includes(q) || descEn.includes(q) || descAm.includes(q) || cityName.includes(q);
      }

      return true;
    });
  }, [thingsToDo, selectedActivityId, searchQuery]);

  return (
    <Layout
      seo={{
        title: language === 'am' ? 'መዝናኛዎች እና ተግባራት በኢትዮጵያ' : 'Things to Do in Ethiopia',
        description: 'Explore curated things to do, hiking & trekking, wildlife safaris, historic tours, and cultural experiences across Ethiopia.',
        path: '/things-to-do',
      }}
    >
      <PageHero
        photo={destinations[3]?.heroPhoto || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e'}
        title={language === 'am' ? 'መዝናኛዎች እና ተግባራት' : 'Things to Do in Ethiopia'}
        subtitle={language === 'am' ? 'ታሪካዊ ቦታዎች፣ ተፈጥሮ፣ ባህላዊ ጉዞዎች እና የማይረሱ ልምዶች' : 'Discover top activities, cultural attractions, nature escapes, and hidden gems.'}
      />

      <PageShell className="py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: language === 'am' ? 'መዝናኛዎች' : 'Things to do' },
          ]}
        />

        {/* Search & Header */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-primary-900 sm:text-3xl">
              {language === 'am' ? 'ሁሉንም መዝናኛዎች ያስሱ' : 'Explore Activities & Things to Do'}
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              {language === 'am'
                ? `${filteredThings.length} የተገኙ ተግባራት`
                : `Showing ${filteredThings.length} experiences across Ethiopia`}
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'am' ? 'መዝናኛ ፈልግ...' : 'Search things to do...'}
              className="h-11 w-full rounded-pill border border-neutral-200 bg-white pl-10 pr-4 text-sm font-medium text-ink-800 shadow-sm outline-none transition focus:border-primary-400 focus:ring-4 focus:ring-primary-50"
            />
          </div>
        </div>

        {/* Featured Activities from /activities?page=1&limit=10 */}
        {activities.length > 0 && (
          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-accent-500" />
                <h2 className="font-heading text-lg font-bold text-ink-900 sm:text-xl">
                  {language === 'am' ? 'ዋና ዋና የመዝናኛ አይነቶች' : 'Featured Activity Categories'}
                </h2>
              </div>
              {selectedActivityId !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedActivityId('all')}
                  className="text-xs font-bold text-primary-700 hover:underline"
                >
                  {language === 'am' ? 'ሁሉንም አሳይ' : 'Clear filter'}
                </button>
              )}
            </div>

            {/* Activities Horizontal Cards / Chips */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              <button
                type="button"
                onClick={() => setSelectedActivityId('all')}
                className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
                  selectedActivityId === 'all'
                    ? 'border-primary-700 bg-primary-900 text-white shadow-lift'
                    : 'border-neutral-200 bg-white text-ink-800 hover:border-primary-300 hover:bg-neutral-50'
                }`}
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${selectedActivityId === 'all' ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary-700'}`}>
                  <Compass size={24} />
                </span>
                <span className="mt-2.5 font-heading text-sm font-extrabold">
                  {language === 'am' ? 'ሁሉም' : 'All Activities'}
                </span>
                <span className={`mt-0.5 text-xs ${selectedActivityId === 'all' ? 'text-white/70' : 'text-ink-400'}`}>
                  {thingsToDo.length} {language === 'am' ? 'ቦታዎች' : 'items'}
                </span>
              </button>

              {activities.map((activity) => {
                const actId = recordId(activity) || activity.slug || activity.name_en;
                const isSelected = selectedActivityId === actId || selectedActivityId === activity.slug || selectedActivityId === recordId(activity);
                const image = resolveApiAssetUrl(activity.image || activity.hero_image || activity.image_url || activity.cover_image);
                const title = language === 'am' ? activity.name_am : activity.name_en;
                const count = countsByActivity.get(recordId(activity)) || (activity.slug ? countsByActivity.get(activity.slug) : 0) || 0;

                return (
                  <button
                    key={actId}
                    type="button"
                    onClick={() => setSelectedActivityId(isSelected ? 'all' : actId)}
                    className={`group relative overflow-hidden rounded-2xl border text-left transition ${
                      isSelected
                        ? 'border-primary-700 ring-2 ring-primary-700 shadow-lift'
                        : 'border-neutral-200 bg-white hover:border-primary-300 hover:shadow-card'
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                      {image ? (
                        <img
                          src={image}
                          alt={title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary-50 text-primary-600">
                          <Compass size={28} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                        <p className="font-heading text-sm font-extrabold leading-tight drop-shadow-sm">{title}</p>
                        {activity.name_am && language !== 'am' && (
                          <p className="text-[11px] text-white/80 drop-shadow-sm" lang="am">{activity.name_am}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-ink-500">
                      <span>{count > 0 ? `${count} ${language === 'am' ? 'ተግባራት' : 'items'}` : (activity.slug ? `/${activity.slug}` : 'Activity')}</span>
                      <ArrowRight size={13} className="text-primary-700 transition group-hover:translate-x-0.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="mt-10">
            <ErrorState
              title={language === 'am' ? 'መረጃዎችን መጫን አልተቻለም' : 'Could not load things to do'}
              subtitle={error}
              retryLabel={language === 'am' ? 'እንደገና ሞክር' : 'Try again'}
              onRetry={() => void loadData()}
            />
          </div>
        ) : filteredThings.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title={searchQuery ? 'No matching things to do' : 'No things to do found'}
              subtitle={searchQuery ? 'Try a different search term or clear filters.' : 'Activities will appear here once published.'}
              icon={Compass}
            />
          </div>
        ) : (
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredThings.map((item, index) => {
                const id = recordId(item);
                const name = language === 'am' ? item.name_am : item.name_en;
                const description = language === 'am' ? item.description_am : item.description_en;
                const image = resolveApiAssetUrl(item.hero_image);
                const activityName =
                  typeof item.activity === 'object' && item.activity
                    ? (language === 'am' ? item.activity.name_am : item.activity.name_en)
                    : '';
                const cityName =
                  typeof item.city === 'object' && item.city
                    ? (language === 'am' ? item.city.name_am : item.city.name_en)
                    : '';

                return (
                  <Link
                    key={id || `${item.slug}-${index}`}
                    href={`/things-to-do/${encodeURIComponent(item.slug || id)}`}
                    className="group overflow-hidden rounded-card-lg border border-neutral-200/80 bg-white shadow-soft transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-lift"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                      {image ? (
                        <Image
                          src={image}
                          alt={name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-ink-300">
                          <ImageIcon size={42} />
                        </div>
                      )}
                      {activityName && (
                        <span className="absolute left-3 top-3 rounded-pill bg-white/95 px-3 py-1 text-xs font-bold text-primary-900 shadow-sm backdrop-blur-sm">
                          {activityName}
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      {cityName && (
                        <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary-700">
                          <MapPin size={13} />
                          {cityName}
                        </p>
                      )}
                      <h3 className="mt-1.5 font-heading text-lg font-extrabold text-ink-900 transition group-hover:text-primary-800">
                        {name}
                      </h3>
                      {description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
                          {description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </PageShell>
    </Layout>
  );
}
