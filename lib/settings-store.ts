import fs from "fs";
import path from "path";
import { business } from "@/config/business";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "settings.json");

export interface DealershipSettings {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  googleMapsUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  whatsappCommunityUrl: string;
  whatsappCatalogUrl: string;
  currency: string;
  updated_at: string;
}

const DEFAULT_SETTINGS: DealershipSettings = {
  businessName: business.fullName,
  tagline: business.tagline,
  phone: business.phone,
  whatsapp: business.whatsapp,
  email: "contact@jpcars.in",
  address: "Kallakurichi Main Road, Kallakurichi, Tamil Nadu 606202",
  hours: business.hours,
  googleMapsUrl: business.googleMaps,
  instagramUrl: business.instagram,
  youtubeUrl: business.youtube,
  whatsappCommunityUrl: business.whatsappCommunity,
  whatsappCatalogUrl: business.whatsappCatalog,
  currency: "INR (₹)",
  updated_at: new Date().toISOString(),
};

let memoryCache: DealershipSettings | null = null;

function ensureDataFile(): DealershipSettings {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf-8");
      memoryCache = { ...DEFAULT_SETTINGS };
      return memoryCache;
    }

    const content = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content) as DealershipSettings;
    memoryCache = { ...DEFAULT_SETTINGS, ...parsed };
    return memoryCache;
  } catch (error) {
    console.error("Error reading data/settings.json:", error);
    if (!memoryCache) {
      memoryCache = { ...DEFAULT_SETTINGS };
    }
    return memoryCache;
  }
}

export function getDealershipSettings(): DealershipSettings {
  if (memoryCache) return memoryCache;
  return ensureDataFile();
}

export function updateDealershipSettings(updates: Partial<DealershipSettings>): DealershipSettings {
  const current = getDealershipSettings();
  const updated: DealershipSettings = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2), "utf-8");
    memoryCache = updated;
  } catch (error) {
    console.error("Error saving data/settings.json:", error);
    memoryCache = updated;
  }

  return updated;
}
