import Link from "next/link";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import { Search, Calendar, FileCheck, Smile, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse & Shortlist",
    description: "Browse our verified inventory. Filter by brand, budget, fuel type, and more. Shortlist vehicles you love.",
  },
  {
    number: "02",
    icon: Calendar,
    title: "Book a Test Drive",
    description: "Schedule a test drive at our Kallakurichi location. Drive the car before you decide.",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Finance & Paperwork",
    description: "We assist with financing and all documentation — fast, simple, and transparent.",
  },
  {
    number: "04",
    icon: Smile,
    title: "Drive Home Happy",
    description: "Complete the purchase and drive home in your new car. We support you even after the sale.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 bg-jp-bg dark:bg-jp-black">
      <div className="jp-container">
        <Reveal className="text-center mb-12">
          <span className="section-tag justify-center">How It Works</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-jp-text dark:text-white">
            Buying a Car Is This Simple
          </h2>
        </Reveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-jp-border dark:bg-jp-border-dark" aria-hidden />

          {steps.map((step, i) => (
            <StaggerItem key={step.number}>
              <div className="relative text-center">
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 mb-5">
                    <div className="w-full h-full rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark flex items-center justify-center shadow-sm">
                      <step.icon className="w-8 h-8 text-jp-gold" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-jp-gold text-white rounded-full text-xs font-black flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-jp-text dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-jp-muted leading-relaxed max-w-[200px]">{step.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="text-center mt-10">
          <Link href="/cars" className="btn btn-primary px-8">
            Start Browsing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
