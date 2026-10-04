import fs from "fs";
import path from "path";
import type { FAQ } from "@/types";
import { DEMO_FAQS } from "./demo-data";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "faqs.json");

let memoryCache: FAQ[] | null = null;

function ensureDataFile(): FAQ[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEMO_FAQS, null, 2), "utf-8");
      memoryCache = [...DEMO_FAQS];
      return memoryCache;
    }

    const content = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content) as FAQ[];
    memoryCache = Array.isArray(parsed) ? parsed : [...DEMO_FAQS];
    return memoryCache;
  } catch (error) {
    console.error("Error reading data/faqs.json:", error);
    if (!memoryCache) {
      memoryCache = [...DEMO_FAQS];
    }
    return memoryCache;
  }
}

function saveDataFile(data: FAQ[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    memoryCache = data;
  } catch (error) {
    console.error("Error saving data/faqs.json:", error);
    memoryCache = data;
  }
}

export function getFAQs(): FAQ[] {
  if (memoryCache) return memoryCache;
  return ensureDataFile();
}

export function addFAQ(
  data: Omit<FAQ, "id"> & { id?: string }
): FAQ {
  const list = getFAQs();
  const newRecord: FAQ = {
    ...data,
    id: data.id || `faq-${Date.now()}`,
    sort_order: data.sort_order || list.length + 1,
    is_published: data.is_published !== undefined ? data.is_published : true,
  };

  const updated = [...list, newRecord];
  saveDataFile(updated);
  return newRecord;
}

export function updateFAQ(
  id: string,
  updates: Partial<Omit<FAQ, "id">>
): FAQ | null {
  const list = getFAQs();
  const index = list.findIndex((f) => f.id === id);
  if (index === -1) return null;

  const current = list[index];
  const updatedRecord: FAQ = {
    ...current,
    ...updates,
  };

  const updated = [...list];
  updated[index] = updatedRecord;
  saveDataFile(updated);
  return updatedRecord;
}

export function deleteFAQ(id: string): boolean {
  const list = getFAQs();
  const filtered = list.filter((f) => f.id !== id);
  if (filtered.length === list.length) return false;
  saveDataFile(filtered);
  return true;
}
