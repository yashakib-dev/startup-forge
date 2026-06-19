import React from "react";
import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/homepage/Hero";
import WhyJoinStartupForge from "@/components/ui/WhyJoinStartupForge";
import FeaturedStartups from "@/components/homepage/FeaturedStartups";
import SuccessStories from "@/components/ui/SuccessStories";
import CommunityHighlights from "@/components/ui/CommunityHighlights";

const HomePage = () => {
  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <Navbar />
      <main>
        <Hero />
        <FeaturedStartups />
        <WhyJoinStartupForge />
        <CommunityHighlights />
        <SuccessStories />
      </main>
    </div>
  );
};

export default HomePage;