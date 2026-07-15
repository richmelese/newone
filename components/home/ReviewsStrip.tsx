import { Quote } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { hotels } from '@/data/hotels';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import Carousel from '@/components/ui/Carousel';
import RevealItem from '@/components/ui/RevealItem';
import RatingStars from '@/components/ui/RatingStars';
import PageShell from '@/components/layout/PageShell';

const AVATAR_COLORS = ['bg-primary-500', 'bg-primary-400', 'bg-success-500', 'bg-primary-600'];

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ReviewsStrip() {
  const { t, pick } = useLanguage();
  const snippets = hotels.flatMap((hotel) => hotel.reviews.map((review) => ({ review, hotel }))).slice(0, 9);

  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_78%_48%,#164d88_0%,#0d315c_34%,#071a32_70%,#061426_100%)] py-16 sm:py-20 lg:min-h-[720px] lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[12%] top-[7%] -z-10 h-[620px] w-[620px] rounded-full border-[110px] border-primary-500/[0.08]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-[42%] right-[3%] -z-10 h-[620px] w-[620px] rounded-full bg-primary-500/[0.08]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-2 top-5 font-heading text-[190px] font-extrabold leading-none text-primary-500/[0.08] sm:left-3">&ldquo;</div>
      <div aria-hidden="true" className="pointer-events-none absolute -right-5 top-28 h-28 w-36 opacity-20 [background-image:radial-gradient(circle,#8aaecf_2px,transparent_2.5px)] [background-size:20px_20px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-2 -left-3 h-32 w-40 opacity-25 [background-image:radial-gradient(circle,#8aaecf_2px,transparent_2.5px)] [background-size:20px_20px]" />

      <PageShell className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-[-0.025em] text-white sm:text-4xl lg:text-[44px] lg:leading-tight">
            <TwoToneHeading text={t.reviewsStripTitle} accentClassName="text-accent-400" />
          </h2>
          <p className="mt-4 text-base text-primary-100 sm:text-lg lg:text-xl">{t.reviewsStripSubtitle}</p>
        </div>

        <Carousel className="reviews-showcase mt-12 sm:mt-14" autoPlay autoPlayInterval={5000} darkNavigation>
          {snippets.map(({ review, hotel }, index) => (
            <RevealItem
              key={review.id}
              index={index}
              className="min-h-[390px] w-full shrink-0 snap-start rounded-[22px] border border-primary-300/25 bg-gradient-to-br from-white/[0.09] to-primary-400/[0.12] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_55px_rgba(2,12,26,0.2)] backdrop-blur-md sm:w-[calc((100%-1rem)/2)] sm:p-8 lg:min-h-[410px] lg:w-[calc((100%-2rem)/3)]"
            >
              <div className="flex items-center gap-4">
                <span className={`flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full text-xl font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.16)] ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
                  {initials(review.author)}
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-lg font-bold text-white">{review.author}</p>
                  <p className="mt-1 truncate text-sm text-primary-100 sm:text-base">{hotel.name}</p>
                </div>
              </div>
              <RatingStars rating={review.rating} size={24} className="mt-8 gap-1 text-amber-500" />
              <div className="my-7 h-px bg-primary-200/25" />
              <Quote size={32} fill="currentColor" strokeWidth={0} className="text-blue-400" aria-hidden="true" />
              <p className="mt-3 text-lg leading-relaxed text-primary-50 sm:text-xl">&ldquo;{pick(review.comment)}&rdquo;</p>
            </RevealItem>
          ))}
        </Carousel>
      </PageShell>
    </section>
  );
}
