"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GitCompare, ArrowRight, X, CheckCircle, XCircle } from "lucide-react";
import { PageTransition, Reveal } from "@/components/shared/animations";
import { DEMO_VEHICLES } from "@/lib/demo-data";
import { formatPrice, formatKM, getVehicleTitle } from "@/lib/utils";

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selected = DEMO_VEHICLES.filter(v => selectedIds.includes(v.id));
  const available = DEMO_VEHICLES.filter(v => v.is_published && !selectedIds.includes(v.id)).slice(0, 12);

  const addVehicle = (id: string) => {
    if (selectedIds.length >= 3) return;
    setSelectedIds(p => [...p, id]);
  };

  const removeVehicle = (id: string) => setSelectedIds(p => p.filter(i => i !== id));

  const specs = [
    { key: "price", label: "Price", format: (v: typeof DEMO_VEHICLES[0]) => formatPrice(v.price) },
    { key: "year", label: "Year", format: (v: typeof DEMO_VEHICLES[0]) => String(v.year) },
    { key: "kilometres", label: "Kilometres", format: (v: typeof DEMO_VEHICLES[0]) => formatKM(v.kilometres) },
    { key: "fuel_type", label: "Fuel", format: (v: typeof DEMO_VEHICLES[0]) => v.fuel_type },
    { key: "transmission", label: "Transmission", format: (v: typeof DEMO_VEHICLES[0]) => v.transmission },
    { key: "owners", label: "Owners", format: (v: typeof DEMO_VEHICLES[0]) => `${v.owners} Owner${v.owners > 1 ? "s" : ""}` },
    { key: "engine", label: "Engine", format: (v: typeof DEMO_VEHICLES[0]) => v.engine || "—" },
    { key: "mileage", label: "Mileage", format: (v: typeof DEMO_VEHICLES[0]) => v.mileage || "—" },
    { key: "power", label: "Power", format: (v: typeof DEMO_VEHICLES[0]) => v.power || "—" },
    { key: "body_type", label: "Body Type", format: (v: typeof DEMO_VEHICLES[0]) => v.body_type || "—" },
    { key: "service_history", label: "Service History", format: (v: typeof DEMO_VEHICLES[0]) => v.service_history ? "Available" : "Not Available" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-jp-bg dark:bg-jp-black pt-16">
        <div className="jp-container py-12">
          <Reveal className="mb-8">
            <h1 className="text-2xl font-bold text-jp-text dark:text-white flex items-center gap-2">
              <GitCompare className="w-6 h-6 text-jp-gold" />
              Compare Cars
            </h1>
            <p className="text-jp-muted text-sm mt-0.5">Select up to 3 vehicles to compare side-by-side</p>
          </Reveal>

          {selected.length === 0 ? (
            <>
              <div className="text-center py-10 mb-8">
                <GitCompare className="w-12 h-12 text-jp-muted mx-auto mb-3 opacity-30" />
                <p className="text-jp-muted">Select vehicles below to start comparing</p>
              </div>
              <h2 className="font-semibold text-jp-text dark:text-white mb-4">Available Cars</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {available.map(v => (
                  <button key={v.id} onClick={() => addVehicle(v.id)}
                    className="p-3 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-left hover:border-jp-gold/40 hover:shadow-sm transition-all">
                    <p className="font-semibold text-jp-text dark:text-white text-sm line-clamp-1">{v.brand} {v.model}</p>
                    <p className="text-xs text-jp-muted">{v.year} · {formatPrice(v.price)}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Compare table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-jp-muted uppercase tracking-wider w-32">Spec</th>
                      {selected.map(v => (
                        <th key={v.id} className="p-3 min-w-[200px]">
                          <div className="relative rounded-xl overflow-hidden bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark p-3">
                            {v.cover_image && (
                              <div className="relative h-24 mb-2 rounded-lg overflow-hidden">
                                <Image src={v.cover_image} alt={getVehicleTitle(v)} fill className="object-cover" sizes="200px" />
                              </div>
                            )}
                            <button onClick={() => removeVehicle(v.id)}
                              className="absolute top-2 right-2 w-6 h-6 bg-jp-bg dark:bg-jp-black rounded-full flex items-center justify-center">
                              <X className="w-3.5 h-3.5 text-jp-muted" />
                            </button>
                            <p className="font-bold text-jp-text dark:text-white text-sm">{v.brand} {v.model}</p>
                            <p className="text-xs text-jp-muted">{v.variant}</p>
                            <p className="font-bold text-jp-gold text-sm mt-1">{formatPrice(v.price)}</p>
                          </div>
                        </th>
                      ))}
                      {selected.length < 3 && (
                        <th className="p-3 min-w-[200px]">
                          <div className="h-full border-2 border-dashed border-jp-border dark:border-jp-border-dark rounded-xl p-8 flex flex-col items-center justify-center text-jp-muted">
                            <span className="text-2xl mb-1">+</span>
                            <span className="text-xs">Add Vehicle</span>
                          </div>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {specs.map((spec, i) => (
                      <tr key={spec.key} className={i % 2 === 0 ? "bg-white dark:bg-jp-dark" : "bg-jp-bg dark:bg-jp-black"}>
                        <td className="p-3 text-xs font-semibold text-jp-muted">{spec.label}</td>
                        {selected.map(v => (
                          <td key={v.id} className="p-3 text-sm text-jp-text dark:text-white text-center">
                            {spec.format(v)}
                          </td>
                        ))}
                        {selected.length < 3 && <td />}
                      </tr>
                    ))}
                    <tr>
                      <td className="p-3" />
                      {selected.map(v => (
                        <td key={v.id} className="p-3">
                          <Link href={`/cars/${v.slug}`} className="btn btn-primary w-full text-xs py-2">
                            View Details <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Add more */}
              {selected.length < 3 && (
                <div className="mt-6">
                  <h2 className="font-semibold text-jp-text dark:text-white mb-3">Add Another Car</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {available.map(v => (
                      <button key={v.id} onClick={() => addVehicle(v.id)}
                        className="p-3 rounded-xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-left hover:border-jp-gold/40 hover:shadow-sm transition-all">
                        <p className="font-semibold text-jp-text dark:text-white text-sm line-clamp-1">{v.brand} {v.model}</p>
                        <p className="text-xs text-jp-muted">{v.year} · {formatPrice(v.price)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
