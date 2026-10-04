"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Trash2 } from "lucide-react";
import { PageTransition, Reveal } from "@/components/shared/animations";
import { VehicleCard } from "@/components/cars/vehicle-card";
import { DEMO_VEHICLES } from "@/lib/demo-data";

export default function SavedCarsPage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("jp-wishlist");
    if (stored) setSavedIds(JSON.parse(stored));
    setMounted(true);
  }, []);

  const savedVehicles = DEMO_VEHICLES.filter(v => savedIds.includes(v.id));

  const removeAll = () => {
    setSavedIds([]);
    localStorage.removeItem("jp-wishlist");
  };

  if (!mounted) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-jp-bg dark:bg-jp-black pt-16">
        <div className="jp-container py-12">
          <Reveal className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-jp-text dark:text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Saved Cars
              </h1>
              <p className="text-jp-muted text-sm mt-0.5">{savedVehicles.length} saved vehicle{savedVehicles.length !== 1 ? "s" : ""}</p>
            </div>
            {savedVehicles.length > 0 && (
              <button onClick={removeAll} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors">
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </Reveal>

          {savedVehicles.length === 0 ? (
            <div className="text-center py-24">
              <Heart className="w-14 h-14 text-jp-muted mx-auto mb-4 opacity-30" />
              <h2 className="text-xl font-bold text-jp-text dark:text-white mb-2">No saved cars yet</h2>
              <p className="text-jp-muted text-sm mb-6">Browse cars and tap the heart to save your favourites.</p>
              <Link href="/cars" className="btn btn-primary px-8">
                Browse Cars
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedVehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} isWishlisted />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
