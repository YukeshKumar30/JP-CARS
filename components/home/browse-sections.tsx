"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import { DEMO_BRANDS } from "@/lib/demo-data";

// Simple brand logo placeholders
const BRAND_ICONS: Record<string, string> = {
  "Maruti Suzuki": "MS",
  "Hyundai": "HY",
  "Honda": "HO",
  "Toyota": "TO",
  "Tata": "TA",
  "Kia": "KI",
  "Volkswagen": "VW",
  "Mahindra": "MA",
  "Ford": "FO",
  "Renault": "RE",
  "MG": "MG",
  "Skoda": "SK",
  "Jeep": "JP",
  "Nissan": "NI",
  "Datsun": "DA",
};

export function BrowseByBrandSection() {
  const router = useRouter();
  const brands = DEMO_BRANDS.slice(0, 12);

  return (
    <section className="py-16 bg-jp-bg dark:bg-jp-black">
      <div className="jp-container">
        <Reveal className="text-center mb-10">
          <span className="section-tag justify-center">Browse by Brand</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-jp-text dark:text-white">
            Popular Brands
          </h2>
        </Reveal>

        <StaggerContainer className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {brands.map((brand) => (
            <StaggerItem key={brand}>
              <button
                onClick={() => router.push(`/cars?brand=${encodeURIComponent(brand)}`)}
                className="w-full flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark hover:border-jp-gold/40 dark:hover:border-jp-gold/40 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-jp-bg dark:bg-jp-black flex items-center justify-center text-sm font-bold text-jp-text dark:text-white group-hover:bg-jp-gold/10 group-hover:text-jp-gold transition-all duration-200">
                  {BRAND_ICONS[brand] || brand.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-jp-muted group-hover:text-jp-text dark:group-hover:text-white transition-colors text-center leading-tight">
                  {brand}
                </span>
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="text-center mt-8">
          <Link href="/cars" className="btn btn-secondary px-6 text-sm">
            Browse All Cars
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Browse by Budget ──────────────────────────────────────────────────

const BUDGETS = [
  { label: "Under ₹3 Lakh", range: "0–3", max: 300000 },
  { label: "₹3L – ₹5L", range: "3–5", max: 500000, min: 300000 },
  { label: "₹5L – ₹8L", range: "5–8", max: 800000, min: 500000 },
  { label: "₹8L – ₹12L", range: "8–12", max: 1200000, min: 800000 },
  { label: "₹12L – ₹20L", range: "12–20", max: 2000000, min: 1200000 },
  { label: "Above ₹20L", range: "20+", min: 2000000 },
];

export function BrowseByBudgetSection() {
  const router = useRouter();

  return (
    <section className="py-16 bg-white dark:bg-jp-dark">
      <div className="jp-container">
        <Reveal className="text-center mb-10">
          <span className="section-tag justify-center">Browse by Budget</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-jp-text dark:text-white">
            Cars for Every Budget
          </h2>
        </Reveal>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BUDGETS.map((budget, i) => (
            <StaggerItem key={budget.range}>
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  if (budget.min) params.set("min_price", String(budget.min));
                  if (budget.max) params.set("max_price", String(budget.max));
                  router.push(`/cars?${params.toString()}`);
                }}
                className="w-full p-4 rounded-2xl border border-jp-border dark:border-jp-border-dark bg-jp-bg dark:bg-jp-black hover:border-jp-gold/40 dark:hover:border-jp-gold/40 hover:shadow-md text-center transition-all duration-200 group"
              >
                <div className="text-2xl font-black text-jp-text dark:text-white group-hover:text-jp-gold transition-colors mb-1">
                  {i + 1}
                </div>
                <div className="text-xs font-semibold text-jp-text dark:text-white mb-0.5">{budget.label}</div>
                <div className="text-xs text-jp-muted">Lakhs</div>
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
