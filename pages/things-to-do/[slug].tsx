import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowLeft, Compass } from 'lucide-react';
import { resolveApiAssetUrl, thingsToDoApi, type ThingsToDo } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';

export default function ThingsToDoDetailPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [item, setItem] = useState<ThingsToDo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const slugOrId = typeof router.query.slug === 'string' ? router.query.slug : '';

  const loadItem = useCallback(async () => {
    if (!slugOrId) return;
    setLoading(true);
    setError('');
    try {
      // Primary endpoint: GET /things-to-do/{id}
      const fetched = await thingsToDoApi.getById(slugOrId);
      setItem(fetched);
    } catch {
      // Fallback endpoint: GET /things-to-do/slug/{slug}
      try {
        const fetchedBySlug = await thingsToDoApi.getBySlug(slugOrId);
        setItem(fetchedBySlug);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'Unable to load this activity.');
        setItem(null);
      }
    } finally {
      setLoading(false);
    }
  }, [slugOrId]);

  useEffect(() => {
    if (router.isReady && slugOrId) {
      void loadItem();
    }
  }, [router.isReady, slugOrId, loadItem]);

  if (!router.isReady || loading) {
    return (
      <Layout seo={{ title: 'Things to do', description: 'Loading activity details...' }}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner />
        </div>
      </Layout>
    );
  }

  const name = item ? (language === 'am' ? item.name_am : item.name_en) : 'Activity';
  const description = item ? (language === 'am' ? item.description_am : item.description_en) : '';
  const image = resolveApiAssetUrl(item?.hero_image);

  return (
    <Layout seo={{ title: name, description: description || t.experiencesSubtitle, image: image || undefined, path: `/things-to-do/${slugOrId}` }}>
      <PageShell className="py-8">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.navExperiences, href: '/experiences' }, { label: name }]} />
        {error || !item ? (
          <div className="mt-8">
            <ErrorState title="Could not load this activity" subtitle={error || 'Activity not found.'} retryLabel="Back to Things to do" onRetry={() => void router.push('/experiences')} />
          </div>
        ) : (
          <article className="mt-8 overflow-hidden rounded-card-lg bg-white shadow-card">
            {image && (
              <div className="relative aspect-[16/7]">
                <Image src={image} alt={name} fill priority unoptimized sizes="100vw" className="object-cover" />
              </div>
            )}
            <div className="p-7 sm:p-10">
              <Button href="/experiences" variant="ghost" size="sm" className="-ml-4 mb-5">
                <ArrowLeft size={16} /> Back to {t.navExperiences}
              </Button>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-800">
                <Compass size={26} />
              </span>
              <h1 className="mt-5 font-heading text-3xl font-extrabold text-ink-900 sm:text-4xl">{name}</h1>
              <p className="mt-4 max-w-3xl whitespace-pre-line leading-relaxed text-ink-600">{description}</p>
            </div>
          </article>
        )}
      </PageShell>
    </Layout>
  );
}
