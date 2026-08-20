import { Quote, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import TwoToneHeading from '@/components/ui/TwoToneHeading';
import Carousel from '@/components/ui/Carousel';
import RevealItem from '@/components/ui/RevealItem';
import RatingStars from '@/components/ui/RatingStars';
import PageShell from '@/components/layout/PageShell';

const AVATAR_COLORS = ['bg-primary-500', 'bg-primary-400', 'bg-accent-500', 'bg-primary-600', 'bg-accent-600', 'bg-primary-700'];

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

interface PlatformTestimonial {
  id: string;
  author: string;
  tagline: { en: string; am: string };
  rating: number;
  comment: { en: string; am: string };
}

const ETHIOPIDIA_REVIEWS: PlatformTestimonial[] = [
  {
    id: 'eth-rev-1',
    author: 'Elena Rostova',
    tagline: { en: 'Traveled to Lalibela & Axum', am: 'በላሊበላና አክሱም የተጓዘች' },
    rating: 5,
    comment: {
      en: 'Ethiopidia made planning our Ethiopia itinerary effortless. Finding genuine hotel details, authentic photography, and direct official booking links gave us complete peace of mind.',
      am: 'ኢትዮጵዲያ የኢትዮጵያ ጉዟችንን ማቀድ እጅግ ቀላል አድርጎልናል። እውነተኛ የሆቴል መረጃዎችን፣ ትክክለኛ ፎቶዎችንና ቀጥተኛ ይፋዊ ማስፈንጠሪያዎችን ማግኘታችን ሙሉ እምነት ሰጥቶናል።',
    },
  },
  {
    id: 'eth-rev-2',
    author: 'Dawit Yohannes',
    tagline: { en: 'Family Trip to Hawassa & Bahir Dar', am: 'የሐዋሳና ባሕር ዳር የቤተሰብ ጉዞ' },
    rating: 5,
    comment: {
      en: 'Comparing lakeside resorts and local experiences in one place saved our family days of searching. The transparent pricing in Birr and verified reviews were 100% accurate.',
      am: 'በሐይቅ ዳርቻ ያሉ ሪዞርቶችንና የአካባቢ ተሞክሮዎችን በአንድ ቦታ ማነጻጸር ለቤተሰባችን ብዙ የፍለጋ ጊዜ አድኖልናል። ግልጽ የብር ዋጋዎችና የተረጋገጡ አስተያየቶች ሙሉ በሙሉ ትክክለኛ ነበሩ።',
    },
  },
  {
    id: 'eth-rev-3',
    author: 'Marcus Vance',
    tagline: { en: 'Danakil & Afar Expedition', am: 'የዳናኪልና አፋር ጉዞ' },
    rating: 5,
    comment: {
      en: 'By far the most comprehensive travel platform for Ethiopia. The destination guides and curated local stays helped us discover places no mainstream booking site covers.',
      am: 'ለኢትዮጵያ እጅግ የተሟላና ምርጥ የጉዞ መድረክ። የመዳረሻ መመሪያዎቹና የተመረጡ ማረፊያዎቹ ሌሎች ዓለም አቀፍ ድረ-ገጾች የማያካትቷቸውን አስደናቂ ቦታዎች እንድናውቅ ረድተውናል።',
    },
  },
  {
    id: 'eth-rev-4',
    author: 'Sara Al-Mansoori',
    tagline: { en: 'Cultural Route across Gondar & Harar', am: 'በጎንደርና ሐረር የተደረገ የባህል ጉዞ' },
    rating: 5,
    comment: {
      en: 'I love that Ethiopidia connects you directly to local properties with zero hidden middleman fees. The bilingual English and Amharic experience is beautifully executed.',
      am: 'ኢትዮጵዲያ ያለ ምንም የተደበቀ የአገናኝ ክፍያ በቀጥታ ከአካባቢ ሆቴሎች ጋር የሚያገናኝ መሆኑን በጣም ወደድኩት። የእንግሊዝኛና የአማርኛ ቋንቋ አማራጩም እጅግ ውብ ነው።',
    },
  },
  {
    id: 'eth-rev-5',
    author: 'Abebe Kebede',
    tagline: { en: 'Frequent Business Traveler', am: 'ተደጋጋሚ የንግድ ተጓዥ' },
    rating: 5,
    comment: {
      en: 'Whether booking a downtown business stay in Addis or a weekend getaway in the Rift Valley, Ethiopidia has become my go-to platform. Quick, reliable, and beautifully designed.',
      am: 'በአዲስ አበባ መሃል የንግድ ቆይታ ለማስያዝም ሆነ በስምጥ ሸለቆ የሳምንት መጨረሻ እረፍት ለማድረግ፣ ኢትዮጵዲያ ሁልጊዜ የምጠቀምበት መድረክ ሆኗል። ፈጣን፣ አስተማማኝና ውብ ነው።',
    },
  },
  {
    id: 'eth-rev-6',
    author: 'Claire Dubois',
    tagline: { en: 'Highland Treks & Cultural Stays', am: 'የከፍተኛ ተራሮችና ባህላዊ ቆይታዎች' },
    rating: 5,
    comment: {
      en: 'From eco-lodges in the highlands to top city hotels, Ethiopidia showcases the true warmth of Ethiopian hospitality. The curated experience guides are fantastic!',
      am: 'በተራራማ ቦታዎች ካሉ ኢኮ-ሎጆች እስከ ምርጥ የከተማ ሆቴሎች፣ ኢትዮጵዲያ እውነተኛውን የኢትዮጵያ መስተንግዶ ያሳያል። የተመረጡ የልምድ መመሪያዎቹም ድንቅ ናቸው!',
    },
  },
];

export default function ReviewsStrip() {
  const { t, pick } = useLanguage();

  return (
    <section className="relative isolate overflow-hidden bg-[radial-gradient(circle_at_78%_48%,#164d88_0%,#0d315c_34%,#071a32_70%,#061426_100%)] py-16 sm:py-20 lg:min-h-[720px] lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[12%] top-[7%] -z-10 h-[620px] w-[620px] rounded-full border-[110px] border-primary-500/[0.08]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-[42%] right-[3%] -z-10 h-[620px] w-[620px] rounded-full bg-primary-500/[0.08]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-2 top-5 font-heading text-[190px] font-extrabold leading-none text-primary-500/[0.08] sm:left-3">&ldquo;</div>
      <div aria-hidden="true" className="pointer-events-none absolute -right-5 top-28 h-28 w-36 opacity-20 [background-image:radial-gradient(circle,#8aaecf_2px,transparent_2.5px)] [background-size:20px_20px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-2 -left-3 h-32 w-40 opacity-25 [background-image:radial-gradient(circle,#8aaecf_2px,transparent_2.5px)] [background-size:20px_20px]" />

      <PageShell className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-pill border border-accent-400/30 bg-accent-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent-300 backdrop-blur-sm">
            <Sparkles size={13} />
            <span>Ethiopidia Community</span>
          </div>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-[-0.025em] text-white sm:text-4xl lg:text-[44px] lg:leading-tight">
            <TwoToneHeading text={t.reviewsStripTitle} accentClassName="text-accent-400" />
          </h2>
          <p className="mt-4 text-base text-primary-100 sm:text-lg lg:text-xl">{t.reviewsStripSubtitle}</p>
        </div>

        <Carousel className="reviews-showcase mt-12 sm:mt-14" autoPlay autoPlayInterval={5000} darkNavigation>
          {ETHIOPIDIA_REVIEWS.map((review, index) => (
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
                  <p className="mt-1 truncate text-sm text-primary-200 sm:text-base">{pick(review.tagline)}</p>
                </div>
              </div>
              <RatingStars rating={review.rating} size={24} className="mt-8 gap-1 text-amber-500" />
              <div className="my-7 h-px bg-primary-200/25" />
              <Quote size={32} fill="currentColor" strokeWidth={0} className="text-accent-400" aria-hidden="true" />
              <p className="mt-3 text-lg leading-relaxed text-primary-50 sm:text-xl">&ldquo;{pick(review.comment)}&rdquo;</p>
            </RevealItem>
          ))}
        </Carousel>
      </PageShell>
    </section>
  );
}
