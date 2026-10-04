"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone, MessageCircle, MapPin, Share2, Heart, Calendar,
  Gauge, Fuel, Users, ArrowLeft, CheckCircle, ChevronLeft, ChevronRight,
  Maximize2, GitCompare, Instagram
} from "lucide-react";
import type { Vehicle } from "@/types";
import { formatPrice, formatKM, getVehicleTitle, calculateEMI, cn } from "@/lib/utils";
import { getVehicleWhatsAppLink, business } from "@/config/business";
import { track } from "@/lib/analytics";
import { PageTransition } from "@/components/shared/animations";

interface Props { vehicle: Vehicle; }

const statusLabel: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

export function VehicleDetailClient({ vehicle }: Props) {
  const [currentImg, setCurrentImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const images = vehicle.images?.length ? vehicle.images : [{
    id: "fallback", url: vehicle.cover_image || "", is_cover: true, sort_order: 0, vehicle_id: vehicle.id, created_at: ""
  }];

  const title = getVehicleTitle(vehicle);
  const whatsappLink = getVehicleWhatsAppLink({ title, price: vehicle.price, year: vehicle.year, kilometres: vehicle.kilometres });
  const emi = calculateEMI(vehicle.price, vehicle.price * 0.2, 9, 60);

  const specs = [
    { label: "Year", value: vehicle.year },
    { label: "Kilometres", value: formatKM(vehicle.kilometres) },
    { label: "Fuel", value: vehicle.fuel_type },
    { label: "Transmission", value: vehicle.transmission },
    { label: "Owners", value: `${vehicle.owners} Owner${vehicle.owners > 1 ? "s" : ""}` },
    { label: "Body Type", value: vehicle.body_type || "—" },
    { label: "Engine", value: vehicle.engine || "—" },
    { label: "Mileage", value: vehicle.mileage || "—" },
    { label: "Power", value: vehicle.power || "—" },
    { label: "Seating", value: vehicle.seating ? `${vehicle.seating} Seats` : "—" },
    { label: "Insurance", value: vehicle.insurance || "—" },
    { label: "Service History", value: vehicle.service_history ? "Available" : "Not Available" },
    { label: "Condition", value: vehicle.condition || "—" },
    { label: "Color", value: vehicle.color || "—" },
  ];

  const handleShare = async () => {
    try {
      await navigator.share({ title, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-jp-bg dark:bg-jp-black pt-16 pb-24 lg:pb-8">
        <div className="jp-container py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-jp-muted mb-6">
            <Link href="/cars" className="flex items-center gap-1 hover:text-jp-text dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              All Cars
            </Link>
            <span>/</span>
            <span className="text-jp-text dark:text-white font-medium">{vehicle.brand} {vehicle.model}</span>
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Left: Gallery + Details */}
            <div>
              {/* Main image */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-jp-bg dark:bg-jp-dark mb-3 group">
                {images[currentImg]?.url ? (
                  <img
                    src={images[currentImg].url}
                    alt={`${title} - image ${currentImg + 1}`}
                    className="object-cover w-full h-full absolute inset-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-jp-muted">No image</div>
                )}

                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImg((c) => (c - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-jp-dark/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setCurrentImg((c) => (c + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-jp-dark/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 text-white text-xs rounded-full">
                  {currentImg + 1} / {images.length}
                </div>

                {/* Status badge */}
                <div className={cn("absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold",
                  vehicle.status === "available" ? "badge-available" : vehicle.status === "reserved" ? "badge-reserved" : "badge-sold")}>
                  {statusLabel[vehicle.status]}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button key={img.id} onClick={() => setCurrentImg(i)}
                      className={cn("relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                        i === currentImg ? "border-jp-gold" : "border-transparent opacity-60 hover:opacity-100")}>
                      <img src={img.url} alt={`Thumbnail ${i + 1}`} className="object-cover w-full h-full absolute inset-0" />
                    </button>
                  ))}
                </div>
              )}

              {/* Specs grid */}
              <div className="mt-8 p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                <h2 className="font-bold text-jp-text dark:text-white mb-5">Vehicle Specifications</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                  {specs.map((s) => (
                    <div key={s.label}>
                      <p className="text-xs text-jp-muted mb-0.5">{s.label}</p>
                      <p className="text-sm font-semibold text-jp-text dark:text-white">{String(s.value)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              {vehicle.description && (
                <div className="mt-5 p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                  <h2 className="font-bold text-jp-text dark:text-white mb-3">About This Car</h2>
                  <p className="text-sm text-jp-muted leading-relaxed">{vehicle.description}</p>
                </div>
              )}
            </div>

            {/* Right: Sticky sidebar */}
            <div>
              <div className="sticky top-20 space-y-4">
                {/* Price card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                  <p className="text-xs text-jp-gold font-semibold uppercase tracking-wider mb-1">{vehicle.brand}</p>
                  <h1 className="text-xl font-bold text-jp-text dark:text-white mb-0.5">
                    {vehicle.model}{vehicle.variant ? ` ${vehicle.variant}` : ""}
                  </h1>
                  <p className="text-sm text-jp-muted mb-4">{vehicle.year} · {formatKM(vehicle.kilometres)} · {vehicle.fuel_type} · {vehicle.transmission}</p>

                  <div className="mb-1">
                    <div className="price-display text-3xl">{formatPrice(vehicle.price)}</div>
                  </div>
                  <p className="text-sm text-jp-muted mb-5">EMI from {formatPrice(emi.monthlyEMI)}/month*</p>

                  {/* Action buttons */}
                  <div className="space-y-2.5">
                    <Link href="/test-drive" className="btn btn-primary w-full">
                      <Calendar className="w-4 h-4" />
                      Book Test Drive
                    </Link>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track("whatsapp_click", { vehicle_id: vehicle.id, source: "detail" })}
                      className="btn btn-whatsapp w-full"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp Enquiry
                    </a>
                    <a
                      href={`tel:${business.phoneRaw}`}
                      onClick={() => track("call_click", { vehicle_id: vehicle.id })}
                      className="btn btn-secondary w-full"
                    >
                      <Phone className="w-4 h-4" />
                      {business.phone}
                    </a>
                  </div>

                  {/* Instagram Reel link */}
                  {vehicle.instagram_link && (
                    <a
                      href={vehicle.instagram_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track("instagram_click", { vehicle_id: vehicle.id })}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                      style={{
                        background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                      }}
                    >
                      <Instagram className="w-4 h-4" />
                      Watch on Instagram
                    </a>
                  )}

                  {/* Secondary actions */}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setWishlisted(!wishlisted)}
                      className={cn("flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border transition-all",
                        wishlisted ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-500" : "border-jp-border dark:border-jp-border-dark text-jp-muted hover:border-jp-text dark:hover:border-white")}>
                      <Heart className={cn("w-4 h-4", wishlisted && "fill-current")} />
                      {wishlisted ? "Saved" : "Save"}
                    </button>
                    <button onClick={handleShare}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border border-jp-border dark:border-jp-border-dark text-jp-muted hover:border-jp-text dark:hover:border-white transition-all">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <a href={business.googleMaps} target="_blank" rel="noopener noreferrer"
                      onClick={() => track("directions_click", { source: "detail" })}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border border-jp-border dark:border-jp-border-dark text-jp-muted hover:border-jp-text dark:hover:border-white transition-all">
                      <MapPin className="w-4 h-4" />
                      Visit
                    </a>
                  </div>

                  <p className="text-xs text-jp-muted mt-3 text-center">*EMI estimate. Actual rates may vary by lender.</p>
                </div>

                {/* Key highlights */}
                <div className="p-4 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark">
                  <h3 className="text-sm font-semibold text-jp-text dark:text-white mb-3">Key Highlights</h3>
                  <div className="space-y-2">
                    {[
                      `${vehicle.owners} Owner${vehicle.owners > 1 ? "s" : ""}`,
                      vehicle.service_history ? "Full Service History" : "Service Records Available",
                      `${vehicle.condition || "Good"} Condition`,
                      vehicle.insurance || "Valid Insurance",
                    ].map((h) => (
                      <div key={h} className="flex items-center gap-2 text-sm text-jp-muted">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-jp-dark border-t border-jp-border dark:border-jp-border-dark p-3 flex gap-2">
        <a href={`tel:${business.phoneRaw}`} onClick={() => track("call_click", { source: "mobile_sticky" })}
          className="flex-1 btn btn-secondary py-2.5 text-sm gap-1.5">
          <Phone className="w-4 h-4" />
          Call
        </a>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { vehicle_id: vehicle.id, source: "mobile_sticky" })}
          className="flex-1 btn btn-whatsapp py-2.5 text-sm gap-1.5">
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <Link href="/test-drive" className="flex-1 btn btn-primary py-2.5 text-sm gap-1.5">
          <Calendar className="w-4 h-4" />
          Test Drive
        </Link>
      </div>
    </PageTransition>
  );
}
