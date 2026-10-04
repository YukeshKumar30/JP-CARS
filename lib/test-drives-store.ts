import fs from "fs";
import path from "path";
import type { TestDriveRequest } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "test-drives.json");

const SEED_TEST_DRIVES: TestDriveRequest[] = [
  {
    id: "td-1",
    name: "Deepak Raj",
    phone: "+91 98410 99887",
    email: "deepak.raj92@yahoo.com",
    vehicle_id: "demo-2",
    vehicle_title: "2021 Hyundai Creta SX Diesel",
    preferred_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().split("T")[0],
    preferred_time: "10:00 AM",
    message: "Would like to test drive on highway road near Kallakurichi bypass.",
    status: "confirmed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "td-2",
    name: "Senthil Nathan",
    phone: "+91 97890 12345",
    email: "senthil.nathan@gmail.com",
    vehicle_id: "demo-1",
    vehicle_title: "2022 Maruti Suzuki Swift VXI",
    preferred_date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().split("T")[0],
    preferred_time: "4:00 PM",
    message: "Bringing family along to check rear seat comfort and AC cooling.",
    status: "new",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "td-3",
    name: "Gokul Prasad",
    phone: "+91 94420 54321",
    email: "gokul.prasad@gmail.com",
    vehicle_id: "demo-6",
    vehicle_title: "2021 Mahindra Thar LX 4x4",
    preferred_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split("T")[0],
    preferred_time: "11:00 AM",
    message: "Checking 4WD engagement and highway stability.",
    status: "contacted",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
  },
  {
    id: "td-4",
    name: "Manikandan R",
    phone: "+91 98841 87654",
    email: "manikandan.r@gmail.com",
    vehicle_id: "demo-3",
    vehicle_title: "2020 Honda City VX CVT",
    preferred_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split("T")[0],
    preferred_time: "3:00 PM",
    message: "Test drive completed successfully. Customer requested quote with finance.",
    status: "completed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

let memoryCache: TestDriveRequest[] | null = null;

function ensureDataFile(): TestDriveRequest[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(SEED_TEST_DRIVES, null, 2), "utf-8");
      memoryCache = [...SEED_TEST_DRIVES];
      return memoryCache;
    }

    const content = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content) as TestDriveRequest[];
    memoryCache = Array.isArray(parsed) ? parsed : [...SEED_TEST_DRIVES];
    return memoryCache;
  } catch (error) {
    console.error("Error reading data/test-drives.json:", error);
    if (!memoryCache) {
      memoryCache = [...SEED_TEST_DRIVES];
    }
    return memoryCache;
  }
}

function saveDataFile(data: TestDriveRequest[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    memoryCache = data;
  } catch (error) {
    console.error("Error saving data/test-drives.json:", error);
    memoryCache = data;
  }
}

export function getTestDriveRequests(): TestDriveRequest[] {
  if (memoryCache) return memoryCache;
  return ensureDataFile();
}

export function addTestDriveRequest(
  data: Omit<TestDriveRequest, "id" | "created_at" | "updated_at"> & { id?: string }
): TestDriveRequest {
  const list = getTestDriveRequests();
  const now = new Date().toISOString();
  const newRecord: TestDriveRequest = {
    ...data,
    id: data.id || `td-${Date.now()}`,
    status: data.status || "new",
    created_at: now,
    updated_at: now,
  };

  const updated = [newRecord, ...list];
  saveDataFile(updated);
  return newRecord;
}

export function updateTestDriveRequest(
  id: string,
  updates: Partial<Omit<TestDriveRequest, "id" | "created_at">>
): TestDriveRequest | null {
  const list = getTestDriveRequests();
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const current = list[index];
  const updatedRecord: TestDriveRequest = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const updated = [...list];
  updated[index] = updatedRecord;
  saveDataFile(updated);
  return updatedRecord;
}

export function deleteTestDriveRequest(id: string): boolean {
  const list = getTestDriveRequests();
  const filtered = list.filter((r) => r.id !== id);
  if (filtered.length === list.length) return false;
  saveDataFile(filtered);
  return true;
}
