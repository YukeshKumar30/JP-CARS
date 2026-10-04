import type { Metadata } from "next";
import { PageTransition, Reveal, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import {
  Car, TrendingUp, Wrench, CreditCard, Shield, RefreshCw,
  FileText, BookOpen, CalendarCheck, CheckCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services",
  description: "JP CARS offers vehicle purchase, sale, evaluation, finance, insurance, RC transfer, and more — all in Kallakurichi.",
};

const services = [
  { icon: Car, title: "Vehicle Purchase", desc: "Find and purchase verified pre-owned vehicles with complete documentation support." },
  { icon: TrendingUp, title: "Vehicle Sale Assistance", desc: "Sell your car hassle-free with our evaluation and buyer-matching service." },
  { icon: Wrench, title: "Vehicle Evaluation", desc: "Get a professional evaluation of your car's market value at no cost." },
  { icon: CreditCard, title: "Finance Assistance", desc: "We assist with vehicle loans through leading banks. Subject to eligibility." },
  { icon: Shield, title: "Insurance Assistance", desc: "Guidance on comprehensive and third-party vehicle insurance options." },
  { icon: RefreshCw, title: "Exchange / Upgrade", desc: "Exchange your old vehicle and upgrade to a better one seamlessly." },
  { icon: FileText, title: "RC Transfer", desc: "Complete assistance with RC transfer documentation and RTO processes." },
  { icon: BookOpen, title: "Documentation Support", desc: "Guidance on all vehicle-related paperwork and government requirements." },
  { icon: CalendarCheck, title: "Test Drive", desc: "Schedule a test drive at our Kallakurichi location before you decide." },
];

export default function ServicesPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-jp-bg dark:bg-jp-black pt-16">
        <div className="jp-container py-12">
          <Reveal className="text-center mb-12 max-w-2xl mx-auto">
            <span className="section-tag justify-center">Our Services</span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-jp-text dark:text-white mb-3">
              Everything You Need
            </h1>
            <p className="text-jp-muted leading-relaxed">
              From buying to selling, finance to documentation — JP CARS supports you at every step.
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <StaggerItem key={service.title}>
                <div className="p-6 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark hover:border-jp-gold/30 dark:hover:border-jp-gold/30 hover:shadow-md transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-xl bg-jp-gold/10 flex items-center justify-center mb-4 group-hover:bg-jp-gold/20 transition-colors">
                    <service.icon className="w-6 h-6 text-jp-gold" />
                  </div>
                  <h2 className="font-bold text-jp-text dark:text-white mb-2">{service.title}</h2>
                  <p className="text-sm text-jp-muted leading-relaxed">{service.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTA */}
          <Reveal className="mt-12 text-center">
            <p className="text-jp-muted mb-4">Have a specific requirement? Get in touch with our team.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://wa.me/919751882320" target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp px-6">WhatsApp Us</a>
              <a href="tel:+919943882320" className="btn btn-primary px-6">Call Now</a>
            </div>
          </Reveal>
        </div>
      </div>
    </PageTransition>
  );
}
