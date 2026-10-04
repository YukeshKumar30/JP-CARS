import type { MetadataRoute } from "next";
import { DEMO_VEHICLES } from "@/lib/demo-data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jpcarskallakurichi.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), priority: 1 },
    { url: `${BASE_URL}/cars`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/sell-your-car`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/finance`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/test-drive`, lastModified: new Date(), priority: 0.7 },
  ];

  const vehiclePages = DEMO_VEHICLES.filter(v => v.is_published).map(v => ({
    url: `${BASE_URL}/cars/${v.slug}`,
    lastModified: new Date(v.updated_at),
    priority: 0.7,
  }));

  return [...staticPages, ...vehiclePages];
}
