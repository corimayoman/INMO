import { HeroSearch } from '@/components/home/hero-search';
import { FeaturedListings } from '@/components/home/featured-listings';
import { PopularDestinations } from '@/components/home/popular-destinations';
import { HowItWorks } from '@/components/home/how-it-works';
import { AgentCTA } from '@/components/home/agent-cta';
import { StatsBar } from '@/components/home/stats-bar';

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <StatsBar />
      <FeaturedListings />
      <PopularDestinations />
      <HowItWorks />
      <AgentCTA />
    </>
  );
}
