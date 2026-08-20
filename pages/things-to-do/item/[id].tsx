import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Compass, ImageIcon, MapPin, Sparkles, Building2, CheckCircle2, Maximize2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/components/ui/ErrorState';
import Lightbox from '@/components/ui/Lightbox';
import { resolveApiAssetUrl, thingsToDoApi, galleriesApi, type ThingsToDo, type City, type Activity } from '@/lib/api';
import { useLanguage } from '@/lib/language';

function recordId(record?: { id?: string | number; _id?: string } | null) {
  const id = record?.id ?? record?._id;
  return id === undefined ? '' : String(id);
}

export default function ThingToDoItemDetailPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [item, setItem] = useState<ThingsToDo | null>(null);
  const [cityGalleries, setCityGalleries] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const itemId = typeof router.query.id === 'string' ? router.query.id : '';

  const loadItem = useCallback(async () => {
    if (!itemId) return;
    setLoading(true);
    setError('');

    try {
      // 1. Try GET /things-to-do/:id
      let fetched: ThingsToDo | null = null;
      try {
        fetched = await thingsToDoApi.getById(itemId);
      } catch {
        // 2. Try GET /things-to-do/slug/:slug
        try {
          fetched = await thingsToDoApi.getBySlug(itemId);
        } catch {
          // 3. Fallback to list search
          const all = await thingsToDoApi.list();
          fetched = all.find((i) => recordId(i) === itemId || i.slug === itemId) ?? null;
        }
      }

      if (fetched) {
        setItem(fetched);

        // Fetch city galleries
        const cityId =
          typeof fetched.city === 'object' && fetched.city
            ? recordId(fetched.city)
            : typeof fetched.city === 'string'
              ? fetched.city
              : '';

        if (cityId) {
          try {
            const gals = await galleriesApi.listByCity(cityId);
            const collected: string[] = [];
            gals.forEach((g) => {
              if (Array.isArray(g.images)) {
                g.images.forEach((img) => {
                  const url = typeof img === 'string' ? img : img?.url || img?.path;
                  if (url) collected.push(resolveApiAssetUrl(url));
                });
              }
            });
            setCityGalleries(collected);
          } catch {
            // fallback gracefully
          }
        }
      } else {
        setError('This experience or attraction could not be found.');
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load details.');
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    if (router.isReady && itemId) {
      void loadItem();
    }
  }, [router.isReady, itemId, loadItem]);

  const name = language === 'am' ? item?.name_am || item?.name_en || '' : item?.name_en || '';
  const description = language === 'am' ? item?.description_am || item?.description_en || '' : item?.description_en || '';
  const heroImage = resolveApiAssetUrl(item?.hero_image) || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&auto=format&fit=crop&q=80';

  const activityObj = typeof item?.activity === 'object' && item?.activity ? (item.activity as Activity) : null;
  const activityName = activityObj
    ? (language === 'am' ? activityObj.name_am || activityObj.name_en : activityObj.name_en)
    : 'Activity';
  const activityUrlId = activityObj ? (recordId(activityObj) || activityObj.slug || '') : (typeof item?.activity === 'string' ? item.activity : '');

  const cityObj = typeof item?.city === 'object' && item?.city ? (item.city as City) : null;
  const cityName = cityObj
    ? (language === 'am' ? cityObj.name_am || cityObj.name_en : cityObj.name_en)
    : typeof item?.city === 'string'
      ? item.city
      : '';
  const cityRegion = cityObj?.region || '';
  const citySlug = cityObj?.slug || recordId(cityObj) || '';

  // Consolidate all gallery photos
  const allGalleryPhotos = useMemo(() => {
    const list: string[] = [];

    // 1. Direct item gallery images
    if (Array.isArray(item?.gallery)) {
      item.gallery.forEach((photo) => {
        const src = typeof photo === 'string' ? photo : (photo as { url?: string; path?: string })?.url || (photo as { path?: string })?.path;
        if (src) list.push(resolveApiAssetUrl(src));
      });
    }

    // 2. Item hero image
    if (item?.hero_image) {
      const hero = resolveApiAssetUrl(item.hero_image);
      if (hero && !list.includes(hero)) list.push(hero);
    }

    // 3. City galleries
    cityGalleries.forEach((src) => {
      if (src && !list.includes(src)) list.push(src);
    });

    // 4. City hero image
    if (cityObj?.hero_image) {
      const cityHero = resolveApiAssetUrl(cityObj.hero_image);
      if (cityHero && !list.includes(cityHero)) list.push(cityHero);
    }

    // 5. Rich curated fallback photos if needed
    if (list.length < 4) {
      const fallbacks = [
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80',
      ];
      fallbacks.forEach((src) => {
        if (!list.includes(src)) list.push(src);
      });
    }

    return Array.from(new Set(list.filter(Boolean)));
  }, [item, cityGalleries, cityObj]);

  if (!router.isReady || loading) {
    return (
      <Layout seo={{ title: 'Things to do', description: 'Loading details...' }}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout seo={{ title: 'Not Found', description: 'Experience not found.' }}>
        <PageShell className="py-16 sm:py-24">
          <ErrorState
            title="Experience Not Found"
            subtitle={error || 'The requested experience could not be loaded.'}
            retryLabel="Back to Things to do"
            onRetry={() => void router.push('/things-to-do')}
          />
        </PageShell>
      </Layout>
    );
  }

  return (
    <Layout
      overlapHeader={true}
      seo={{
        title: `${name} — ${cityName || 'Ethiopia'}`,
        description: description ? description.slice(0, 160) : 'Explore top things to do in Ethiopia.',
        image: heroImage || undefined,
        path: `/things-to-do/item/${itemId}`,
      }}
    >
      {/* Full-bleed Hero Banner */}
      <section className="relative flex min-h-[380px] items-center justify-center overflow-hidden sm:min-h-[460px]">
        {heroImage ? (
          <img
            src={heroImage}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&auto=format&fit=crop&q=80';
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-primary-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/40" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 pb-12 pt-28 text-center text-white sm:pb-16 sm:pt-36">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {activityName && (
              <span className="rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {activityName}
              </span>
            )}
            {cityName && (
              <span className="flex items-center gap-1 rounded-full bg-primary-600/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                <MapPin size={12} /> {cityName}
              </span>
            )}
          </div>

          <h1 className="mt-4 font-heading text-3xl font-black tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
            {name}
          </h1>

          {cityName && (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold text-white/90 drop-shadow-sm sm:text-base">
              <MapPin size={16} className="text-[#f26a1b]" />
              {cityName}
              {cityRegion ? `, ${cityRegion}` : ''}
            </p>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <PageShell className="py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: language === 'am' ? 'መዝናኛዎች' : 'Things to do', href: '/things-to-do' },
            ...(activityName && activityUrlId
              ? [{ label: activityName, href: `/things-to-do/${encodeURIComponent(activityUrlId)}` }]
              : []),
            { label: name },
          ]}
        />

        {/* Back Link */}
        <div className="mt-5">
          <Link
            href={activityUrlId ? `/things-to-do/${encodeURIComponent(activityUrlId)}` : '/things-to-do'}
            className="inline-flex items-center gap-2 text-sm font-bold text-ink-600 transition-colors hover:text-primary-700"
          >
            <ArrowLeft size={16} />
            {activityName ? `Back to ${activityName}` : 'Back to Things to do'}
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Info (2 cols) */}
          <div className="space-y-8 lg:col-span-2">
            {/* Overview / Story Card */}
            <div className="rounded-[28px] border border-neutral-200/90 bg-white p-6 shadow-sm sm:p-9">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <Sparkles size={20} />
                </span>
                <h2 className="font-heading text-2xl font-bold text-ink-900">
                  {language === 'am' ? 'ስለ ስፍራው' : 'About this experience'}
                </h2>
              </div>

              <div className="mt-5 text-base leading-relaxed text-ink-700 sm:text-lg">
                <p className="whitespace-pre-line">{description}</p>
              </div>

              {/* Highlights */}
              <div className="mt-8 grid grid-cols-1 gap-3 border-t border-neutral-100 pt-6 sm:grid-cols-2">
                <div className="flex items-center gap-2.5 rounded-2xl bg-neutral-50 p-3.5 text-sm font-semibold text-ink-800">
                  <CheckCircle2 size={18} className="text-primary-600 shrink-0" />
                  <span>Verified & curated venue</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl bg-neutral-50 p-3.5 text-sm font-semibold text-ink-800">
                  <CheckCircle2 size={18} className="text-primary-600 shrink-0" />
                  <span>Authentic Ethiopian experience</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl bg-neutral-50 p-3.5 text-sm font-semibold text-ink-800">
                  <CheckCircle2 size={18} className="text-primary-600 shrink-0" />
                  <span>Walk-ins & bookings welcome</span>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl bg-neutral-50 p-3.5 text-sm font-semibold text-ink-800">
                  <CheckCircle2 size={18} className="text-primary-600 shrink-0" />
                  <span>Local guide recommended</span>
                </div>
              </div>
            </div>

            {/* Photo Gallery with Lightbox support */}
            {allGalleryPhotos.length > 0 && (
              <div className="rounded-[28px] border border-neutral-200/90 bg-white p-6 shadow-sm sm:p-9">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                      <ImageIcon size={20} />
                    </span>
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-ink-900">
                        {language === 'am' ? 'የፎቶ ማዕከለ-ስዕላት' : 'Photo Gallery'}
                      </h2>
                      <p className="text-xs text-ink-400">
                        {allGalleryPhotos.length} {allGalleryPhotos.length === 1 ? 'photo' : 'photos'} available
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {allGalleryPhotos.map((photoSrc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100 text-left transition focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <img
                        src={photoSrc}
                        alt={`${name} photo ${i + 1}`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                      <div className="absolute bottom-2 right-2 rounded-lg bg-black/60 p-1.5 text-white opacity-0 transition group-hover:opacity-100">
                        <Maximize2 size={14} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (1 col) */}
          <div className="space-y-6">
            {/* Location & City Info Card */}
            {cityObj && (
              <div className="overflow-hidden rounded-[28px] border border-neutral-200/90 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-primary-700" />
                  <h3 className="font-heading text-lg font-bold text-ink-900">
                    {language === 'am' ? 'መዳረሻ ከተማ' : 'Destination'}
                  </h3>
                </div>

                {cityObj.hero_image && (
                  <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-100">
                    <img
                      src={resolveApiAssetUrl(cityObj.hero_image)}
                      alt={cityName}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                      <p className="font-heading text-base font-extrabold">{cityName}</p>
                      {cityRegion && <p className="text-xs text-white/80">{cityRegion}</p>}
                    </div>
                  </div>
                )}

                {cityObj.description_en && (
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-500">
                    {language === 'am' ? cityObj.description_am || cityObj.description_en : cityObj.description_en}
                  </p>
                )}

                {citySlug && (
                  <Link
                    href={`/destinations/${encodeURIComponent(citySlug)}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-primary-700 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-primary-800"
                  >
                    <Compass size={16} /> Explore {cityName}
                  </Link>
                )}
              </div>
            )}

            {/* Category Quick Card */}
            {activityObj && (
              <div className="rounded-[28px] border border-neutral-200/90 bg-white p-6 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#f26a1b]">
                  {language === 'am' ? 'የመዝናኛ ዘርፍ' : 'Activity Category'}
                </span>
                <h4 className="mt-1 font-heading text-xl font-bold text-ink-900">{activityName}</h4>
                <p className="mt-2 text-sm text-ink-500">
                  Discover more curated venues and experiences in {activityName}.
                </p>

                {activityUrlId && (
                  <Link
                    href={`/things-to-do/${encodeURIComponent(activityUrlId)}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:underline"
                  >
                    View all in {activityName} <ArrowLeft size={14} className="rotate-180" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </PageShell>

      {/* Full-Screen Lightbox modal */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={allGalleryPhotos}
          index={lightboxIndex}
          alt={name}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </Layout>
  );
}
