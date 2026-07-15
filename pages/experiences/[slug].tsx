import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { MapPin, ArrowRight, Calendar, Ticket, Home, Clock, Users, Minus, Plus, Sparkles, Camera } from 'lucide-react';
import { experiences, getExperience, getExperiencesByDestination } from '@/data/experiences';
import { getDestination } from '@/data/destinations';
import { getHotelsByDestination } from '@/data/hotels';
import { getExperienceRating, getExperienceReviews, getExperienceHours, hasReviewsEnabled } from '@/lib/experienceMock';
import { useLanguage } from '@/lib/language';
import Layout from '@/components/layout/Layout';
import PageShell from '@/components/layout/PageShell';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SectionHeader from '@/components/ui/SectionHeader';
import ExperienceCard from '@/components/destination/ExperienceCard';
import HotelCard from '@/components/hotel/HotelCard';
import HotelReviewsCarousel from '@/components/hotel/HotelReviewsCarousel';
import RatingBreakdown from '@/components/hotel/RatingBreakdown';
import Reveal from '@/components/ui/Reveal';
import RevealImage from '@/components/ui/RevealImage';
import Button from '@/components/ui/Button';
import Lightbox from '@/components/ui/Lightbox';
import type { Experience } from '@/types';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function experienceStory(category: string, destinationName: string) {
  const stories: Record<string, { intro: string }> = {
    Nightlife: {
      intro: `After dark, ${destinationName} comes alive through live music, expressive dance, late-night conversation, and warmly lit gathering places. This is a social experience as much as a performance—arrive curious and let the evening unfold at its own pace.`,
    },
    Culture: {
      intro: `Discover the living traditions of ${destinationName} through stories, artistry, faith, and everyday rituals. Look beyond the landmark itself—the people, details, and atmosphere are what make the visit memorable.`,
    },
    Nature: {
      intro: `${destinationName} rewards travelers who slow down and take in the landscape. Changing light, open views, birdsong, and fresh highland air make the journey part of the experience.`,
    },
    Food: {
      intro: `Taste ${destinationName} through the aromas, ingredients, and generous hospitality of its food culture. Meals are often shared slowly, making conversation and ceremony part of the flavor.`,
    },
  };

  return stories[category] ?? {
    intro: `Experience ${destinationName} from a more personal angle. Take time to notice the atmosphere, meet local people, and enjoy the details that make this place distinct.`,
  };
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: experiences.map((e) => ({ params: { slug: e.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ experience: Experience }> = async ({ params }) => {
  const experience = getExperience(params?.slug as string);
  if (!experience) return { notFound: true };
  return { props: { experience } };
};

export default function ExperienceDetailPage({ experience }: { experience: Experience }) {
  const { t, pick } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [serviceBackdropIndex, setServiceBackdropIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(todayIso());
  const [checkOut, setCheckOut] = useState(todayIso());
  const [guests, setGuests] = useState(1);
  const destination = getDestination(experience.destinationSlug);
  const moreInDestination = getExperiencesByDestination(experience.destinationSlug).filter((e) => e.id !== experience.id);
  const relatedVisuals = [
    ...moreInDestination.filter((item) => item.category === experience.category),
    ...moreInDestination.filter((item) => item.category !== experience.category),
  ].slice(0, 4);
  const nearbyHotels = destination ? getHotelsByDestination(destination.slug).slice(0, 3) : [];
  const description = experience.longDescription ? pick(experience.longDescription) : pick(experience.description);
  const hasServices = Boolean(experience.services && experience.services.length > 0);
  const canBook = Boolean(experience.bookable && experience.externalBookingUrl);
  const showReviewsAndHours = hasReviewsEnabled(experience.category);
  const { guestRating, reviewCount } = getExperienceRating(experience.id);
  const reviews = getExperienceReviews(experience.id);
  const hours = showReviewsAndHours ? getExperienceHours(experience.category) : undefined;
  const serviceBackdropPhotos = Array.from(
    new Set(
      [
        experience.photo,
        ...(experience.gallery ?? []),
        destination?.heroPhoto,
        ...(experience.services?.map((service) => service.photo) ?? []),
      ].filter((photo): photo is string => Boolean(photo)),
    ),
  ).slice(0, 6);
  const story = experienceStory(experience.category, destination?.name ?? 'this destination');

  useEffect(() => {
    setServiceBackdropIndex(0);
  }, [experience.id]);

  useEffect(() => {
    if (reduceMotion || serviceBackdropPhotos.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setServiceBackdropIndex((current) => (current + 1) % serviceBackdropPhotos.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [reduceMotion, serviceBackdropPhotos.length]);

  return (
    <Layout
      seo={{
        title: `${pick(experience.name)} — ${t.navExperiences}`,
        description: pick(experience.description),
        image: experience.photo,
        path: `/experiences/${experience.id}`,
      }}
    >
      <section className="relative flex min-h-[360px] items-end overflow-hidden sm:min-h-[440px]">
        <Image src={experience.photo} alt={pick(experience.name)} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-hero-scrim" />
        <PageShell className="relative pb-10 pt-32 text-white">
          <Reveal>
            <span className="inline-flex items-center rounded-pill bg-white/15 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
              {experience.category}
            </span>
            <h1 className="mt-3 max-w-2xl font-heading text-3xl font-extrabold sm:text-4xl">{pick(experience.name)}</h1>
            {destination && (
              <Link
                href={`/destinations/${destination.slug}`}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 hover:text-white"
              >
                <MapPin size={14} />
                {destination.name}
              </Link>
            )}
          </Reveal>
        </PageShell>
      </section>

      <PageShell className="py-8">
        <Breadcrumbs
          items={[
            { label: t.breadcrumbHome, href: '/' },
            { label: t.navExperiences, href: '/experiences' },
            { label: pick(experience.name) },
          ]}
        />

        <Reveal className="mt-6 max-w-3xl">
          <h2 className="font-heading text-xl font-bold text-ink-900">{t.experienceAbout}</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-600">{description}</p>

          {destination && (
            <div className="mt-5 flex flex-col gap-4 rounded-card-lg bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-primary-600" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t.experienceLocatedIn}</p>
                    <Link href={`/destinations/${destination.slug}`} className="text-sm font-semibold text-ink-900 hover:text-primary-700">
                      {destination.name}
                    </Link>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar size={16} className="mt-0.5 shrink-0 text-primary-600" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t.bestTimeToVisit}</p>
                    <p className="text-sm font-semibold text-ink-900">{pick(destination.bestTime)}</p>
                  </div>
                </div>
                {experience.address && (
                  <div className="flex items-start gap-2">
                    <Home size={16} className="mt-0.5 shrink-0 text-primary-600" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t.experienceAddress}</p>
                      <p className="text-sm font-semibold text-ink-900">{pick(experience.address)}</p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                href={`/destinations/${destination.slug}`}
                variant="secondary"
                size="sm"
                fullWidth
                className="group sm:w-auto"
              >
                {t.experienceViewDestination}
                <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </div>
          )}
        </Reveal>

        <Reveal className="mt-12 overflow-hidden rounded-[2rem] bg-primary-900 text-white shadow-hero">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative flex flex-col justify-center overflow-hidden p-7 sm:p-10 lg:p-12">
              <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl" aria-hidden="true" />
              <div className="absolute -bottom-28 right-0 h-64 w-64 rounded-full bg-primary-400/20 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-accent-300">
                  <Sparkles size={14} /> Inside the experience
                </span>
                <h2 className="mt-5 max-w-lg font-heading text-3xl font-extrabold sm:text-4xl">
                  See, hear and feel {pick(experience.name)}
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-white/75">{story.intro}</p>
              </div>
            </div>

            <div className="grid min-h-[440px] grid-cols-2 gap-1 bg-white/10 p-1">
              <div className="relative col-span-2 min-h-[255px] overflow-hidden lg:col-span-1 lg:row-span-2 lg:min-h-full">
                <Image
                  src={(experience.gallery?.[0] ?? relatedVisuals[0]?.photo) || experience.photo}
                  alt={`${pick(experience.name)} atmosphere`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 36vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/55 to-transparent" />
              </div>
              {(experience.gallery?.slice(1, 3).map((photo, index) => ({ photo, id: `${experience.id}-${index}`, name: experience.name })) ?? relatedVisuals.slice(1, 3)).map((item) => (
                <Link key={item.id} href={'destinationSlug' in item ? `/experiences/${item.id}` : '#'} className="group relative min-h-[180px] overflow-hidden">
                  <Image src={item.photo} alt={pick(item.name)} fill sizes="(max-width: 1024px) 50vw, 18vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 via-transparent to-transparent" />
                  {'destinationSlug' in item && <span className="absolute inset-x-0 bottom-0 p-4 text-sm font-bold text-white">{pick(item.name)}</span>}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        {relatedVisuals.length > 0 && !experience.gallery?.length && (
          <Reveal className="mt-12">
            {experience.id !== 'exp-addis-nightlife-2' && <SectionHeader title={`More ${experience.category.toLowerCase()} moments in ${destination?.name ?? ''}`} subtitle="Explore related experiences through their stories and images" className="mb-6" />}
            {experience.id === 'exp-addis-nightlife-2' && (
              <SectionHeader
                title="Fendika in motion"
                subtitle="Watch the music, dance, and atmosphere of a live night in Addis Ababa"
                className="mb-6"
              />
            )}
            <div className={experience.id === 'exp-addis-nightlife-2' ? 'grid items-start gap-5 lg:grid-cols-2' : 'grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-4'}>
              {experience.id === 'exp-addis-nightlife-2' && (
                <div className="relative col-span-2 overflow-hidden rounded-[2rem] border border-primary-700 bg-primary-900 p-4 shadow-hero sm:p-6">
                  <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-primary-500/25 blur-3xl" aria-hidden="true" />
                  <div className="relative grid min-h-[500px] overflow-hidden rounded-[1.4rem] border border-white/10 lg:grid-cols-2">
                    <div className="group relative min-h-[380px] overflow-hidden lg:min-h-[520px]">
                      <Image src={experience.photo} alt={`${pick(experience.name)} live performance`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent-300">Fendika Cultural Center</span>
                        <h2 className="mt-2 font-heading text-3xl font-extrabold">Feel Addis after dark</h2>
                        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">Azmari music, expressive dance, and live rhythms inside one of Addis Ababa&apos;s most distinctive cultural spaces.</p>
                      </div>
                    </div>
                    <div className="flex min-h-[380px] items-center bg-primary-900/80 p-4 sm:p-7 lg:min-h-[520px]">
                      <div className="relative h-full w-full overflow-hidden rounded-[1.1rem] bg-black shadow-[0_24px_60px_rgba(0,0,0,.45)] ring-1 ring-white/15">
                        <iframe
                          src="https://www.youtube-nocookie.com/embed/2s7l2QwGGHk?autoplay=1&mute=1&loop=1&playlist=2s7l2QwGGHk&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1"
                          title="Fendika Ethiopian music and dance performance"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          tabIndex={-1}
                          className="pointer-events-none absolute left-1/2 top-1/2 h-[145%] w-[145%] -translate-x-1/2 -translate-y-1/2 border-0"
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
                          </span>
                          <span className="text-xs font-semibold text-white/90">Live at Fendika</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className={experience.id === 'exp-addis-nightlife-2' ? 'hidden' : 'contents'}>
              {relatedVisuals.map((item, index) => (
                <RevealImage key={item.id} index={index} className={`relative self-start overflow-hidden rounded-[1.35rem] shadow-card ${experience.id !== 'exp-addis-nightlife-2' && index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}`}>
                  <Link href={`/experiences/${item.id}`} className={`group relative block ${experience.id === 'exp-addis-nightlife-2' ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                    <Image src={item.photo} alt={pick(item.name)} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/85 via-primary-900/5 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <span className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-accent-300"><Camera size={12} /> {item.category}</span>
                      <h3 className="font-heading text-lg font-bold">{pick(item.name)}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/75">{pick(item.description)}</p>
                    </div>
                  </Link>
                </RevealImage>
              ))}
              </div>
            </div>
          </Reveal>
        )}

        {hours && hours.length > 0 && (
          <Reveal className="mt-12 max-w-3xl">
            <SectionHeader title={t.experienceHoursTitle} className="mb-6" />
            <div className="divide-y divide-neutral-200 rounded-card-lg bg-white shadow-card">
              {hours.map((slot, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                      <Clock size={16} />
                    </span>
                    <p className="font-heading text-sm font-bold text-ink-900">{pick(slot.day)}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-ink-800">{slot.time}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {experience.menu && experience.menu.length > 0 && (
          <Reveal className="mt-12 max-w-3xl">
            <SectionHeader title={t.experienceMenuTitle} className="mb-6" />
            <div className="flex flex-wrap gap-2.5">
              {experience.menu.map((item) => (
                <span
                  key={item.name.en}
                  className="inline-flex items-center rounded-pill bg-white px-4 py-2 text-sm font-semibold text-ink-800 shadow-card"
                >
                  {pick(item.name)}
                </span>
              ))}
            </div>
          </Reveal>
        )}

        {experience.services && experience.services.length > 0 && (
          <Reveal className="relative mt-12 max-w-7xl overflow-hidden rounded-[2rem] border border-white/15 bg-primary-900 shadow-hero">
            <div className="absolute inset-0" aria-hidden="true">
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={serviceBackdropPhotos[serviceBackdropIndex]}
                  className="absolute -inset-4"
                  initial={reduceMotion ? false : { opacity: 0, x: '7%', scale: 1.08 }}
                  animate={{ opacity: 1, x: '0%', scale: reduceMotion ? 1 : 1.03 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: '-7%', scale: 1.08 }}
                  transition={{ duration: reduceMotion ? 0 : 1.1, ease: 'easeInOut' }}
                >
                  <Image
                    src={serviceBackdropPhotos[serviceBackdropIndex]}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-primary-900/45" />
              <div className="absolute inset-0 [background:radial-gradient(circle_at_82%_30%,transparent,rgba(5,20,34,.48)_72%)]" />
              <motion.div
                className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-white/10"
                animate={reduceMotion ? undefined : { rotate: 360, scale: [1, 1.08, 1] }}
                transition={reduceMotion ? undefined : { rotate: { duration: 28, repeat: Infinity, ease: 'linear' }, scale: { duration: 7, repeat: Infinity, ease: 'easeInOut' } }}
              />
            </div>

            <div className="relative z-10 grid min-h-[390px] lg:grid-cols-[0.72fr_1.28fr]">
              <div className="flex flex-col justify-between p-6 text-white sm:p-8 lg:p-10">
                <div>
                  <motion.span
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex rounded-pill border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent-300 backdrop-blur-md"
                  >
                    {experience.category}
                  </motion.span>
                  <h2 className="mt-4 font-heading text-3xl font-extrabold text-white sm:text-4xl">
                    {t.experienceServicesTitle}
                  </h2>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/75 sm:text-base">
                    {experience.address ? pick(experience.address) : destination?.name}
                  </p>
                </div>

                {serviceBackdropPhotos.length > 1 && (
                  <div className="mt-8 flex items-center gap-2" aria-label="Service background photos">
                    {serviceBackdropPhotos.map((photo, index) => (
                      <button
                        key={photo}
                        type="button"
                        onClick={() => setServiceBackdropIndex(index)}
                        aria-label={`Show photo ${index + 1}`}
                        aria-pressed={index === serviceBackdropIndex}
                        className={`h-1.5 rounded-pill transition-all duration-300 ${
                          index === serviceBackdropIndex ? 'w-8 bg-primary-400' : 'w-3 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="m-3 self-center overflow-hidden rounded-[1.5rem] border border-white/35 bg-white/90 shadow-[0_24px_60px_rgba(5,20,34,0.35)] backdrop-blur-xl sm:m-5">
                {experience.services.map((service, index) => (
                  <motion.div
                    key={service.name.en}
                    initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
                    className="group flex items-center gap-4 border-b border-neutral-200/80 p-4 transition-colors last:border-b-0 hover:bg-white"
                  >
                    {service.photo && (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1rem] shadow-soft sm:h-20 sm:w-20">
                        <Image
                          src={service.photo}
                          alt={pick(service.name)}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-sm font-bold text-ink-900">{pick(service.name)}</p>
                      {service.durationMinutes !== undefined && (
                        <p className="mt-0.5 text-xs text-ink-400">
                          {service.durationMinutes} {t.experienceMinutesAbbrev}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {hasServices && canBook && (
          <Reveal className="mt-6 max-w-7xl">
            <SectionHeader title={t.experienceAvailabilityTitle} className="mb-6" />
            <div className="rounded-card-lg bg-white p-6 shadow-card">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:gap-8">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    <Calendar size={13} />
                    {t.serviceBookingDateLabel}
                  </span>
                  <input
                    type="date"
                    min={todayIso()}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-card border border-neutral-300 px-3.5 py-2.5 text-sm font-semibold text-ink-800 outline-none focus:border-primary-500"
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    <Calendar size={13} />
                    {t.serviceBookingTimeLabel}
                  </span>
                  <input
                    type="date"
                    min={checkIn}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full rounded-card border border-neutral-300 px-3.5 py-2.5 text-sm font-semibold text-ink-800 outline-none focus:border-primary-500"
                  />
                </label>

                <div className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    <Users size={13} />
                    {t.serviceBookingGuestsLabel}
                  </span>
                  <div className="flex items-center justify-between rounded-card border border-neutral-300 px-3.5 py-2">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      disabled={guests <= 1}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-ink-700 disabled:opacity-30"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="text-sm font-semibold text-ink-800">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests((g) => g + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-ink-700"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>

              <Button
                href={`/redirect/experience/${experience.id}?checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`}
                size="lg"
                className="mt-5"
              >
                <Ticket size={18} />
                {t.experienceBookNow}
              </Button>
            </div>
          </Reveal>
        )}

        {experience.schedule && experience.schedule.length > 0 && (
          <Reveal className="mt-12 max-w-3xl">
            <SectionHeader title={t.experienceScheduleTitle} className="mb-6" />
            <div className="divide-y divide-neutral-200 rounded-card-lg bg-white shadow-card">
              {experience.schedule.map((slot, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                      <Clock size={16} />
                    </span>
                    <div>
                      <p className="font-heading text-sm font-bold text-ink-900">{pick(slot.day)}</p>
                      {slot.title && <p className="text-xs text-ink-500">{pick(slot.title)}</p>}
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-ink-800">{slot.time}</span>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {experience.gallery && experience.gallery.length > 0 && (
          <Reveal className="mt-12">
            <SectionHeader title={t.experienceGallery} className="mb-6" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {experience.gallery.map((photo, i) => (
                <RevealImage key={photo} index={i} className="relative aspect-[4/3] overflow-hidden rounded-card-lg shadow-soft">
                  <button type="button" onClick={() => setLightboxIndex(i)} className="relative block h-full w-full">
                    <Image
                      src={photo}
                      alt={`${pick(experience.name)} photo ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </button>
                </RevealImage>
              ))}
            </div>
            <AnimatePresence>
              {lightboxIndex !== null && (
                <Lightbox
                  photos={experience.gallery}
                  index={lightboxIndex}
                  alt={pick(experience.name)}
                  onClose={() => setLightboxIndex(null)}
                  onIndexChange={setLightboxIndex}
                />
              )}
            </AnimatePresence>
          </Reveal>
        )}

        {showReviewsAndHours && (
          <>
            <Reveal className="mt-12">
              <HotelReviewsCarousel reviews={reviews} guestRating={guestRating} reviewCount={reviewCount} />
            </Reveal>

            <Reveal className="mt-6 max-w-sm">
              <RatingBreakdown guestRating={guestRating} reviewCount={reviewCount} />
            </Reveal>
          </>
        )}

        {nearbyHotels.length > 0 && (
          <Reveal className="mt-12">
            <SectionHeader title={t.experienceHotelsNear} subtitle={destination?.name} className="mb-6" />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {nearbyHotels.map((hotel, i) => (
                <HotelCard key={hotel.id} hotel={hotel} revealIndex={i} />
              ))}
            </div>
          </Reveal>
        )}

        {moreInDestination.length > 0 && (
          <Reveal className="mt-12">
            <SectionHeader title={`${t.experienceMoreIn} ${destination?.name ?? ''}`} className="mb-6" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {moreInDestination.map((exp, i) => (
                <ExperienceCard key={exp.id} experience={exp} revealIndex={i} />
              ))}
            </div>
          </Reveal>
        )}
      </PageShell>
    </Layout>
  );
}
