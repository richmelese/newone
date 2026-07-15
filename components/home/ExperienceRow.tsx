import type { ReactNode } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import Carousel from '@/components/ui/Carousel';
import CategoryCard from '@/components/destination/CategoryCard';
import PageShell from '@/components/layout/PageShell';

type ExperienceRowProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  categoryPairs: { destinationSlug: string; category: string }[];
  action?: ReactNode;
};

export default function ExperienceRow({ eyebrow, title, subtitle, categoryPairs, action }: ExperienceRowProps) {
  if (categoryPairs.length === 0) return null;

  return (
    <section className="bg-white py-10 sm:py-12">
      <PageShell>
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} action={action} className="mb-6" />
        <Carousel>
          {categoryPairs.map((pair, i) => (
            <div key={`${pair.destinationSlug}-${pair.category}`} className="w-64 shrink-0 snap-start sm:w-72">
              <CategoryCard destinationSlug={pair.destinationSlug} category={pair.category} revealIndex={i} />
            </div>
          ))}
        </Carousel>
      </PageShell>
    </section>
  );
}
