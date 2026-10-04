"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, LayoutGrid, List, Search } from "lucide-react";
import { VehicleCard } from "@/components/cars/vehicle-card";
import { VehicleCardSkeleton } from "@/components/cars/vehicle-card-skeleton";
import { DEMO_VEHICLES, DEMO_BRANDS } from "@/lib/demo-data";
import type { Vehicle, VehicleFilters } from "@/types";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/shared/animations";

const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
const TRANSMISSIONS = ["Manual", "Automatic", "AMT", "CVT", "DCT"];
const BODY_TYPES = ["Hatchback", "Sedan", "SUV", "MUV", "Coupe", "Van"];
const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "km_asc", label: "Lowest KM" },
];

function filterVehicles(vehicles: Vehicle[], filters: VehicleFilters): Vehicle[] {
  let result = vehicles.filter((v) => v.is_published);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (v) =>
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.variant?.toLowerCase().includes(q)
    );
  }
  if (filters.brand) result = result.filter((v) => v.brand === filters.brand);
  if (filters.fuel_type) result = result.filter((v) => v.fuel_type === filters.fuel_type);
  if (filters.transmission) result = result.filter((v) => v.transmission === filters.transmission);
  if (filters.body_type) result = result.filter((v) => v.body_type === filters.body_type);
  if (filters.max_price) result = result.filter((v) => v.price <= filters.max_price!);
  if (filters.min_price) result = result.filter((v) => v.price >= filters.min_price!);
  if (filters.max_km) result = result.filter((v) => v.kilometres <= filters.max_km!);
  if (filters.owners) result = result.filter((v) => v.owners <= filters.owners!);
  if (filters.status) result = result.filter((v) => v.status === filters.status);

  switch (filters.sort) {
    case "price_asc": result.sort((a, b) => a.price - b.price); break;
    case "price_desc": result.sort((a, b) => b.price - a.price); break;
    case "newest": result.sort((a, b) => b.year - a.year); break;
    case "km_asc": result.sort((a, b) => a.kilometres - b.kilometres); break;
    default: result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  return result;
}

