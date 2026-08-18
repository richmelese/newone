import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Compass } from 'lucide-react';
import { activitiesApi, type Activity } from '@/lib/api';
import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Spinner from '@/components/ui/Spinner';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';

export default function ActivityDetailPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [error, setError] = useState('');

  const id = typeof router.query.id === 'string' ? router.query.id : '';

  useEffect(() => {
    if (!router.isReady || !id) return;
    setError('');
    setActivity(null);
    activitiesApi.getById(id)
      .then(setActivity)
      .catch((caughtError) => setError(caughtError instanceof Error ? caughtError.message : 'Unable to load this activity.'));
  }, [id, router.isReady]);

  const name = activity ? (language === 'am' ? activity.name_am : activity.name_en) : t.navExperiences;
  const translation = activity ? (language === 'am' ? activity.name_en : activity.name_am) : '';

  return (
    <Layout seo={{ title: name, description: activity ? `${activity.name_en} — ${activity.name_am}` : t.experiencesSubtitle, path: `/activities/${id}` }}>
      <PageShell className="py-8">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.navExperiences, href: '/experiences' }, { label: name }]} />
        {error ? (
          <div className="mt-8"><ErrorState title="Could not load activity" subtitle={error} retryLabel="Back to activities" onRetry={() => void router.push('/experiences')} /></div>
        ) : !activity ? (
          <div className="flex min-h-72 items-center justify-center"><Spinner /></div>
        ) : (
          <article className="mt-8 rounded-card-lg border border-neutral-200 bg-white p-8 shadow-card sm:p-12">
            <Button href="/experiences" variant="ghost" size="sm" className="-ml-4 mb-6">
              <ArrowLeft size={16} /> Back to {t.navExperiences}
            </Button>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-800"><Compass size={30} /></span>
            <h1 className="mt-6 font-heading text-3xl font-extrabold text-ink-900 sm:text-4xl">{name}</h1>
            {translation && translation !== name && <p className="mt-2 text-lg text-ink-500">{translation}</p>}
          </article>
        )}
      </PageShell>
    </Layout>
  );
}
