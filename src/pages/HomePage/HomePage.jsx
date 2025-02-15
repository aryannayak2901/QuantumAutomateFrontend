import React from "react";
import {
  HeaderSection,
  HeroSection,
  FeatureSection,
  VerticalTimeLineSection,
  FooterSection
} from "../../components";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-secondary-900">
      <HeaderSection />
      
      <main className="relative">
        {/* Hero Section with Parallax Effect */}
        <div className="relative z-10">
          <HeroSection />
        </div>

        {/* Features Section */}
        <div className="relative z-20">
          <FeatureSection />
        </div>

        {/* Timeline Section */}
        <div className="relative z-30 bg-secondary-800 py-24">
          <VerticalTimeLineSection />
        </div>

        {/* Footer */}
        <FooterSection />
      </main>
    </div>
  );
};

export default HomePage;