import Link from "next/link";
import { Reveal } from "@/components/shared/animations";
import { ArrowRight, Calculator } from "lucide-react";

export function FinanceSectionHome() {
  return (
    <section className="py-16 bg-white dark:bg-jp-dark">
      <div className="jp-container">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <span className="section-tag justify-center">
              <Calculator className="w-3 h-3" />
              Finance
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-jp-text dark:text-white mb-4">
              Drive Home Today,<br />Pay at Your Comfort
            </h2>
            <p className="text-jp-muted mb-8 max-w-lg mx-auto leading-relaxed">
              We assist with vehicle financing through leading banks and NBFCs. Calculate your estimated EMI and apply for finance. Approval is subject to bank eligibility criteria.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/finance" className="btn btn-primary px-6">
                Explore Finance Options
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/finance#emi-calculator" className="btn btn-secondary px-6">
                <Calculator className="w-4 h-4" />
                EMI Calculator
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 grid grid-cols-3 gap-6 pt-10 border-t border-jp-border dark:border-jp-border-dark">
            {[
              { label: "Down Payment", value: "As low as 10%" },
              { label: "Interest Rate", value: "Starting 8.5%" },
              { label: "Tenure", value: "Up to 84 months" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-lg font-bold text-jp-text dark:text-white mb-0.5">{item.value}</div>
                <div className="text-xs text-jp-muted">{item.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
