import { useLanguage } from '@/lib/language';
import { featuredHotels, travelersFavorites, bestValueHotels } from '@/lib/curation';
import { featuredCategoryPairs } from '@/data/experiences';
import { organizationSchema, websiteSchema } from '@/lib/structuredData';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import PromoBand from '@/components/home/PromoBand';
import DiscoverByInterest from '@/components/home/DiscoverByInterest';
import DestinationsRow from '@/components/home/DestinationsRow';
import HotelRow from '@/components/home/HotelRow';
import ExperienceRow from '@/components/home/ExperienceRow';
import HowItWorks from '@/components/home/HowItWorks';
import ReviewsStrip from '@/components/home/ReviewsStrip';
import PartnerHotelsMarquee from '@/components/home/PartnerHotelsMarquee';
import WhyEthiopidia from '@/components/home/WhyEthiopidia';
import IconicPlaces from '@/components/home/IconicPlaces';
import FreeThingsToDo from '@/components/home/FreeThingsToDo';
import FaqSection from '@/components/home/FaqSection';
import EthiopiaMotionBackdrop from '@/components/home/EthiopiaMotionBackdrop';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

export default function Home() {
  const { t } = useLanguage();

  return (
    <Layout
      seo={{
        title: 'Ethiopidia — Find the perfect place to stay in Ethiopia',
        description: 'Discover, compare, and read reviews for hotels across Ethiopia, then book securely on each hotel’s own website.',
        path: '/',
        jsonLd: [organizationSchema(), websiteSchema()],
      }}
      overlapHeader
    >
      <Hero />
      <Reveal><PromoBand /></Reveal>
      <HotelRow title={t.featuredHotelsTitle} subtitle={t.featuredHotelsSubtitle} hotels={featuredHotels()} autoPlay showFeaturedBadge />
      <DestinationsRow />
      <DiscoverByInterest />
      <ExperienceRow
          title={t.featuredExperiencesTitle}
          subtitle={t.featuredExperiencesSubtitle}
          categoryPairs={featuredCategoryPairs()}
          action={<Button href="/experiences" variant="secondary">{t.experiencesViewAll}</Button>}
        />
      <Reveal><IconicPlaces /></Reveal>
      <FreeThingsToDo />
      <HotelRow title={t.travelersFavoritesTitle} subtitle={t.travelersFavoritesSubtitle} hotels={travelersFavorites()} />
      <WhyEthiopidia />
      <HotelRow title={t.bestValueTitle} subtitle={t.bestValueSubtitle} hotels={bestValueHotels()} />
      <ReviewsStrip />
      <HowItWorks />
      <EthiopiaMotionBackdrop>
        <FaqSection />
      </EthiopiaMotionBackdrop>
      <Reveal><PartnerHotelsMarquee /></Reveal>
    </Layout>
  );
}
