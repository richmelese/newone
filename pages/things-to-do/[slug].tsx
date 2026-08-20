import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Compass, ImageIcon, MapPin } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { activitiesApi, resolveApiAssetUrl, thingsToDoApi, type Activity, type ThingsToDo } from '@/lib/api';
import { useLanguage } from '@/lib/language';

function recordId(record?: { id?: string | number; _id?: string } | null) {
  const id = record?.id ?? record?._id;
  return id === undefined ? '' : String(id);
}

export default function ActivityCategoryDetailPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [thingsList, setThingsList] = useState<ThingsToDo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const slugOrId = typeof router.query.slug === 'string' ? router.query.slug : '';

  const loadData = useCallback(async () => {
  const loadData = useCallback(async () => {
    if (!slugOrId) return;
    setLoading(true);
    setError('');

    try {
      // 1. Fetch both endpoint GET /activities/:id and GET /things-to-do/activity/:activityId in parallel
      const [activityResult, thingsResult] = await Promise.allSettled([
        activitiesApi.getById(slugOrId),
        thingsToDoApi.getByActivityId(slugOrId),
      ]);

      let act: Activity | null = null;
      if (activityResult.status === 'fulfilled' && activityResult.value) {
        act = activityResult.value;
        setActivity(act);
      }

      let things: ThingsToDo[] = [];
      if (thingsResult.status === 'fulfilled' && Array.isArray(thingsResult.value) && thingsResult.value.length > 0) {
        things = thingsResult.value;
      } else if (act?.things_to_do && Array.isArray(act.things_to_do) && act.things_to_do.length > 0) {
        things = act.things_to_do;
      }

      // If activity was not found by direct ID, search in all activities
      if (!act) {
        try {
          const allActivities = await activitiesApi.list({ limit: 100 });
          act =
            allActivities.find(
              (a) =>
                recordId(a) === slugOrId ||
                a.slug === slugOrId ||
                a.name_en.toLowerCase() === slugOrId.toLowerCase(),
            ) ?? null;

          if (act) {
            setActivity(act);
            // If things list was empty, try fetching using resolved activity ID
            if (things.length === 0) {
              const actId = recordId(act);
              if (actId && actId !== slugOrId) {
                try {
                  const resolvedThings = await thingsToDoApi.getByActivityId(actId);
                  if (Array.isArray(resolvedThings) && resolvedThings.length > 0) {
                    things = resolvedThings;
                  }
                } catch {
                  // ignore
                }
              }
              if (things.length === 0 && Array.isArray(act.things_to_do) && act.things_to_do.length > 0) {
                things = act.things_to_do;
              }
            }
          }
        } catch {
          // ignore
        }
      }

      // If still not resolved as activity, check if single thing-to-do
      if (!act && things.length === 0) {
        try {
          const singleThing = await thingsToDoApi.getById(slugOrId);
          if (singleThing) {
            things = [singleThing];
            act = {
              id: slugOrId,
              name_en: singleThing.name_en,
              name_am: singleThing.name_am,
              hero_image: singleThing.hero_image,
            };
            setActivity(act);
          }
        } catch {
          // ignore
        }
      }

      // If activity object or its image is missing, extract from the populated activity inside things
      if (things.length > 0) {
        const firstThing = things[0];
        if (firstThing.activity && typeof firstThing.activity === 'object') {
          const nestedAct = firstThing.activity as Activity;
          act = {
            ...nestedAct,
            name_en: nestedAct.name_en || act?.name_en || '',
            name_am: nestedAct.name_am || act?.name_am || '',
            image: nestedAct.image || nestedAct.hero_image || act?.image || act?.hero_image || null,
          };
          setActivity(act);
        } else if (!act) {
          act = {
            id: slugOrId,
            name_en: firstThing.name_en,
            name_am: firstThing.name_am,
            hero_image: firstThing.hero_image,
          };
          setActivity(act);
        }
      }

      setThingsList(things);

      if (!act && things.length === 0) {
        setError('No activity or experiences found.');
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load activity details.');
    } finally {
      setLoading(false);
    }
  }, [slugOrId]);

  useEffect(() => {
    if (router.isReady && slugOrId) {
      void loadData();
      void loadData();
    }
  }, [router.isReady, slugOrId, loadData]);
  }, [router.isReady, slugOrId, loadData]);

  if (!router.isReady || loading) {
    return (
      <Layout seo={{ title: 'Things to do', description: 'Loading activity details...' }}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner />
        </div>
      </Layout>
    );
  }

  const activityName = activity
    ? language === 'am'
      ? activity.name_am || activity.name_en
      : activity.name_en || activity.name_am
    : thingsList[0]?.name_en || 'Activity';

  const heroPhoto =
    resolveApiAssetUrl(
      activity?.image ||
        activity?.hero_image ||
        activity?.image_url ||
        activity?.cover_image ||
        thingsList[0]?.hero_image,
    ) || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&auto=format&fit=crop&q=80';

  const totalCount = thingsList.length;

  return (
    <Layout
      overlapHeader={true}
      seo={{
        title: `${activityName} — Things to do in Ethiopia`,
        description: `Explore ${totalCount} experiences in ${activityName} across Ethiopia.`,
        image: heroPhoto || undefined,
        path: `/things-to-do/${slugOrId}`,
      }}
    >
      {/* Hero Section Banner */}
      <section className="relative flex min-h-[340px] items-center justify-center overflow-hidden sm:min-h-[400px]">
        {heroPhoto ? (
          <img
            src={heroPhoto}
            alt={activityName}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&auto=format&fit=crop&q=80';
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-primary-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/35" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 pb-12 pt-28 text-center text-white sm:pb-14 sm:pt-36">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f26a1b] sm:text-sm drop-shadow-sm">
            {language === 'am' ? 'የመዝናኛ ዘርፍ' : 'ACTIVITY CATEGORY'}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-black tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
            {activityName}
          </h1>
          <p className="mt-3 text-sm font-medium text-white/90 drop-shadow-sm sm:text-base">
            {language === 'am'
              ? `${totalCount} የተገኙ ተግባራት`
              : `${totalCount} ${totalCount === 1 ? 'experience' : 'experiences'} available`}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <PageShell className="py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: language === 'am' ? 'መዝናኛዎች' : 'Things to do', href: '/things-to-do' },
            { label: activityName },
          ]}
        />

        {/* Back Link */}
        <div className="mt-5">
          <Link
            href="/things-to-do"
            className="inline-flex items-center gap-2 text-sm font-bold text-ink-600 transition-colors hover:text-primary-700"
          >
            <ArrowLeft size={16} />
            {language === 'am' ? 'ወደ መዝናኛዎች ተመለስ' : 'Back to Things to do'}
          </Link>
        </div>

        {error && !activity && thingsList.length === 0 ? (
          <div className="mt-8">
            <ErrorState
              title={language === 'am' ? 'መረጃውን መጫን አልተቻለም' : 'Could not load this activity'}
              subtitle={error}
              retryLabel={language === 'am' ? 'እንደገና ሞክር' : 'Back to Things to do'}
              onRetry={() => void router.push('/things-to-do')}
            />
          </div>
        ) : (
          <div className="mt-8">
            {/* Section Header */}
            <div className="flex flex-col gap-2 border-b border-neutral-200/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-black text-ink-900 sm:text-3xl">
                  {language === 'am' ? `በ ${activityName} ውስጥ የሚገኙ ተግባራት` : `Things to Do in ${activityName}`}
                </h2>
              </div>
              <span className="text-sm font-semibold text-ink-400">
                {totalCount} {totalCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Things to do grid */}
            {thingsList.length === 0 ? (
              <div className="mt-12">
                <EmptyState
                  title={language === 'am' ? 'ምንም ተግባራት አልተገኙም' : `No activities found in ${activityName}`}
                  subtitle={
                    language === 'am'
                      ? 'በዚህ ዘርፍ የተመዘገቡ ስፍራዎች በቅርቡ ይጨመራሉ።'
                      : 'New experiences for this category will appear here once added.'
                  }
                  icon={Compass}
                />
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {thingsList.map((item, index) => {
                  const itemId = recordId(item) || item.slug || String(index);
                  const itemName = language === 'am' ? item.name_am || item.name_en : item.name_en;
                  const itemDesc = language === 'am' ? item.description_am || item.description_en : item.description_en;
                  const itemImage = resolveApiAssetUrl(item.hero_image);

                  const cityName =
                    typeof item.city === 'object' && item.city
                      ? (language === 'am' ? item.city.name_am || item.city.name_en : item.city.name_en)
                      : typeof item.city === 'string'
                        ? item.city
                        : '';

                  return (
                    <Link
                      key={itemId}
                      href={`/things-to-do/item/${encodeURIComponent(itemId)}`}
                      className="group block overflow-hidden rounded-[26px] border border-neutral-200/90 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-200 hover:shadow-lift"
                    >
                      {/* Image section */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                        {itemImage ? (
                          <img
                            src={itemImage}
                            alt={itemName}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-ink-300">
                            <ImageIcon size={42} />
                          </div>
                        )}
                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink-900 shadow-sm backdrop-blur-sm">
                          {activityName}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="p-5">
                        {cityName && (
                          <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary-700">
                            <MapPin size={13} />
                            {cityName}
                          </p>
                        )}
                        <h3 className="mt-1.5 font-heading text-lg font-extrabold text-ink-900 transition group-hover:text-primary-800 sm:text-xl">
                          {itemName}
                        </h3>
                        {itemDesc && (
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
                            {itemDesc}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </PageShell>
    </Layout>
  );
}
