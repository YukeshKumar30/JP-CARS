import fs from "node:fs";
import path from "node:path";
import type { SellCarRequest } from "@/types";

const DATA_DIRECTORY = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIRECTORY, "sell-car-requests.json");

function readRequests(): SellCarRequest[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const requests = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return Array.isArray(requests) ? requests as SellCarRequest[] : [];
  } catch (error) {
    console.error("Error reading data/sell-car-requests.json:", error);
    return [];
  }
}

export function getSellCarRequests() {
  return readRequests();
}

export function addSellCarRequest(
  request: Omit<SellCarRequest, "id" | "status" | "created_at" | "updated_at">
) {
  const requests = readRequests();
  const now = new Date().toISOString();
  const savedRequest: SellCarRequest = {
    ...request,
    id: crypto.randomUUID(),
    status: "new",
    created_at: now,
    updated_at: now,
  };

  fs.mkdirSync(DATA_DIRECTORY, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify([savedRequest, ...requests], null, 2), "utf8");
  return savedRequest;
}