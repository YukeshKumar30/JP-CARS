import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getStoredVehicleById,
  updateStoredVehicle,
  deleteStoredVehicle,
} from "@/lib/vehicles-store";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const vehicle = getStoredVehicleById(id);

    if (!vehicle) {
      return NextResponse.json({ success: false, error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error("GET /api/vehicles/[id] error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!await hasAdminSession()) {
    return NextResponse.json({ success: false, error: "Admin sign-in required" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = updateStoredVehicle(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, vehicle: updated });
  } catch (error) {
    console.error("PUT /api/vehicles/[id] error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!await hasAdminSession()) {
    return NextResponse.json({ success: false, error: "Admin sign-in required" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = deleteStoredVehicle(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Vehicle not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/vehicles/[id] error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
