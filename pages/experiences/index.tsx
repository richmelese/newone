import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Compass, Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import { destinations } from '@/data/destinations';
import { activitiesApi, resolveApiAssetUrl, type Activity } from '@/lib/api';
import { useLanguage } from '@/lib/language';

function recordId(record?: { id?: string | number; _id?: string } | null) {
  const id = record?.id ?? record?._id;
  return id === undefined ? '' : String(id);
}

export default function ExperiencesPage() {
  const { language, t } = useLanguage();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch activities from GET /activities
      const activityList = await activitiesApi.list({ page: 1, limit: 20 });
      setActivities(activityList);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load activities.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadActivities();
  }, [loadActivities]);

  const filteredActivities = useMemo(() => {
    if (!searchQuery.trim()) return activities;
    const q = searchQuery.trim().toLowerCase();
    return activities.filter((activity) => {
      const nameEn = (activity.name_en || '').toLowerCase();
      const nameAm = (activity.name_am || '').toLowerCase();
      const slug = (activity.slug || '').toLowerCase();
      return nameEn.includes(q) || nameAm.includes(q) || slug.includes(q);
    });
  }, [activities, searchQuery]);

  return (
    <Layout seo={{ title: t.navExperiences, description: t.experiencesSubtitle, path: '/experiences' }}>
      <PageHero
        photo={destinations[3]?.heroPhoto || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e'}
        title={t.experiencesTitle}
        subtitle={t.experiencesSubtitle}
      />

      <PageShell className="py-6 sm:py-10">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: 'Things to do' }]} />

        {/* Heading Title & Search */}
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
              placeholder={language === 'am' ? 'መዝናኛ ፈልግ...' : 'Search activities...'}
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-11 pr-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
            />
          </div>
        </div>

        {/* Activity Categories Grid */}
        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="mt-8">
            <ErrorState
              title={language === 'am' ? 'መረጃዎችን መጫን አልተቻለም' : 'Could not load activities'}
              subtitle={error}
              retryLabel={language === 'am' ? 'እንደገና ሞክር' : 'Try again'}
              onRetry={() => void loadActivities()}
            />
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title={searchQuery ? 'No matching activities found' : 'No activities found'}
              subtitle={searchQuery ? 'Try a different search term.' : 'Activities will appear here once added.'}
              icon={Compass}
            />
          </div>
        ) : (
          <section className="mt-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredActivities.map((activity) => {
                const actId = recordId(activity) || (activity as { _id?: string })._id || activity.slug || activity.name_en;
                const image = resolveApiAssetUrl(activity.image || activity.hero_image || activity.image_url || activity.cover_image);
                const title = language === 'am' ? activity.name_am : activity.name_en;

                return (
                  <Link
                    key={actId}
                    href={`/activities/${encodeURIComponent(actId)}`}
                    className="group relative overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-xl"
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
      </PageShell>
    </Layout>
  );
}
