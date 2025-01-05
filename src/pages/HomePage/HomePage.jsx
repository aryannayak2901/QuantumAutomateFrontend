import React from "react";
import {
  HeaderSection,
  HeroSection,
  FeatureSection,
  VerticalTimeLineSection,
} from "../../components";
import './HomePage.css';

const HomePage = () => {
  return (
    <div>
      {/* // <div>HomePage</div>
            // Header */}
      <HeaderSection />

      {/* // Hero Section
            // Features Section
            // Workflow Timeline
            // Call To Action (CTA) Section
            // Footer */}
      <div className="parallax-container">
        <HeroSection />
        <FeatureSection />
        <VerticalTimeLineSection />
      </div>
    </div>
  );
};

export default HomePage;
