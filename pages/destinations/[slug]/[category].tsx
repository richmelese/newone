import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { getDestination } from '@/data/destinations';
import {
  getDestinationCategoryPairs,
  getExperiencesByDestination,
  getExperiencesByDestinationAndCategory,
  getExperienceFromPrice,
} from '@/data/experiences';
import { slugify } from '@/lib/format';
import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ExperienceCard from '@/components/destination/ExperienceCard';
import Reveal from '@/components/ui/Reveal';
import type { Destination, Experience } from '@/types';

type SortOption = 'featured' | 'name-asc' | 'name-desc' | 'price-asc';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getDestinationCategoryPairs().map(({ destinationSlug, category }) => ({
    params: { slug: destinationSlug, category: slugify(category) },
  })),
  fallback: false,
});

type CategoryPageProps = {
  destination: Destination;
  category: string;
  items: Experience[];
  otherCategories: string[];
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
  const destinationSlug = params?.slug as string;
  const categorySlug = params?.category as string;

  const destination = getDestination(destinationSlug);
  if (!destination) return { notFound: true };

  const pair = getDestinationCategoryPairs().find(
    (p) => p.destinationSlug === destinationSlug && slugify(p.category) === categorySlug,
  );
  if (!pair) return { notFound: true };

  const items = getExperiencesByDestinationAndCategory(destinationSlug, pair.category);
  if (items.length === 0) return { notFound: true };

  const otherCategories = Array.from(new Set(getExperiencesByDestination(destinationSlug).map((e) => e.category))).filter(
    (c) => c !== pair.category,
  );

  return { props: { destination, category: pair.category, items, otherCategories } };
};

export default function DestinationCategoryPage({ destination, category, items, otherCategories }: CategoryPageProps) {
  const { t, pick } = useLanguage();
  const [sort, setSort] = useState<SortOption>('featured');

  const sortedItems = useMemo(() => {
    const sorted = [...items];
    if (sort === 'name-asc') sorted.sort((a, b) => pick(a.name).localeCompare(pick(b.name)));
    else if (sort === 'name-desc') sorted.sort((a, b) => pick(b.name).localeCompare(pick(a.name)));
    else if (sort === 'price-asc') {
      sorted.sort((a, b) => {
        const priceA = getExperienceFromPrice(a);
        const priceB = getExperienceFromPrice(b);
        if (priceA === undefined) return priceB === undefined ? 0 : 1;
        if (priceB === undefined) return -1;
        return priceA - priceB;
      });
    }
    return sorted;
  }, [items, sort, pick]);

  return (
    <Layout
      seo={{
        title: `${category} in ${destination.name}`,
        description: `${category} in ${destination.name}, Ethiopia — ${items.length} to explore.`,
        image: destination.heroPhoto,
        path: `/destinations/${destination.slug}/${slugify(category)}`,
      }}
    >
      <section className="relative flex min-h-[300px] items-end overflow-hidden sm:min-h-[360px]">
        <Image
          src={destination.heroPhoto}
          alt={destination.name}
          fill
          priority
          unoptimized={destination.heroPhoto.includes('commons.wikimedia.org')}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-hero-scrim" />
        <PageShell className="relative pb-10 pt-28 text-white">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-300">{destination.name}</p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">{category}</h1>
          </Reveal>
        </PageShell>
      </section>

      <PageShell className="py-8">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: t.navDestinations, href: '/destinations' },
            { label: destination.name, href: `/destinations/${destination.slug}` },
            { label: category },
          ]}
        />

        {otherCategories.length > 0 && (
          <Reveal className="mt-6">
            <p className="text-sm font-semibold text-ink-500">
              {t.moreCategoriesLabel} {destination.name}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <span className="rounded-pill border border-primary-600 bg-primary-600 px-3.5 py-1.5 text-sm font-medium text-white">
                {category}
              </span>
              {otherCategories.map((c) => (
                <Link
                  key={c}
                  href={`/destinations/${destination.slug}/${slugify(c)}`}
                  className="rounded-pill border border-neutral-300 bg-white px-3.5 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:border-primary-400 hover:text-primary-700"
                >
                  {c}
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-ink-500">
            {items.length} {category} {t.placesCount}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden font-medium text-ink-500 sm:inline">{t.sortLabel}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-pill border border-neutral-300 bg-white px-3.5 py-2 text-sm font-semibold text-ink-800 outline-none focus:border-primary-500"
            >
              <option value="featured">{t.sortFeatured}</option>
              <option value="name-asc">{t.sortNameAsc}</option>
              <option value="name-desc">{t.sortNameDesc}</option>
              <option value="price-asc">{t.sortPriceAsc}</option>
            </select>
          </label>
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedItems.map((exp, i) => (
            <ExperienceCard key={exp.id} experience={exp} revealIndex={i} />
          ))}
        </div>
      </PageShell>
    </Layout>
  );
}
