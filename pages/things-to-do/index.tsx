import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Compass, Search, Sparkles } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import { destinations } from '@/data/destinations';
import { activitiesApi, resolveApiAssetUrl, type Activity } from '@/lib/api';
import { useLanguage } from '@/lib/language';

// Fallback high-quality curated activities to ensure rich display if API has not been populated
const FALLBACK_ACTIVITIES: Activity[] = [
  {
    id: 'art-gallery',
    slug: 'art-gallery',
    name_en: 'Art Gallery',
    name_am: 'የኪነጥበብ ማዕከላት',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'culture',
    slug: 'culture',
    name_en: 'Culture',
    name_am: 'ባህልና ወግ',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'nature',
    slug: 'nature',
    name_en: 'Nature',
    name_am: 'ተፈጥሮ እና ገጽታ',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'museum',
    slug: 'museum',
    name_en: 'Museum',
    name_am: 'ሙዚየም',
    image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'culinary',
    slug: 'culinary',
    name_en: 'Culinary & Coffee',
    name_am: 'ምግብና የቡና ባህል',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'historic-sites',
    slug: 'historic-sites',
    name_en: 'Historic Sites',
    name_am: 'ታሪካዊ ስፍራዎች',
    image: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'hiking-trekking',
    slug: 'hiking-trekking',
    name_en: 'Hiking & Trekking',
    name_am: 'የተራራ ጉዞ',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'wildlife-safari',
    slug: 'wildlife-safari',
    name_en: 'Wildlife Safari',
    name_am: 'የዱር እንስሳት ጉብኝት',
    image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'music-nightlife',
    slug: 'music-nightlife',
    name_en: 'Music & Nightlife',
    name_am: 'ሙዚቃ እና የምሽት ህይወት',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
  },
];

function recordId(record?: { id?: string | number; _id?: string } | null) {
  const id = record?.id ?? record?._id;
  return id === undefined ? '' : String(id);
}

function getActivityImage(activity: Activity, index: number) {
  const resolved = resolveApiAssetUrl(
    activity.image || activity.hero_image || activity.image_url || activity.cover_image,
  );
  if (resolved) return resolved;
  return FALLBACK_ACTIVITIES[index % FALLBACK_ACTIVITIES.length]?.image || FALLBACK_ACTIVITIES[0].image;
}

export default function ThingsToDoIndexPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cityName = typeof router.query.city === 'string' ? router.query.city : 'Addis Ababa';
  const cityWords = cityName.split(' ');
  const firstWord = cityWords[0] || 'Addis';
  const restWords = cityWords.slice(1).join(' ') || 'Ababa';

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await activitiesApi.list({ limit: 100 });
      if (Array.isArray(data) && data.length > 0) {
        setActivities(data);
      } else {
        setActivities(FALLBACK_ACTIVITIES);
      }
    } catch (caughtError) {
      // If endpoint fails, show fallback mock data gracefully
      console.warn('Activities endpoint fetch error:', caughtError);
      setActivities(FALLBACK_ACTIVITIES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadActivities();
  }, [loadActivities]);

  const filteredActivities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return activities;
    return activities.filter((act) => {
      const en = (act.name_en || '').toLowerCase();
      const am = (act.name_am || '').toLowerCase();
      const slug = (act.slug || '').toLowerCase();
      return en.includes(q) || am.includes(q) || slug.includes(q);
    });
  }, [activities, searchQuery]);

  return (
    <Layout
      seo={{
        title: language === 'am' ? 'መዝናኛዎች እና ተግባራት በኢትዮጵያ' : 'Things to Do in Ethiopia',
        description: 'Explore curated things to do, hiking & trekking, wildlife safaris, historic tours, and cultural experiences across Ethiopia.',
        path: '/things-to-do',
      }}
    >
      <PageHero
        photo={destinations.find((d) => d.slug === 'lalibela')?.heroPhoto || destinations[3]?.heroPhoto || 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&auto=format&fit=crop&q=80'}
        title={language === 'am' ? 'መዝናኛዎች እና ተግባራት በኢትዮጵያ' : 'Things to Do in Ethiopia'}
        subtitle={language === 'am' ? 'ታሪካዊ ቦታዎች፣ ተፈጥሮ፣ ባህላዊ ጉዞዎች እና የማይረሱ ልምዶች' : 'Local experiences to pair with your stay.'}
        eyebrow={language === 'am' ? 'ልምዶች እና ጉዞዎች' : 'Explore Ethiopia'}
      />

      <PageShell className="py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: 'Things to do' },
          ]}
        />

        {/* Page Title & Search Header */}
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-black tracking-tight text-ink-900 sm:text-5xl">
              {firstWord} <span className="text-[#f26a1b]">{restWords}</span>
            </h1>
          </div>

          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'am' ? 'ተግባራትን ፈልግ...' : 'Search activities...'}
              className="h-11 w-full rounded-full border border-neutral-200 bg-white pl-11 pr-5 text-sm font-medium text-ink-800 shadow-sm outline-none transition placeholder:text-ink-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-50"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        {loading ? (
          <div className="mt-12 flex min-h-[40vh] items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="mt-10">
            <ErrorState
              title={language === 'am' ? 'መረጃዎችን መጫን አልተቻለም' : 'Could not load activities'}
              subtitle={error}
              retryLabel={language === 'am' ? 'እንደገና ሞክር' : 'Try again'}
              onRetry={() => void loadActivities()}
            />
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title={searchQuery ? 'No activities match your search' : 'No activities found'}
              subtitle={searchQuery ? 'Try a different search term.' : 'Activities will appear here once published.'}
              icon={Compass}
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredActivities.map((activity, index) => {
              const id = recordId(activity) || activity.slug || String(index);
              const title = language === 'am' ? activity.name_am || activity.name_en : activity.name_en || activity.name_am;
              const imageSrc = getActivityImage(activity, index);
              const targetSlug = recordId(activity) || activity.slug || id;

              return (
                <Link
                  key={id || `${activity.name_en}-${index}`}
                  href={`/things-to-do/${encodeURIComponent(targetSlug)}`}
                  className="group block overflow-hidden rounded-[28px] border border-neutral-200/90 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-300 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[20px] bg-neutral-100">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_ACTIVITIES[index % FALLBACK_ACTIVITIES.length].image as string;
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary-50 text-primary-600">
                        <Compass size={36} />
                      </div>
                    )}
                  </div>
                  <div className="px-3 pb-2 pt-4">
                    <h2 className="font-heading text-xl font-bold text-ink-900 transition-colors group-hover:text-primary-700 sm:text-2xl">
                      {title}
                    </h2>
                    {activity.name_am && language !== 'am' && (
                      <p className="mt-0.5 text-xs text-ink-400" lang="am">
                        {activity.name_am}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </PageShell>
    </Layout>
  );
}
