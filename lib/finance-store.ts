import fs from "fs";
import path from "path";
import type { FinanceRequest } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "finance-requests.json");

const SEED_FINANCE_REQUESTS: FinanceRequest[] = [
  {
    id: "fin-1",
    name: "Ramesh Kumar",
    phone: "+91 98401 23456",
    email: "ramesh.k@gmail.com",
    vehicle_id: "demo-2",
    vehicle_title: "2021 Hyundai Creta SX Diesel",
    loan_amount: 800000,
    tenure_months: 60,
    employment_type: "Salaried (IT Professional)",
    message: "Looking for low down payment and HDFC or SBI car loan options. CIBIL score is 780.",
    status: "processing",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "fin-2",
    name: "Priya Sundaram",
    phone: "+91 97500 87654",
    email: "priya.sundaram@outlook.com",
    vehicle_id: "demo-1",
    vehicle_title: "2022 Maruti Suzuki Swift VXI",
    loan_amount: 450000,
    tenure_months: 48,
    employment_type: "Salaried (Teacher)",
    message: "Need instant approval. Can make ₹1.5L down payment immediately.",
    status: "new",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "fin-3",
    name: "Vijay Anand",
    phone: "+91 94432 11987",
    email: "anand.traders@gmail.com",
    vehicle_id: "demo-3",
    vehicle_title: "2020 Honda City VX CVT",
    loan_amount: 600000,
    tenure_months: 36,
    employment_type: "Self-Employed (Business Owner)",
    message: "GST returns available for 3 years. Looking for competitive interest rate below 9.5%.",
    status: "contacted",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "fin-4",
    name: "Karthik Subramanian",
    phone: "+91 98840 55432",
    email: "karthik.subramanian@gmail.com",
    vehicle_id: "demo-5",
    vehicle_title: "2019 Toyota Innova Crysta 2.4 VX",
    loan_amount: 1100000,
    tenure_months: 60,
    employment_type: "Business Owner",
    message: "Commercial / Personal use evaluation requested.",
    status: "completed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "fin-5",
    name: "Murugan Selvam",
    phone: "+91 99522 34120",
    email: "murugan.selvam@yahoo.com",
    vehicle_id: "demo-6",
    vehicle_title: "2021 Mahindra Thar LX 4x4",
    loan_amount: 900000,
    tenure_months: 48,
    employment_type: "Agriculturist & Business",
    message: "Land documents and ITR available. Looking for rural / agricultural financing tie-ups.",
    status: "new",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

let memoryCache: FinanceRequest[] | null = null;

function ensureDataFile(): FinanceRequest[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_FINANCE_REQUESTS, null, 2), "utf-8");
      memoryCache = [...SEED_FINANCE_REQUESTS];
      return memoryCache;
    }

    const content = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content) as FinanceRequest[];
    memoryCache = Array.isArray(parsed) ? parsed : [...SEED_FINANCE_REQUESTS];
    return memoryCache;
  } catch (error) {
    console.error("Error reading data/finance-requests.json:", error);
    if (!memoryCache) {
      memoryCache = [...SEED_FINANCE_REQUESTS];
    }
    return memoryCache;
  }
}

function saveDataFile(data: FinanceRequest[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    memoryCache = data;
  } catch (error) {
    console.error("Error saving data/finance-requests.json:", error);
    memoryCache = data;
  }
}

export function getFinanceRequests(): FinanceRequest[] {
  if (memoryCache) return memoryCache;
  return ensureDataFile();
}

export function getFinanceRequestById(id: string): FinanceRequest | undefined {
  return getFinanceRequests().find((r) => r.id === id);
}

export function addFinanceRequest(
  data: Omit<FinanceRequest, "id" | "created_at" | "updated_at"> & { id?: string }
): FinanceRequest {
  const list = getFinanceRequests();
  const now = new Date().toISOString();
  const newRecord: FinanceRequest = {
    ...data,
    id: data.id || `fin-${Date.now()}`,
    status: data.status || "new",
    created_at: now,
    updated_at: now,
  };

  const updated = [newRecord, ...list];
  saveDataFile(updated);
  return newRecord;
}

export function updateFinanceRequest(
  id: string,
  updates: Partial<Omit<FinanceRequest, "id" | "created_at">>
): FinanceRequest | null {
  const list = getFinanceRequests();
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = list[index];
  const updatedRecord: FinanceRequest = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const updated = [...list];
  updated[index] = updatedRecord;
  saveDataFile(updated);
  return updatedRecord;
}

export function deleteFinanceRequest(id: string): boolean {
  const list = getFinanceRequests();
  const filtered = list.filter((r) => r.id !== id);
  if (filtered.length === list.length) return false;
  saveDataFile(filtered);
  return true;
}
