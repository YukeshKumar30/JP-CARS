import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoredVehicleBySlug, getStoredVehicles } from "@/lib/vehicles-store";
import { DEMO_VEHICLES } from "@/lib/demo-data";
import { VehicleDetailClient } from "./vehicle-detail-client";
import { getVehicleTitle } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const vehicles = getStoredVehicles();
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getStoredVehicleBySlug(slug) || DEMO_VEHICLES.find((v) => v.slug === slug);
  if (!vehicle) return { title: "Vehicle Not Found" };
  const title = getVehicleTitle(vehicle);
  return {
    title,
    description: `Buy ${title} — ${vehicle.kilometres.toLocaleString("en-IN")} km, ${vehicle.fuel_type}, ${vehicle.transmission}. Available at JP CARS Kallakurichi.`,
  };
}

export default async function VehicleDetailPage({ params }: Props) {
  const { slug } = await params;
  const vehicle = getStoredVehicleBySlug(slug) || DEMO_VEHICLES.find((v) => v.slug === slug);
  if (!vehicle) notFound();
  return <VehicleDetailClient vehicle={vehicle} />;
}
