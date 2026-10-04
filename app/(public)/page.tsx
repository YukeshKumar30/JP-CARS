"use client";

import { useState, useCallback } from "react";
import { IntroScreen } from "@/components/shared/intro-screen";
import { HeroSection } from "@/components/home/hero-section";
import { SearchSection } from "@/components/home/search-section";
import { TrustSection } from "@/components/home/trust-section";
import { FeaturedCarsSection } from "@/components/home/featured-cars-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { SellYourCarSection } from "@/components/home/sell-your-car-section";
import { FinanceSectionHome } from "@/components/home/finance-section";
import { SocialSection } from "@/components/home/social-section";
import { FAQSection } from "@/components/home/faq-section";
import { LocationSection } from "@/components/home/location-section";

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroComplete(true), []);

  return (
    <>
      <IntroScreen onComplete={handleIntroComplete} />
      <div style={{ opacity: introComplete ? 1 : 0, transition: "opacity 0.5s ease" }}>
        <HeroSection />
        <SearchSection />
        <TrustSection />
        <FeaturedCarsSection />
        <HowItWorksSection />
        <SellYourCarSection />
        <FinanceSectionHome />
        <SocialSection />
        <FAQSection />
        <LocationSection />
        {/* Final CTA */}
        <section className="py-20 bg-jp-black text-white text-center">
          <div className="jp-container">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Your Next Car is Waiting.
            </h2>
            <p className="text-white/60 mb-8 text-base">
              Browse our verified inventory and find your perfect match today.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/cars" className="btn btn-gold px-8 text-sm">
                Browse All Cars
              </a>
              <a href={`https://wa.me/919751882320`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp px-8 text-sm">
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
