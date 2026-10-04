import fs from "fs";
import path from "path";
import type { Review } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "reviews.json");

const SEED_REVIEWS: Review[] = [
  {
    id: "rev-1",
    customer_name: "Aravind Swaminathan",
    rating: 5,
    comment: "Bought my 2021 Hyundai Creta from JP CARS. Very honest disclosure about previous owner and service history. RC transfer was handled smoothly in just 10 days.",
    vehicle_id: "demo-2",
    vehicle_title: "2021 Hyundai Creta SX Diesel",
    is_published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "rev-2",
    customer_name: "Dr. K. Chandrasekar",
    rating: 5,
    comment: "Best pre-owned car dealer in Kallakurichi region. The vehicle condition is exactly as shown on the website. No hidden charges or commission surprises.",
    vehicle_id: "demo-3",
    vehicle_title: "2020 Honda City VX CVT",
    is_published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: "rev-3",
    customer_name: "Prakash Rajendran",
    rating: 5,
    comment: "Sold my old Swift and bought an Innova Crysta. Got the highest evaluation price compared to online portals. Very polite and professional staff.",
    vehicle_id: "demo-5",
    vehicle_title: "2019 Toyota Innova Crysta 2.4 VX",
    is_published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
  },
  {
    id: "rev-4",
    customer_name: "Subhashree Natarajan",
    rating: 4,
    comment: "Finance process was fast through Cholamandalam Finance arranged by JP CARS. Received car delivery on auspicious day with full tank and detailed wash.",
    vehicle_id: "demo-1",
    vehicle_title: "2022 Maruti Suzuki Swift VXI",
    is_published: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
];

let memoryCache: Review[] | null = null;

function ensureDataFile(): Review[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_REVIEWS, null, 2), "utf-8");
      memoryCache = [...SEED_REVIEWS];
      return memoryCache;
    }

    const content = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content) as Review[];
    memoryCache = Array.isArray(parsed) ? parsed : [...SEED_REVIEWS];
    return memoryCache;
  } catch (error) {
    console.error("Error reading data/reviews.json:", error);
    if (!memoryCache) {
      memoryCache = [...SEED_REVIEWS];
    }
    return memoryCache;
  }
}

function saveDataFile(data: Review[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    memoryCache = data;
  } catch (error) {
    console.error("Error saving data/reviews.json:", error);
    memoryCache = data;
  }
}

export function getReviews(): Review[] {
  if (memoryCache) return memoryCache;
  return ensureDataFile();
}

export function addReview(
  data: Omit<Review, "id" | "created_at"> & { id?: string }
): Review {
  const list = getReviews();
  const newRecord: Review = {
    ...data,
    id: data.id || `rev-${Date.now()}`,
    is_published: data.is_published !== undefined ? data.is_published : true,
    created_at: new Date().toISOString(),
  };

  const updated = [newRecord, ...list];
  saveDataFile(updated);
  return newRecord;
}

export function updateReview(
  id: string,
  updates: Partial<Omit<Review, "id" | "created_at">>
): Review | null {
  const list = getReviews();
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = list[index];
  const updatedRecord: Review = {
    ...current,
    ...updates,
  };

  const updated = [...list];
  updated[index] = updatedRecord;
  saveDataFile(updated);
  return updatedRecord;
}

export function deleteReview(id: string): boolean {
  const list = getReviews();
  const filtered = list.filter((r) => r.id !== id);
  if (filtered.length === list.length) return false;
  saveDataFile(filtered);
  return true;
}
