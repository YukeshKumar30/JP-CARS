import { Reveal, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import { Shield, CheckCircle, FileText, Phone, Zap, Award } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "Inspected Vehicles",
    description: "Every car undergoes a thorough multi-point inspection before listing.",
  },
  {
    icon: FileText,
    title: "Clear Documentation",
    description: "All paperwork is verified and transparent. No surprises.",
  },
  {
    icon: CheckCircle,
    title: "Honest Pricing",
    description: "Fair market prices with no hidden charges or pressure.",
  },
  {
    icon: Phone,
    title: "WhatsApp Support",
    description: "Get instant answers and updates directly on WhatsApp.",
  },
  {
    icon: Zap,
    title: "Quick Process",
    description: "From inquiry to ownership — fast, simple, and efficient.",
  },
  {
    icon: Award,
    title: "After-Sale Support",
    description: "We guide you through RC transfer, insurance, and more.",
  },
];

export function TrustSection() {
  return (
    <section className="py-16 bg-white dark:bg-jp-dark">
      <div className="jp-container">
        <Reveal className="text-center mb-12">
          <span className="section-tag justify-center">Why JP CARS</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-jp-text dark:text-white max-w-lg mx-auto">
            A Buying Experience You Can Trust
          </h2>
        </Reveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPoints.map((point) => (
            <StaggerItem key={point.title}>
              <div className="p-5 rounded-2xl border border-jp-border dark:border-jp-border-dark hover:border-jp-gold/30 dark:hover:border-jp-gold/30 hover:shadow-md transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-jp-gold/10 flex items-center justify-center mb-4 group-hover:bg-jp-gold/20 transition-colors">
                  <point.icon className="w-5 h-5 text-jp-gold" />
                </div>
                <h3 className="font-semibold text-jp-text dark:text-white mb-1.5">{point.title}</h3>
                <p className="text-sm text-jp-muted leading-relaxed">{point.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
