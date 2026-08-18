import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Compass, ImageIcon, MapPin } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PageHero from '@/components/layout/PageHero';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Spinner from '@/components/ui/Spinner';
import { destinations } from '@/data/destinations';
import { resolveApiAssetUrl, thingsToDoApi, type ThingsToDo } from '@/lib/api';
import { useLanguage } from '@/lib/language';

function recordId(record?: { id?: string | number; _id?: string } | null) {
  const id = record?.id ?? record?._id;
  return id === undefined ? '' : String(id);
}

function cityKey(item: ThingsToDo) {
  return typeof item.city === 'string' ? item.city : recordId(item.city) || item.city.name_en;
}

export default function ExperiencesPage() {
  const { language, t } = useLanguage();
  const [items, setItems] = useState<ThingsToDo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setItems(await thingsToDoApi.list());
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to load things to do.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const groups = useMemo(() => {
    const grouped = new Map<string, { name: string; items: ThingsToDo[] }>();
    items.forEach((item) => {
      const key = cityKey(item) || 'ethiopia';
      const cityName = typeof item.city === 'object'
        ? (language === 'am' ? item.city.name_am : item.city.name_en) || item.city.name_en
        : 'Ethiopia';
      const group = grouped.get(key) ?? { name: cityName, items: [] };
      group.items.push(item);
      grouped.set(key, group);
    });
    return Array.from(grouped.entries()).sort(([, first], [, second]) => first.name.localeCompare(second.name));
  }, [items, language]);

  return (
    <Layout seo={{ title: t.navExperiences, description: t.experiencesSubtitle, path: '/experiences' }}>
      <PageHero photo={destinations[3].heroPhoto} title={t.experiencesTitle} subtitle={t.experiencesSubtitle} />
      <PageShell className="py-8">
        <Breadcrumbs items={[{ label: t.breadcrumbHome, href: '/' }, { label: t.navExperiences }]} />

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center"><Spinner /></div>
        ) : error ? (
          <div className="mt-8"><ErrorState title="Could not load things to do" subtitle={error} retryLabel="Try again" onRetry={() => void load()} /></div>
        ) : groups.length === 0 ? (
          <div className="mt-8"><EmptyState title="No things to do found" subtitle="New activities will appear here once they are added." icon={Compass} /></div>
        ) : (
          <div className="mt-8 space-y-10">
            {groups.map(([key, group]) => (
              <section key={key}>
                <h2 className="mb-5 font-heading text-3xl font-extrabold text-primary-900">{group.name}</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item, index) => {
                    const id = recordId(item);
                    const name = language === 'am' ? item.name_am : item.name_en;
                    const description = language === 'am' ? item.description_am : item.description_en;
                    const image = resolveApiAssetUrl(item.hero_image);
                    const activityName = typeof item.activity === 'object'
                      ? (language === 'am' ? item.activity.name_am : item.activity.name_en)
                      : '';
                    return (
                      <Link
                        key={id || `${item.slug}-${index}`}
                        href={`/things-to-do/${encodeURIComponent(id || item.slug)}`}
                        className="group overflow-hidden rounded-card-lg bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                          {image ? (
                            <Image src={image} alt={name} fill unoptimized sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-ink-300"><ImageIcon size={42} /></div>
                          )}
                          {activityName && <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-3 py-1 text-xs font-bold text-primary-800 shadow-sm">{activityName}</span>}
                        </div>
                        <div className="p-4">
                          <h3 className="font-heading text-lg font-extrabold text-primary-900 transition group-hover:text-primary-700">{name}</h3>
                          {typeof item.city === 'object' && (
                            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-ink-400"><MapPin size={12} />{language === 'am' ? item.city.name_am : item.city.name_en}</p>
                          )}
                          {description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">{description}</p>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </PageShell>
    </Layout>
  );
}
