
import Hero from "@/components/homepage/Hero";
import WhyJoinStartupForge from "@/components/ui/WhyJoinStartupForge";
import FeaturedStartups from "@/components/homepage/FeaturedStartups";
import FeaturedOpportunities from "@/components/homepage/FeaturedOpportunities";
import SuccessStories from "@/components/ui/SuccessStories";
import CommunityHighlights from "@/components/ui/CommunityHighlights";

const HomePage = () => {
  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <main>
        <Hero />
        <FeaturedStartups />
        <FeaturedOpportunities />
        <WhyJoinStartupForge />
        <CommunityHighlights />
        <SuccessStories />
      </main>
    </div>
  );
};

export default HomePage;