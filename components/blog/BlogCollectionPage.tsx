import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowRight, BookOpen, CalendarDays, Search } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import { activitiesApi, blogsApi, citiesApi, resolveApiAssetUrl, type Activity, type Blog, type City } from '@/lib/api';
import { useLanguage } from '@/lib/language';

type BlogScope = 'all' | 'city' | 'activity';

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
}

export default function BlogCollectionPage({ scope = 'all', scopeId }: { scope?: BlogScope; scopeId?: string }) {
  const router = useRouter();
  const { language } = useLanguage();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [lookupsLoading, setLookupsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const heading = scope === 'city' ? 'Stories from this destination' : scope === 'activity' ? 'Stories about this activity' : 'Travel stories, culture and guides';
  const subtitle = scope === 'all' ? 'Explore practical guides and inspiring stories for discovering Ethiopia.' : 'Explore related travel stories, local insight, and practical guides.';

  const loadBlogs = useCallback(async () => {
    if (scope !== 'all' && !scopeId) return;
    setLoading(true);
    setError('');
    try {
      const result = scope === 'city'
        ? await blogsApi.listByCity(scopeId as string)
        : scope === 'activity'
          ? await blogsApi.listByActivity(scopeId as string)
          : await blogsApi.list();
      setBlogs(result);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load blog posts.');
    } finally {
      setLoading(false);
    }
  }, [scope, scopeId]);

  useEffect(() => { void loadBlogs(); }, [loadBlogs]);

  useEffect(() => {
    let cancelled = false;
    setLookupsLoading(true);
    Promise.all([citiesApi.list(), activitiesApi.list()])
      .then(([cityItems, activityItems]) => {
        if (cancelled) return;
        setCities(cityItems);
        setActivities(activityItems);
      })
      .catch(() => {
        if (cancelled) return;
        setCities([]);
        setActivities([]);
      })
      .finally(() => {
        if (!cancelled) setLookupsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return blogs;
    return blogs.filter((blog) => `${blog.title} ${blog.description}`.toLowerCase().includes(value));
  }, [blogs, query]);

  return (
    <Layout seo={{ title: heading, description: subtitle, path: scope === 'all' ? '/blogs' : undefined }}>
      <PageShell className="pt-8 sm:pt-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: scope === 'all' ? undefined : '/blogs' }, ...(scope === 'all' ? [] : [{ label: scope === 'city' ? 'Destination stories' : 'Activity stories' }])]} />
        <section className="mt-8 overflow-hidden rounded-[2rem] bg-primary-900 px-6 py-12 text-white shadow-hero sm:px-10 lg:px-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-300">Stories from Ethiopia</p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-extrabold sm:text-5xl">{heading}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-100">{subtitle}</p>
        </section>

        <section className="py-12">
          <div className="mb-7 grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem_14rem]">
            <div className="relative">
              <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search blog posts..." className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-11 pr-4 text-sm outline-none focus:border-primary-300 focus:bg-white" />
            </div>
            <select
              aria-label="Filter blogs by city"
              value={scope === 'city' ? scopeId ?? '' : ''}
              disabled={lookupsLoading}
              onChange={(event) => void router.push(event.target.value ? `/blogs/city/${event.target.value}` : '/blogs')}
              className="h-12 rounded-xl border border-neutral-200 bg-neutral-100 px-4 text-sm font-semibold text-ink-600 outline-none focus:border-primary-300 focus:bg-white disabled:opacity-60"
            >
              <option value="">{lookupsLoading ? 'Loading cities…' : 'All cities'}</option>
              {cities.map((city) => {
                const id = city.id ?? city._id;
                if (id === undefined) return null;
                return <option key={id} value={id}>{language === 'am' ? city.name_am : city.name_en}</option>;
              })}
            </select>
            <select
              aria-label="Filter blogs by activity"
              value={scope === 'activity' ? scopeId ?? '' : ''}
              disabled={lookupsLoading}
              onChange={(event) => void router.push(event.target.value ? `/blogs/activity/${event.target.value}` : '/blogs')}
              className="h-12 rounded-xl border border-neutral-200 bg-neutral-100 px-4 text-sm font-semibold text-ink-600 outline-none focus:border-primary-300 focus:bg-white disabled:opacity-60"
            >
              <option value="">{lookupsLoading ? 'Loading activities…' : 'All activities'}</option>
              {activities.map((activity) => {
                const id = activity.id ?? activity._id;
                if (id === undefined) return null;
                return <option key={id} value={id}>{language === 'am' ? activity.name_am : activity.name_en}</option>;
              })}
            </select>
          </div>

          {loading ? (
            <div className="flex min-h-72 items-center justify-center"><Spinner /></div>
          ) : error ? (
            <ErrorState title="Could not load the blog" subtitle={error} retryLabel="Try again" onRetry={() => void loadBlogs()} />
          ) : filtered.length === 0 ? (
            <EmptyState title={query ? 'No posts match your search' : 'No blog posts found'} subtitle={query ? 'Try a different title or keyword.' : 'There are no stories connected to this selection yet.'} icon={BookOpen} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((blog, index) => {
                const id = blog.id ?? blog._id;
                const image = resolveApiAssetUrl(blog.picture);
                return (
                  <article key={id ?? `${blog.title}-${index}`} className="group overflow-hidden rounded-card-lg border border-neutral-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
                    <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
                      {image ? <img src={image} alt={blog.title} onError={(event) => { event.currentTarget.style.display = 'none'; }} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-ink-300"><BookOpen size={40} /></div>}
                    </div>
                    <div className="p-5">
                      {formatDate(blog.created_at) && <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-400"><CalendarDays size={13} /> {formatDate(blog.created_at)}</p>}
                      <h2 className="mt-3 font-heading text-xl font-extrabold leading-snug text-primary-900">{blog.title}</h2>
                      <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink-500">{blog.description}</p>
                      {id !== undefined && <Link href={`/blogs/${id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary-700 hover:text-primary-900">Read article <ArrowRight size={15} /></Link>}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </PageShell>
    </Layout>
  );
}
