import fs from "fs";
import path from "path";
import type { Lead } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "leads.json");

const SEED_LEADS: Lead[] = [
  {
    id: "lead-1",
    type: "vehicle_enquiry",
    name: "Saravanan Natarajan",
    phone: "+91 99441 55678",
    email: "saravanan.n@gmail.com",
    vehicle_id: "demo-1",
    vehicle_title: "2022 Maruti Suzuki Swift VXI",
    message: "Is the Swift single owner and accident free? Can I inspect it tomorrow at your showroom?",
    status: "new",
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "lead-2",
    type: "test_drive",
    name: "Deepak Raj",
    phone: "+91 98410 99887",
    email: "deepak.raj92@yahoo.com",
    vehicle_id: "demo-2",
    vehicle_title: "2021 Hyundai Creta SX Diesel",
    message: "Requested test drive on Saturday morning around 10:30 AM.",
    status: "contacted",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "lead-3",
    type: "finance",
    name: "Ramesh Kumar",
    phone: "+91 98401 23456",
    email: "ramesh.k@gmail.com",
    vehicle_id: "demo-2",
    vehicle_title: "2021 Hyundai Creta SX Diesel",
    message: "Wants to know maximum loan tenure and bank interest rates for Creta.",
    status: "follow_up",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "lead-4",
    type: "sell_car",
    name: "Muthu Velu",
    phone: "+91 94440 12345",
    email: "muthu.velu@gmail.com",
    message: "Want to sell 2018 Honda Amaze Diesel (Manual, 62,000 km, 1st Owner). Need valuation.",
    status: "contacted",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "lead-5",
    type: "general",
    name: "Kavitha Sundar",
    phone: "+91 97911 34567",
    email: "kavitha.s@gmail.com",
    message: "Looking for automatic hatchbacks under ₹6 Lakhs for daily city commute in Kallakurichi.",
    status: "new",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
  {
    id: "lead-6",
    type: "vehicle_enquiry",
    name: "Anand Venkatesh",
    phone: "+91 98845 67890",
    email: "anand.v@gmail.com",
    vehicle_id: "demo-3",
    vehicle_title: "2020 Honda City VX CVT",
    message: "Is negotiation possible on Honda City price? Ready with immediate payment.",
    status: "completed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

let memoryCache: Lead[] | null = null;

function ensureDataFile(): Lead[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_LEADS, null, 2), "utf-8");
      memoryCache = [...SEED_LEADS];
      return memoryCache;
    }

    const content = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content) as Lead[];
    memoryCache = Array.isArray(parsed) ? parsed : [...SEED_LEADS];
    return memoryCache;
  } catch (error) {
    console.error("Error reading data/leads.json:", error);
    if (!memoryCache) {
      memoryCache = [...SEED_LEADS];
    }
    return memoryCache;
  }
}

function saveDataFile(data: Lead[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    memoryCache = data;
  } catch (error) {
    console.error("Error saving data/leads.json:", error);
    memoryCache = data;
  }
}

export function getLeads(): Lead[] {
  if (memoryCache) return memoryCache;
  return ensureDataFile();
}

export function getLeadById(id: string): Lead | undefined {
  return getLeads().find((l) => l.id === id);
}

export function addLead(
  data: Omit<Lead, "id" | "created_at" | "updated_at"> & { id?: string }
): Lead {
  const list = getLeads();
  const now = new Date().toISOString();
  const newLead: Lead = {
    ...data,
    id: data.id || `lead-${Date.now()}`,
    status: data.status || "new",
    created_at: now,
    updated_at: now,
  };

  const updated = [newLead, ...list];
  saveDataFile(updated);
  return newLead;
}

export function updateLead(
  id: string,
  updates: Partial<Omit<Lead, "id" | "created_at">>
): Lead | null {
  const list = getLeads();
  const index = list.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const current = list[index];
  const updatedLead: Lead = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const updated = [...list];
  updated[index] = updatedLead;
  saveDataFile(updated);
  return updatedLead;
}

export function deleteLead(id: string): boolean {
  const list = getLeads();
  const filtered = list.filter((l) => l.id !== id);
  if (filtered.length === list.length) return false;
  saveDataFile(filtered);
  return true;
}
