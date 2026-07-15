import Image from 'next/image';
import PageShell from './PageShell';
import Reveal from '@/components/ui/Reveal';

type PageHeroProps = {
  photo: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
};

export default function PageHero({ photo, title, subtitle, eyebrow }: PageHeroProps) {
  const directRemoteImage = photo.includes('commons.wikimedia.org');

  return (
    <section className="relative flex min-h-[260px] items-end overflow-hidden sm:min-h-[300px]">
      <Image src={photo} alt="" fill priority unoptimized={directRemoteImage} sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-hero-scrim" />
      <PageShell className="relative pb-8 pt-24 text-white">
        <Reveal>
          {eyebrow && <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-accent-300">{eyebrow}</p>}
          <h1 className="max-w-2xl font-heading text-2xl font-extrabold sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">{subtitle}</p>}
        </Reveal>
      </PageShell>
    </section>
  );
}
