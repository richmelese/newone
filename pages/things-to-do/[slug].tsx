import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Calendar, Camera, Compass, MapPin, Music, Sparkles } from 'lucide-react';
import { resolveApiAssetUrl, thingsToDoApi, type Activity, type City, type ThingsToDo } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/components/ui/ErrorState';
import Reveal from '@/components/ui/Reveal';

export default function ThingsToDoDetailPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [item, setItem] = useState<ThingsToDo | null>(null);
  const [relatedItems, setRelatedItems] = useState<ThingsToDo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const slugOrId = typeof router.query.slug === 'string' ? router.query.slug : '';

  const loadData = useCallback(async () => {
    if (!slugOrId) return;
    setLoading(true);
    setError('');
    try {
      // Primary endpoint: GET /things-to-do/{id}
      let fetched: ThingsToDo;
      try {
        fetched = await thingsToDoApi.getById(slugOrId);
      } catch {
        fetched = await thingsToDoApi.getBySlug(slugOrId);
      }

      setItem(fetched);

      // Load related items for "More moments in {City}"
      try {
        const allList = await thingsToDoApi.list();
        const currentId = fetched._id || fetched.id;
        const filtered = allList.filter((other) => (other._id || other.id) !== currentId);
        setRelatedItems(filtered.slice(0, 3));
      } catch (err) {
        console.warn('Could not load related things-to-do:', err);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load this activity.');
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, [slugOrId]);

  useEffect(() => {
    if (router.isReady && slugOrId) {
      void loadData();
    }
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

  if (error || !item) {
    return (
      <Layout seo={{ title: 'Activity not found', description: 'The requested activity could not be found.' }}>
        <PageShell className="py-12">
          <ErrorState
            title="Could not load this activity"
            subtitle={error || 'Activity not found.'}
            retryLabel="Back to Experiences"
            onRetry={() => void router.push('/experiences')}
          />
        </PageShell>
      </Layout>
    );
  }

  // Extract structured fields
  const name = language === 'am' ? item.name_am : item.name_en;
  const description = language === 'am' ? item.description_am : item.description_en;
  const heroImage = resolveApiAssetUrl(item.hero_image);

  // Extract nested Activity
  const activityObj = typeof item.activity === 'object' && item.activity !== null ? (item.activity as Activity) : null;
  const activityName = activityObj
    ? (language === 'am' ? activityObj.name_am : activityObj.name_en)
    : (typeof item.activity === 'string' ? item.activity : 'Experience');

  // Extract nested City
  const cityObj = typeof item.city === 'object' && item.city !== null ? (item.city as City) : null;
  const cityName = cityObj
    ? (language === 'am' ? cityObj.name_am : cityObj.name_en)
    : (typeof item.city === 'string' ? item.city : 'Ethiopia');

  const cityRegion = cityObj?.region || 'Ethiopia';
  const bestTime = cityObj?.best_time_to_visit || 'October - April';
  const cityTagline = cityObj?.tagline || null;

  // Extract gallery images if present
  const galleryPhotos: string[] = [];
  if (Array.isArray(item.gallery)) {
    item.gallery.forEach((entry) => {
      const url = typeof entry === 'string' ? entry : entry?.url || entry?.path;
      if (url) galleryPhotos.push(resolveApiAssetUrl(url));
    });
  }

  return (
    <Layout
      seo={{
        title: `${name} | ${cityName}`,
        description: description.slice(0, 160),
        image: heroImage || undefined,
        path: `/things-to-do/${slugOrId}`,
      }}
    >
      {/* Fancy Hero Banner */}
      <section className="relative flex min-h-[420px] items-end overflow-hidden sm:min-h-[500px]">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={name}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}

        {/* Hero Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        <PageShell className="relative pb-12 pt-32 text-white">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                <Music size={12} /> {activityName}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                <MapPin size={12} /> {cityName}
              </span>
            </div>

            <h1 className="mt-3 font-heading text-4xl font-black text-white sm:text-5xl lg:text-6xl">
              {name}
            </h1>

            {cityTagline && (
              <p className="mt-2 text-base font-semibold text-amber-300 sm:text-lg">
                {cityTagline}
              </p>
            )}
          </Reveal>
        </PageShell>
      </section>

      {/* Main Content Area */}
      <PageShell className="py-8">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: 'Experiences', href: '/experiences' },
            { label: cityName, href: `/destinations/${cityObj?._id ?? cityObj?.id ?? slugOrId}` },
            { label: name },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {/* Main Details (Col 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Box */}
            <Reveal className="rounded-[28px] border border-slate-100 bg-white p-7 shadow-card sm:p-9">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  <Compass size={24} />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-slate-900">Experience Overview</h2>
                  <p className="text-xs text-slate-500">Curated activity in {cityName}</p>
                </div>
              </div>

              <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-700 sm:text-lg">
                {description}
              </p>
            </Reveal>

            {/* Photo Gallery Grid if available */}
            {galleryPhotos.length > 0 && (
              <Reveal className="rounded-[28px] border border-slate-100 bg-white p-7 shadow-card">
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Camera size={20} className="text-orange-500" /> Photo Gallery
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {galleryPhotos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
                      <Image src={photo} alt={`${name} gallery ${idx + 1}`} fill unoptimized className="object-cover transition duration-300 hover:scale-105" />
                    </div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Sidebar Quick Info (Col 1/3) */}
          <div className="space-y-6">
            <Reveal className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-card">
              <h3 className="font-heading text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Activity Details
              </h3>

              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <Music size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</span>
                    <p className="text-sm font-semibold text-slate-800">{activityName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</span>
                    <p className="text-sm font-semibold text-slate-800">{cityName}</p>
                    <p className="text-xs text-slate-500">{cityRegion}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Best time to visit</span>
                    <p className="text-sm font-semibold text-slate-800">{bestTime}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/experiences"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-orange-500 shadow-md"
                >
                  <ArrowLeft size={16} /> Explore All Experiences
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Gallery / More moments in {City} Section (Matching User Screenshot 2) */}
        {relatedItems.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <Reveal>
              <h2 className="font-heading text-3xl font-black text-slate-900 sm:text-4xl">
                More <span className="text-orange-500">{activityName}</span> moments in <span className="text-orange-500">{cityName}</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Explore related experiences through their stories and images
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Large Featured Item (Left Card in Screenshot 2) */}
              {relatedItems[0] && (
                <Reveal key={relatedItems[0]._id ?? relatedItems[0].id} className="md:col-span-2">
                  <Link
                    href={`/things-to-do/${encodeURIComponent(String(relatedItems[0]._id ?? relatedItems[0].id ?? relatedItems[0].slug))}`}
                    className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-slate-100 bg-slate-100 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-2xl md:aspect-auto md:h-full"
                  >
                    {resolveApiAssetUrl(relatedItems[0].hero_image) ? (
                      <Image
                        src={resolveApiAssetUrl(relatedItems[0].hero_image)}
                        alt={relatedItems[0].name_en}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 66vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-orange-50 text-orange-400">
                        <Camera size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                        <Camera size={12} /> {activityName}
                      </span>
                      <h3 className="mt-3 font-heading text-2xl font-bold text-white sm:text-3xl">
                        {language === 'am' ? relatedItems[0].name_am : relatedItems[0].name_en}
                      </h3>
                      <p className="mt-2 line-clamp-2 max-w-xl text-sm text-slate-200">
                        {language === 'am' ? relatedItems[0].description_am : relatedItems[0].description_en}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              )}

              {/* Smaller Cards Stack (Right Column Cards in Screenshot 2) */}
              <div className="grid gap-6">
                {relatedItems.slice(1, 3).map((relItem) => {
                  const relId = relItem._id ?? relItem.id ?? relItem.slug;
                  const relName = language === 'am' ? relItem.name_am : relItem.name_en;
                  const relDesc = language === 'am' ? relItem.description_am : relItem.description_en;
                  const relImg = resolveApiAssetUrl(relItem.hero_image);

                  return (
                    <Reveal key={relId}>
                      <Link
                        href={`/things-to-do/${encodeURIComponent(String(relId))}`}
                        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-slate-100 bg-slate-100 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-xl"
                      >
                        {relImg ? (
                          <Image
                            src={relImg}
                            alt={relName}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-orange-50 text-orange-400">
                            <Compass size={36} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                            <Camera size={10} /> {activityName}
                          </span>
                          <h4 className="mt-2 font-heading text-lg font-bold text-white">
                            {relName}
                          </h4>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-200">
                            {relDesc}
                          </p>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </PageShell>
    </Layout>
  );
}
