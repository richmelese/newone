import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CalendarDays } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import { blogsApi, resolveApiAssetUrl, type Blog } from '@/lib/api';

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(date);
}

export default function BlogDetailPage() {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : undefined;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBlog = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      setBlog(await blogsApi.getById(id));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load this blog.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void loadBlog(); }, [loadBlog]);

  if (loading || !router.isReady) {
    return <Layout seo={{ title: 'Blog', description: 'Loading blog article.', path: id ? `/blogs/${id}` : '/blogs' }}><div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div></Layout>;
  }

  if (error || !blog) {
    return <Layout seo={{ title: 'Blog not found', description: 'The requested blog could not be loaded.', noindex: true }}><PageShell className="py-12"><ErrorState title="Could not load this blog" subtitle={error || 'The requested article was not found.'} retryLabel="Try again" onRetry={() => void loadBlog()} /></PageShell></Layout>;
  }

  const image = resolveApiAssetUrl(blog.picture);
  const published = formatDate(blog.created_at);

  return (
    <Layout seo={{ title: blog.title, description: blog.description.slice(0, 160), image: image || undefined, path: `/blogs/${id}` }}>
      <PageShell className="pt-8 sm:pt-10">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blogs' }, { label: blog.title }]} />
        <article className="mx-auto max-w-4xl py-10">
          {published && <p className="flex items-center gap-2 text-sm font-semibold text-ink-400"><CalendarDays size={16} /> {published}</p>}
          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-primary-900 sm:text-5xl">{blog.title}</h1>
          {image && <div className="mt-8 overflow-hidden rounded-[1.5rem] bg-neutral-100 shadow-card"><img src={image} alt={blog.title} className="max-h-[34rem] w-full object-cover" /></div>}
          <div className="whitespace-pre-line py-10 text-base leading-8 text-ink-600 sm:text-lg">{blog.description}</div>
        </article>
      </PageShell>
    </Layout>
  );
}
