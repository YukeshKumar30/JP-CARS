"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, MessageCircle, GitCompare, Gauge, Calendar, Fuel, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Vehicle } from "@/types";
import { formatPrice, formatKM, estimateEMI, getVehicleTitle, cn } from "@/lib/utils";
import { getVehicleWhatsAppLink } from "@/config/business";
import { track } from "@/lib/analytics";

interface VehicleCardProps {
  vehicle: Vehicle;
  onWishlistToggle?: (id: string) => void;
  onCompareToggle?: (id: string) => void;
  isWishlisted?: boolean;
  isCompared?: boolean;
}

export function VehicleCard({
  vehicle,
  onWishlistToggle,
  onCompareToggle,
  isWishlisted = false,
  isCompared = false,
}: VehicleCardProps) {
  const [imgError, setImgError] = useState(false);
  const title = getVehicleTitle(vehicle);
  const emi = estimateEMI(vehicle.price);
  const whatsappLink = getVehicleWhatsAppLink({
    title,
    price: vehicle.price,
    year: vehicle.year,
    kilometres: vehicle.kilometres,
  });

  const coverImage = vehicle.cover_image || vehicle.images?.[0]?.url;
  const statusColors: Record<string, string> = {
    available: "badge-available",
    reserved: "badge-reserved",
    sold: "badge-sold",
  };

  return (
    <motion.article
      className="vehicle-card bg-white dark:bg-jp-dark rounded-2xl overflow-hidden border border-jp-border dark:border-jp-border-dark group"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image */}
      <Link href={`/cars/${vehicle.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-jp-bg dark:bg-jp-black">
        {coverImage && !imgError ? (
          <img
            src={coverImage}
            alt={title}
            className="vehicle-image object-cover w-full h-full absolute inset-0"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-jp-muted">
            <Fuel className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status badge */}
        <div className={cn("absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold", statusColors[vehicle.status])}>
          {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
        </div>

        {/* Featured badge */}
        {vehicle.is_featured && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold bg-jp-gold text-white">
            Featured
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              onWishlistToggle?.(vehicle.id);
              track("wishlist_add", { vehicle_id: vehicle.id });
            }}
            whileTap={{ scale: 0.85 }}
            className="p-2 rounded-full bg-white/90 dark:bg-jp-dark/90 backdrop-blur-sm shadow-sm"
            aria-label="Add to wishlist"
          >
            <Heart className={cn("w-4 h-4", isWishlisted ? "fill-red-500 text-red-500" : "text-jp-muted")} />
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              onCompareToggle?.(vehicle.id);
              track("compare_add", { vehicle_id: vehicle.id });
            }}
            whileTap={{ scale: 0.85 }}
            className={cn(
              "p-2 rounded-full bg-white/90 dark:bg-jp-dark/90 backdrop-blur-sm shadow-sm",
              isCompared ? "bg-jp-blue/10" : ""
            )}
            aria-label="Add to compare"
          >
            <GitCompare className={cn("w-4 h-4", isCompared ? "text-jp-blue-light" : "text-jp-muted")} />
          </motion.button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Brand tag */}
        <p className="text-xs font-semibold text-jp-gold uppercase tracking-wider mb-1">{vehicle.brand}</p>

        {/* Title */}
        <Link href={`/cars/${vehicle.slug}`}>
          <h3 className="font-bold text-base text-jp-text dark:text-white leading-tight mb-1 hover:text-jp-blue-light dark:hover:text-jp-blue-light transition-colors line-clamp-1">
            {vehicle.model}{vehicle.variant ? ` ${vehicle.variant}` : ""}
          </h3>
        </Link>

        {/* Specs */}
        <div className="flex items-center gap-3 text-xs text-jp-muted mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {vehicle.year}
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="w-3 h-3" />
            {formatKM(vehicle.kilometres)}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="w-3 h-3" />
            {vehicle.fuel_type}
          </span>
        </div>

        {/* Transmission pill */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded-full bg-jp-bg dark:bg-jp-black text-xs font-medium text-jp-muted border border-jp-border dark:border-jp-border-dark">
            {vehicle.transmission}
          </span>
          {vehicle.owners === 1 && (
            <span className="px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-xs font-medium text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800">
              1st Owner
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <p className="price-display text-xl">{formatPrice(vehicle.price)}</p>
            <p className="text-xs text-jp-muted">EMI ~{formatPrice(emi)}/mo</p>
          </div>

          {/* Actions */}
          <div className="flex gap-1.5">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { vehicle_id: vehicle.id, source: "card" })}
              className="p-2 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-200"
              aria-label="WhatsApp enquiry"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <Link
              href={`/cars/${vehicle.slug}`}
              className="p-2 rounded-lg bg-jp-black/5 dark:bg-white/10 text-jp-text dark:text-white hover:bg-jp-black dark:hover:bg-white hover:text-white dark:hover:text-jp-black transition-all duration-200"
              aria-label="View details"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