export function CarsPageClient({ initialVehicles }: { initialVehicles?: Vehicle[] } = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vehicleList, setVehicleList] = useState<Vehicle[]>(initialVehicles && initialVehicles.length > 0 ? initialVehicles : DEMO_VEHICLES);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Parse filters from URL
  const filters: VehicleFilters = useMemo(() => ({
    search: searchParams.get("search") || undefined,
    brand: searchParams.get("brand") || undefined,
    fuel_type: searchParams.get("fuel_type") || undefined,
    transmission: searchParams.get("transmission") || undefined,
    body_type: searchParams.get("body_type") || undefined,
    max_price: searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined,
    min_price: searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined,
    max_km: searchParams.get("max_km") ? Number(searchParams.get("max_km")) : undefined,
    owners: searchParams.get("owners") ? Number(searchParams.get("owners")) : undefined,
    status: (searchParams.get("status") as VehicleFilters["status"]) || undefined,
    sort: (searchParams.get("sort") as VehicleFilters["sort"]) || "recommended",
  }), [searchParams]);

  const vehicles = useMemo(() => filterVehicles(vehicleList, filters), [vehicleList, filters]);

  useEffect(() => {
    // Optionally re-fetch to ensure freshest data
    fetch("/api/vehicles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.vehicles)) {
          setVehicleList(data.vehicles);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/cars?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const clearAll = () => router.push("/cars");

  const activeFilterCount = [
    filters.search, filters.brand, filters.fuel_type, filters.transmission,
    filters.body_type, filters.max_price, filters.min_price, filters.status,
  ].filter(Boolean).length;

  // Active chips
  const activeChips = [
    filters.search && { key: "search", label: `"${filters.search}"` },
    filters.brand && { key: "brand", label: filters.brand },
    filters.fuel_type && { key: "fuel_type", label: filters.fuel_type },
    filters.transmission && { key: "transmission", label: filters.transmission },
    filters.body_type && { key: "body_type", label: filters.body_type },
    filters.max_price && { key: "max_price", label: `Under ₹${(filters.max_price / 100000).toFixed(1)}L` },
  ].filter(Boolean) as { key: string; label: string }[];

  const FilterPanel = ({ className }: { className?: string }) => (
    <div className={cn("space-y-5", className)}>
      <h2 className="font-bold text-jp-text dark:text-white">Filters</h2>

      {/* Brand */}
      <div>
        <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-2 block">Brand</label>
        <div className="relative">
          <select value={filters.brand || ""} onChange={(e) => updateFilter("brand", e.target.value)} className="jp-input text-sm appearance-none pr-7">
            <option value="">All Brands</option>
            {DEMO_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jp-muted pointer-events-none" />
        </div>
      </div>

      {/* Fuel */}
      <div>
        <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-2 block">Fuel Type</label>
        <div className="flex flex-wrap gap-2">
          {FUEL_TYPES.map((f) => (
            <button key={f} onClick={() => updateFilter("fuel_type", filters.fuel_type === f ? "" : f)}
              className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all", filters.fuel_type === f ? "bg-jp-black dark:bg-white text-white dark:text-jp-black border-jp-black dark:border-white" : "border-jp-border dark:border-jp-border-dark text-jp-muted hover:border-jp-text dark:hover:border-white")}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-2 block">Transmission</label>
        <div className="flex flex-wrap gap-2">
          {TRANSMISSIONS.map((t) => (
            <button key={t} onClick={() => updateFilter("transmission", filters.transmission === t ? "" : t)}
              className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all", filters.transmission === t ? "bg-jp-black dark:bg-white text-white dark:text-jp-black border-jp-black dark:border-white" : "border-jp-border dark:border-jp-border-dark text-jp-muted hover:border-jp-text dark:hover:border-white")}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Body Type */}
      <div>
        <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-2 block">Body Type</label>
        <div className="flex flex-wrap gap-2">
          {BODY_TYPES.map((b) => (
            <button key={b} onClick={() => updateFilter("body_type", filters.body_type === b ? "" : b)}
              className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all", filters.body_type === b ? "bg-jp-black dark:bg-white text-white dark:text-jp-black border-jp-black dark:border-white" : "border-jp-border dark:border-jp-border-dark text-jp-muted hover:border-jp-text dark:hover:border-white")}>
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="text-xs font-semibold text-jp-muted uppercase tracking-wider mb-2 block">Max Budget</label>
        <div className="relative">
          <select value={filters.max_price || ""} onChange={(e) => updateFilter("max_price", e.target.value)} className="jp-input text-sm appearance-none pr-7">
            <option value="">Any Budget</option>
            <option value="300000">Under ₹3 Lakh</option>
            <option value="500000">Under ₹5 Lakh</option>
            <option value="800000">Under ₹8 Lakh</option>
            <option value="1200000">Under ₹12 Lakh</option>
            <option value="2000000">Under ₹20 Lakh</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jp-muted pointer-events-none" />
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearAll} className="w-full text-sm font-semibold text-red-500 hover:text-red-700 transition-colors py-2 border border-red-200 dark:border-red-900 rounded-lg">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-jp-bg dark:bg-jp-black pt-16">
        <div className="jp-container py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-jp-text dark:text-white">
                Pre-Owned Cars{filters.brand ? ` · ${filters.brand}` : ""}
              </h1>
              <p className="text-sm text-jp-muted mt-0.5">
                {loading ? "Loading…" : `${vehicles.length} car${vehicles.length !== 1 ? "s" : ""} found`}
                {activeFilterCount > 0 && " (filtered)"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Sort */}
              <div className="relative">
                <select value={filters.sort || "recommended"} onChange={(e) => updateFilter("sort", e.target.value)} className="jp-input text-sm h-9 pr-7 appearance-none">
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-jp-muted pointer-events-none" />
              </div>
              {/* Mobile filter button */}
              <button onClick={() => setFilterOpen(true)} className="lg:hidden flex items-center gap-1.5 h-9 px-3 rounded-lg border border-jp-border dark:border-jp-border-dark text-sm font-medium text-jp-text dark:text-white hover:bg-white dark:hover:bg-jp-dark transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && <span className="w-4 h-4 bg-jp-gold text-white rounded-full text-xs flex items-center justify-center">{activeFilterCount}</span>}
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {activeChips.map((chip) => (
                <button key={chip.key} onClick={() => updateFilter(chip.key, "")}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-jp-black dark:bg-white text-white dark:text-jp-black">
                  {chip.label}
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button onClick={clearAll} className="px-3 py-1 rounded-full text-xs font-medium text-red-500 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Clear all
              </button>
            </div>
          )}

          <div className="flex gap-8">
            {/* Sidebar filters (desktop) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-20 p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                <FilterPanel />
              </div>
            </aside>

            {/* Vehicle grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-20">
                  <Search className="w-12 h-12 text-jp-muted mx-auto mb-4 opacity-30" />
                  <h3 className="font-semibold text-jp-text dark:text-white mb-2">No cars found</h3>
                  <p className="text-sm text-jp-muted mb-5">Try adjusting your filters</p>
                  <button onClick={clearAll} className="btn btn-secondary px-6 text-sm">Clear Filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {vehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      isWishlisted={wishlist.has(vehicle.id)}
                      onWishlistToggle={(id) => setWishlist((prev) => {
                        const next = new Set(prev);
                        next.has(id) ? next.delete(id) : next.add(id);
                        return next;
                      })}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {filterOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setFilterOpen(false)} />
              <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
                className="fixed left-0 top-0 bottom-0 z-[60] w-80 bg-white dark:bg-jp-dark shadow-2xl overflow-y-auto lg:hidden">
                <div className="flex items-center justify-between p-4 border-b border-jp-border dark:border-jp-border-dark sticky top-0 bg-white dark:bg-jp-dark">
                  <span className="font-bold">Filters</span>
                  <button onClick={() => setFilterOpen(false)} className="p-2 rounded-lg hover:bg-jp-bg dark:hover:bg-jp-black">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterPanel />
                  <button onClick={() => setFilterOpen(false)} className="btn btn-primary w-full mt-4">
                    Show {vehicles.length} Results
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
