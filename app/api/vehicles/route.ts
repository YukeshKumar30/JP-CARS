import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import {
  getStoredVehicles,
  addStoredVehicle,
  updateStoredVehicle,
  deleteStoredVehicle,
} from "@/lib/vehicles-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const brand = searchParams.get("brand");
    const query = searchParams.get("q");

    let list = getStoredVehicles();

    if (status && status !== "all") {
      list = list.filter((v) => v.status === status);
    }
    if (brand && brand !== "all") {
      list = list.filter((v) => v.brand.toLowerCase() === brand.toLowerCase());
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (v) =>
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.variant?.toLowerCase().includes(q) ||
          String(v.year).includes(q)
      );
    }

    return NextResponse.json({ success: true, vehicles: list, count: list.length });
  } catch (error) {
    console.error("GET /api/vehicles error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!await hasAdminSession()) {
    return NextResponse.json({ success: false, error: "Admin sign-in required" }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!body.brand || !body.model || !body.year || body.price === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: brand, model, year, price" },
        { status: 400 }
      );
    }

    const created = addStoredVehicle(body);
    return NextResponse.json({ success: true, vehicle: created }, { status: 201 });
  } catch (error) {
    console.error("POST /api/vehicles error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!await hasAdminSession()) {
    return NextResponse.json({ success: false, error: "Admin sign-in required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Vehicle id is required for update" },
        { status: 400 }
      );
    }

    const updated = updateStoredVehicle(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Vehicle with id ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, vehicle: updated });
  } catch (error) {
    console.error("PUT /api/vehicles error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!await hasAdminSession()) {
    return NextResponse.json({ success: false, error: "Admin sign-in required" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Vehicle id is required" },
        { status: 400 }
      );
    }

    const success = deleteStoredVehicle(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: `Vehicle with id ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Vehicle deleted successfully", id });
  } catch (error) {
    console.error("DELETE /api/vehicles error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete vehicle" },
      { status: 500 }
    );
  }
}
