import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Compass, ImageIcon, MapPin, Sparkles } from 'lucide-react';
import { activitiesApi, resolveApiAssetUrl, thingsToDoApi, type Activity, type ThingsToDo } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

function recordId(record?: { id?: string | number; _id?: string } | null) {
  const id = record?.id ?? record?._id;
  return id === undefined ? '' : String(id);
}

export default function ActivityDetailPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [thingsToDoList, setThingsToDoList] = useState<ThingsToDo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const id = typeof router.query.id === 'string' ? router.query.id : '';

  useEffect(() => {
    if (!router.isReady || !id) return;
    setLoading(true);
    setError('');

    let isMounted = true;

    async function fetchData() {
      try {
        const actData = await activitiesApi.getById(id);
        if (!isMounted) return;
        setActivity(actData);

        // Extract embedded things_to_do array from GET /activities/{id}
        const embeddedThings = (actData.things_to_do && Array.isArray(actData.things_to_do)) ? actData.things_to_do : [];
        
        if (embeddedThings.length > 0) {
          setThingsToDoList(embeddedThings);
        } else {
          // Fallback: fetch all things to do and filter by activity reference
          const allThings = await thingsToDoApi.list();
          if (!isMounted) return;
          const actIdStr = recordId(actData) || actData._id || actData.slug || id;
          const filtered = allThings.filter((item) => {
            if (typeof item.activity === 'string') {
              return item.activity === actIdStr || item.activity === id || item.activity === actData._id;
            } else if (item.activity && typeof item.activity === 'object') {
              const itemActId = recordId(item.activity) || (item.activity as Activity & { _id?: string })._id;
              const itemActSlug = (item.activity as Activity).slug;
              return itemActId === actIdStr || itemActId === id || itemActSlug === actData.slug;
            }
            return false;
          });
          setThingsToDoList(filtered);
        }
      } catch (caughtError) {
        if (!isMounted) return;
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to load this activity.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [id, router.isReady]);

  const name = activity ? (language === 'am' ? activity.name_am : activity.name_en) : t.navExperiences;
  const secondaryName = activity ? (language === 'am' ? activity.name_en : activity.name_am) : '';
  const heroImage = activity
    ? (resolveApiAssetUrl(activity.image || activity.hero_image || activity.image_url || activity.cover_image) || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e')
    : 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e';

  return (
    <Layout
      seo={{
        title: name,
        description: activity ? `${activity.name_en} — ${activity.name_am}` : t.experiencesSubtitle,
        path: `/activities/${id}`,
      }}
    >
      <PageHero
        photo={heroImage}
        title={name}
        subtitle={secondaryName && secondaryName !== name ? secondaryName : `${thingsToDoList.length} experiences available`}
        eyebrow={language === 'am' ? 'የመዝናኛ አይነት' : 'Activity Category'}
      />

      <PageShell className="py-6 sm:py-10">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: 'Things to do', href: '/things-to-do' },
            { label: name },
          ]}
        />

        <div className="mt-4">
          <Button href="/things-to-do" variant="ghost" size="sm" className="-ml-3 text-slate-600 hover:text-slate-900">
            <ArrowLeft size={16} /> Back to Things to do
          </Button>
        </div>

        {error ? (
          <div className="mt-8">
            <ErrorState
              title="Could not load activity"
              subtitle={error}
              retryLabel="Back to Things to do"
              onRetry={() => void router.push('/things-to-do')}
            />
          </div>
        ) : loading || !activity ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="mt-6 space-y-10">
            {/* Embedded Things To Do Section */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold text-slate-900">
                  {language === 'am' ? `${name} - የተገኙ ተግባራት` : `Things to Do in ${name}`}
                </h2>
                <span className="text-sm font-semibold text-slate-500">
                  {thingsToDoList.length} {language === 'am' ? 'ቦታዎች' : 'items'}
                </span>
              </div>

              {thingsToDoList.length === 0 ? (
                <EmptyState
                  title={language === 'am' ? 'ምንም ተግባራት አልተገኙም' : `No experiences found under ${name}`}
                  subtitle={language === 'am' ? 'አዳዲስ ተግባራት በቅርቡ ይጨመራሉ።' : 'New experiences for this category will appear here soon.'}
                  icon={Compass}
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {thingsToDoList.map((item, index) => {
                    const itemId = recordId(item) || item._id || item.slug || `${index}`;
                    const itemName = language === 'am' ? item.name_am : item.name_en;
                    const itemDesc = language === 'am' ? item.description_am : item.description_en;
                    const itemImage = resolveApiAssetUrl(item.hero_image);
                    const cityName =
                      typeof item.city === 'object' && item.city
                        ? (language === 'am' ? item.city.name_am : item.city.name_en)
                        : '';

                    return (
                      <Link
                        key={itemId}
                        href={`/things-to-do/${encodeURIComponent(item.slug || itemId)}`}
                        className="group overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-xl"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                          {itemImage ? (
                            <Image
                              src={itemImage}
                              alt={itemName}
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
                          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm">
                            {name}
                          </span>
                        </div>
                        <div className="p-6">
                          {cityName && (
                            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600">
                              <MapPin size={14} />
                              {cityName}
                            </p>
                          )}
                          <h3 className="mt-2 font-heading text-xl font-bold text-slate-900 transition-colors group-hover:text-orange-500">
                            {itemName}
                          </h3>
                          {itemDesc && (
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                              {itemDesc}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </PageShell>
    </Layout>
  );
}
