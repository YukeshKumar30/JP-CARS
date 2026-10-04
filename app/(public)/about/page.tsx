import type { Metadata } from "next";
import { PageTransition, Reveal, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import { business } from "@/config/business";
import { CheckCircle, Shield, Star, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About JP CARS",
  description: "Learn about JP CARS Kallakurichi — our approach to transparent, simple pre-owned car buying.",
};

const values = [
  { icon: Shield, title: "Transparency First", desc: "We believe in honest pricing, clear documentation, and no hidden surprises." },
  { icon: Star, title: "Quality Vehicles", desc: "Every vehicle is inspected and verified before listing. We stand behind every car we sell." },
  { icon: Users, title: "Customer-First", desc: "Our team is dedicated to making your car buying experience simple and enjoyable." },
  { icon: CheckCircle, title: "After-Sale Support", desc: "Our relationship with customers doesn't end at the sale. We support you through RC transfer and beyond." },
];

const process = [
  { step: "01", title: "Vehicle Sourcing", desc: "We carefully source quality pre-owned vehicles from verified sellers across the region." },
  { step: "02", title: "Thorough Inspection", desc: "Each vehicle undergoes a multi-point inspection covering mechanical, exterior, and documentation." },
  { step: "03", title: "Fair Pricing", desc: "We price vehicles fairly based on market conditions — no inflated prices." },
  { step: "04", title: "Smooth Transaction", desc: "We handle all paperwork, finance assistance, and documentation to make the process simple." },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-jp-bg dark:bg-jp-black pt-16">
        {/* Hero */}
        <div className="bg-jp-black text-white py-20">
          <div className="jp-container">
            <Reveal className="max-w-3xl">
              <span className="section-tag text-jp-gold">About JP CARS</span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-5">
                Trusted Cars.<br />Transparent Process.
              </h1>
              <p className="text-white/70 text-lg leading-relaxed max-w-xl">
                JP CARS is a pre-owned car dealership based in Kallakurichi, Tamil Nadu. We are committed to providing a simple, transparent, and trustworthy car buying experience.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="jp-container py-16 space-y-16">
          {/* Stats */}
          <Reveal>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {Object.entries(business.stats).map(([key, value]) => (
                <div key={key} className="text-center p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                  <div className="text-3xl font-black text-jp-gold mb-1">{value}</div>
                  <div className="text-sm text-jp-muted capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Our approach */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <span className="section-tag">Our Approach</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-jp-text dark:text-white mb-4">
                Why We Do What We Do
              </h2>
              <p className="text-jp-muted leading-relaxed mb-4">
                Buying a used car can often feel complicated and uncertain. At JP CARS, we work to change that. Our goal is to make every transaction as clear and simple as possible.
              </p>
              <p className="text-jp-muted leading-relaxed">
                We serve customers across Kallakurichi and surrounding areas, offering hand-picked vehicles at fair market prices with full documentation and support.
              </p>
            </Reveal>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v) => (
                <StaggerItem key={v.title}>
                  <div className="p-4 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                    <v.icon className="w-5 h-5 text-jp-gold mb-2" />
                    <h3 className="font-semibold text-jp-text dark:text-white text-sm mb-1">{v.title}</h3>
                    <p className="text-xs text-jp-muted leading-relaxed">{v.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Process */}
          <Reveal>
            <div className="text-center mb-10">
              <span className="section-tag justify-center">Our Process</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-jp-text dark:text-white">How We Prepare Each Car</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {process.map((p) => (
                <div key={p.step} className="p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                  <div className="text-3xl font-black text-jp-gold/30 mb-3">{p.step}</div>
                  <h3 className="font-bold text-jp-text dark:text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-jp-muted leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal className="text-center">
            <h2 className="text-2xl font-bold text-jp-text dark:text-white mb-3">Ready to Find Your Car?</h2>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/cars" className="btn btn-primary px-8">Browse Cars</a>
              <a href="/contact" className="btn btn-secondary px-8">Contact Us</a>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  );
}
