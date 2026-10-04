import type { Metadata } from "next";
import { getStoredVehicles } from "@/lib/vehicles-store";
import { CarsPageClient } from "./cars-page-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buy Pre-Owned Cars",
  description: "Browse our verified inventory of pre-owned cars in Kallakurichi. Filter by brand, budget, fuel, and more.",
};

export default function CarsPage() {
  const initialVehicles = getStoredVehicles();
  return <CarsPageClient initialVehicles={initialVehicles} />;
}
