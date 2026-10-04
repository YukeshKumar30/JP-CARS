import fs from "fs";
import path from "path";
import type { Vehicle } from "@/types";
import { DEMO_VEHICLES } from "./demo-data";

// On Vercel, only /tmp is writable
const IS_VERCEL = process.env.VERCEL === "1" || process.env.VERCEL_ENV !== undefined;
const DATA_DIR = IS_VERCEL ? "/tmp" : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "vehicles.json");
const SEED_FILE = path.join(process.cwd(), "data", "vehicles.json");

// In-memory cache for fast reads
let memoryCache: Vehicle[] | null = null;

function ensureDataFile(): Vehicle[] {
  try {
    if (IS_VERCEL) {
      // On Vercel: check /tmp first, then seed from committed file
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(content) as Vehicle[];
        memoryCache = parsed;
        return parsed;
      }
      if (fs.existsSync(SEED_FILE)) {
        const content = fs.readFileSync(SEED_FILE, "utf-8");
        const parsed = JSON.parse(content) as Vehicle[];
        fs.writeFileSync(DATA_FILE, content, "utf-8");
        memoryCache = parsed;
        return parsed;
      }
      memoryCache = [...DEMO_VEHICLES];
      return memoryCache;
    }

    // Local dev: use data/ directory
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEMO_VEHICLES, null, 2), "utf-8");
      memoryCache = [...DEMO_VEHICLES];
      return memoryCache;
    }
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content) as Vehicle[];
    memoryCache = parsed;
    return parsed;
  } catch (error) {
    console.error("Error accessing vehicles.json:", error);
    if (!memoryCache) {
      memoryCache = [...DEMO_VEHICLES];
    }
    return memoryCache;
  }
}

function saveVehicles(vehicles: Vehicle[]) {
  try {
    if (!IS_VERCEL && !fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(vehicles, null, 2), "utf-8");
    memoryCache = vehicles;
  } catch (error) {
    console.error("Error saving vehicles.json:", error);
    memoryCache = vehicles;
  }
}

export function getStoredVehicles(): Vehicle[] {
  if (memoryCache) return memoryCache;
  return ensureDataFile();
}

export function getStoredVehicleById(id: string): Vehicle | undefined {
  const vehicles = getStoredVehicles();
  return vehicles.find((v) => v.id === id);
}

export function getStoredVehicleBySlug(slug: string): Vehicle | undefined {
  const vehicles = getStoredVehicles();
  return vehicles.find((v) => v.slug === slug);
}

export function generateVehicleSlug(brand: string, model: string, variant?: string, year?: number): string {
  const parts = [
    year ? String(year) : "",
    brand,
    model,
    variant || "",
  ]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const existing = getStoredVehicles();
  let uniqueSlug = parts;
  let counter = 1;
  while (existing.some((v) => v.slug === uniqueSlug)) {
    uniqueSlug = `${parts}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

export function addStoredVehicle(data: Partial<Vehicle>): Vehicle {
  const vehicles = getStoredVehicles();
  const id = data.id || `veh-${Date.now()}`;
  const slug = data.slug || generateVehicleSlug(data.brand || "car", data.model || "vehicle", data.variant, data.year);
  const now = new Date().toISOString();

  const coverImage = data.cover_image || "";

  const newVehicle: Vehicle = {
    id,
    slug,
    brand: data.brand || "Maruti Suzuki",
    model: data.model || "Swift",
    variant: data.variant || "",
    year: Number(data.year) || new Date().getFullYear(),
    registration_year: Number(data.registration_year || data.year) || new Date().getFullYear(),
    fuel_type: data.fuel_type || "Petrol",
    transmission: data.transmission || "Manual",
    body_type: data.body_type || "Hatchback",
    kilometres: Number(data.kilometres) || 0,
    owners: Number(data.owners) || 1,
    price: Number(data.price) || 500000,
    engine: data.engine || "",
    mileage: data.mileage || "",
    power: data.power || "",
    torque: data.torque || "",
    seating: Number(data.seating) || 5,
    insurance: data.insurance || "Comprehensive",
    service_history: data.service_history !== undefined ? Boolean(data.service_history) : true,
    condition: data.condition || "Excellent",
    description: data.description || "",
    is_featured: Boolean(data.is_featured),
    is_published: data.is_published !== undefined ? Boolean(data.is_published) : true,
    status: data.status || "available",
    color: data.color || "White",
    registration_state: data.registration_state || "Tamil Nadu",
    instagram_link: data.instagram_link || "",
    created_at: now,
    updated_at: now,
    cover_image: coverImage,
    images: data.images && data.images.length > 0 ? data.images : [
      {
        id: `img-${id}-0`,
        vehicle_id: id,
        url: coverImage,
        is_cover: true,
        sort_order: 0,
        created_at: now,
      }
    ],
    features: data.features || [],
  };

  const updatedList = [newVehicle, ...vehicles];
  saveVehicles(updatedList);
  return newVehicle;
}

export function updateStoredVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
  const vehicles = getStoredVehicles();
  const index = vehicles.findIndex((v) => v.id === id);
  if (index === -1) return null;

  const current = vehicles[index];
  const now = new Date().toISOString();

  let coverImage = updates.cover_image !== undefined ? updates.cover_image : current.cover_image;
  let images = updates.images !== undefined ? updates.images : current.images;

  if (updates.cover_image && (!images || images.length === 0 || images[0].url !== updates.cover_image)) {
    images = [
      {
        id: `img-${id}-0`,
        vehicle_id: id,
        url: updates.cover_image,
        is_cover: true,
        sort_order: 0,
        created_at: now,
      },
      ...(images ? images.filter((img) => img.url !== updates.cover_image) : []),
    ];
  }

  const updatedVehicle: Vehicle = {
    ...current,
    ...updates,
    id: current.id, // cannot change id
    slug: updates.slug || current.slug,
    year: updates.year !== undefined ? Number(updates.year) : current.year,
    price: updates.price !== undefined ? Number(updates.price) : current.price,
    kilometres: updates.kilometres !== undefined ? Number(updates.kilometres) : current.kilometres,
    owners: updates.owners !== undefined ? Number(updates.owners) : current.owners,
    seating: updates.seating !== undefined ? Number(updates.seating) : current.seating,
    cover_image: coverImage,
    images,
    updated_at: now,
  };

  const updatedList = [...vehicles];
  updatedList[index] = updatedVehicle;
  saveVehicles(updatedList);
  return updatedVehicle;
}

export function deleteStoredVehicle(id: string): boolean {
  const vehicles = getStoredVehicles();
  const initialLength = vehicles.length;
  const filtered = vehicles.filter((v) => v.id !== id);
  if (filtered.length === initialLength) {
    return false;
  }
  saveVehicles(filtered);
  return true;
}
