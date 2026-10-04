"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/shared/animations";
import { DEMO_BRANDS } from "@/lib/demo-data";

const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const TRANSMISSIONS = ["Manual", "Automatic", "AMT", "CVT", "DCT"];
const BODY_TYPES = ["Hatchback", "Sedan", "SUV", "MUV", "Coupe"];
const BUDGETS = [
  { label: "Under ₹3 Lakh", value: "300000" },
  { label: "₹3L – ₹5L", value: "500000" },
  { label: "₹5L – ₹8L", value: "800000" },
  { label: "₹8L – ₹12L", value: "1200000" },
  { label: "₹12L – ₹20L", value: "2000000" },
  { label: "Above ₹20L", value: "9999999" },
];

export function SearchSection() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [budget, setBudget] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchText) params.set("search", searchText);
    if (brand) params.set("brand", brand);
    if (budget) params.set("max_price", budget);
    if (fuel) params.set("fuel_type", fuel);
    if (transmission) params.set("transmission", transmission);
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <section className="py-14 bg-white dark:bg-jp-dark border-y border-jp-border dark:border-jp-border-dark">
      <div className="jp-container">
        <Reveal>
          <div className="text-center mb-8">
            <span className="section-tag">
              <Search className="w-3 h-3" />
              Smart Search
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-jp-text dark:text-white">
              Find Your Perfect Car
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="max-w-4xl mx-auto">
            {/* Main search */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jp-muted" />
                <input
                  type="text"
                  placeholder="Search by brand, model, or variant…"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="jp-input pl-9 h-11 text-sm"
                />
              </div>
              <button
                onClick={handleSearch}
                className="btn btn-primary px-6 h-11 text-sm"
              >
                Search
              </button>
            </div>

            {/* Filter row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Brand */}
              <div className="relative">
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="jp-input h-10 text-sm appearance-none pr-8 cursor-pointer"
                >
                  <option value="">All Brands</option>
                  {DEMO_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jp-muted pointer-events-none" />
              </div>

              {/* Budget */}
              <div className="relative">
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="jp-input h-10 text-sm appearance-none pr-8 cursor-pointer"
                >
                  <option value="">Any Budget</option>
                  {BUDGETS.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jp-muted pointer-events-none" />
              </div>

              {/* Fuel */}
              <div className="relative">
                <select
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                  className="jp-input h-10 text-sm appearance-none pr-8 cursor-pointer"
                >
                  <option value="">All Fuel Types</option>
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jp-muted pointer-events-none" />
              </div>

              {/* Transmission */}
              <div className="relative">
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="jp-input h-10 text-sm appearance-none pr-8 cursor-pointer"
                >
                  <option value="">All Transmissions</option>
                  {TRANSMISSIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jp-muted pointer-events-none" />
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["SUV", "Sedan", "Hatchback", "Automatic", "Under ₹5L", "Diesel"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (tag === "Under ₹5L") params.set("max_price", "500000");
                    else if (["SUV","Sedan","Hatchback"].includes(tag)) params.set("body_type", tag);
                    else if (tag === "Automatic") params.set("transmission", "Automatic");
                    else if (tag === "Diesel") params.set("fuel_type", "Diesel");
                    router.push(`/cars?${params.toString()}`);
                  }}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-jp-muted hover:text-jp-text dark:hover:text-white hover:border-jp-text dark:hover:border-white transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
