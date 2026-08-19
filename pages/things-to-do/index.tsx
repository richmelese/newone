import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Compass, ImageIcon, MapPin, Search } from 'lucide-react';
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

export default function ThingsToDoIndexPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [thingsToDo, setThingsToDo] = useState<ThingsToDo[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sync selected activity with URL query param if present
  useEffect(() => {
    if (router.isReady) {
      const qAct = typeof router.query.activity === 'string' ? router.query.activity : typeof router.query.id === 'string' ? router.query.id : '';
      if (qAct) {
        setSelectedActivityId(qAct);
      }
    }
  }, [router.isReady, router.query.activity, router.query.id]);

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

  // Filtered things to do items
  const filteredThings = useMemo(() => {
    return thingsToDo.filter((item) => {
      if (selectedActivityId !== 'all') {
        let itemActId = '';
        let itemActUnderscoreId = '';
        let itemActSlug = '';
        let itemActName = '';
        if (typeof item.activity === 'string') {
          itemActId = item.activity;
        } else if (item.activity && typeof item.activity === 'object') {
          const actObj = item.activity as Activity & { _id?: string };
          itemActId = recordId(actObj);
          itemActUnderscoreId = actObj._id || '';
          itemActSlug = actObj.slug || '';
          itemActName = (actObj.name_en || '').toLowerCase();
        }

        const q = selectedActivityId.toLowerCase();
        const matchesActivity =
          itemActId === selectedActivityId ||
          (itemActUnderscoreId && itemActUnderscoreId === selectedActivityId) ||
          (itemActSlug && itemActSlug === selectedActivityId) ||
          (itemActName && itemActName === q);

        if (!matchesActivity) return false;
      }

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

      <PageShell className="py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: 'Things to do' },
          ]}
        />

        {/* Heading Title with split color */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Addis <span className="text-orange-500">Ababa</span>
            </h1>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'am' ? 'መዝናኛ ፈልግ...' : 'Search things to do...'}
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
            />
          </div>
        </div>

        {/* Activity Categories Grid matching Image 1 */}
        {activities.length > 0 && (
          <section className="mt-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => {
                const actId = recordId(activity) || (activity as { _id?: string })._id || activity.slug || activity.name_en;
                const isSelected =
                  selectedActivityId === actId ||
                  selectedActivityId === (activity as { _id?: string })._id ||
                  selectedActivityId === activity.slug ||
                  selectedActivityId === activity.name_en;

                const image = resolveApiAssetUrl(activity.image || activity.hero_image || activity.image_url || activity.cover_image);
                const title = language === 'am' ? activity.name_am : activity.name_en;

                return (
                  <Link
                    key={actId}
                    href={`/activities/${encodeURIComponent(actId)}`}
                    className={`group relative overflow-hidden rounded-[28px] border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      isSelected ? 'border-orange-500 ring-2 ring-orange-500' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      {image ? (
                        <img
                          src={image}
                          alt={title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-orange-50 text-orange-500">
                          <Compass size={48} />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-xl font-bold text-slate-900 transition-colors group-hover:text-orange-500">
                        {title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Things To Do List */}
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
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-slate-900">
                {language === 'am' ? 'ተግባራት እና ቦታዎች' : 'Experiences & Places'}
              </h2>
              {selectedActivityId !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedActivityId('all')}
                  className="text-sm font-bold text-orange-600 hover:underline"
                >
                  {language === 'am' ? 'ሁሉንም አሳይ' : 'Clear filter'}
                </button>
              )}
            </div>

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
                    className="group overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-xl"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      {image ? (
                        <Image
                          src={image}
                          alt={name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <ImageIcon size={42} />
                        </div>
                      )}
                      {activityName && (
                        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm">
                          {activityName}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      {cityName && (
                        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
                          <MapPin size={14} />
                          {cityName}
                        </p>
                      )}
                      <h3 className="mt-2 font-heading text-xl font-bold text-slate-900 transition-colors group-hover:text-orange-500">
                        {name}
                      </h3>
                      {description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
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
