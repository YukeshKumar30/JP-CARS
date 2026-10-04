import { NextResponse } from "next/server";
import {
  getTestDriveRequests,
  addTestDriveRequest,
  updateTestDriveRequest,
  deleteTestDriveRequest,
} from "@/lib/test-drives-store";
import { hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const list = getTestDriveRequests();
    return NextResponse.json({ success: true, requests: list });
  } catch (error) {
    console.error("GET /api/test-drives error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch test drive requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone || !body.preferred_date || !body.preferred_time) {
      return NextResponse.json(
        { success: false, error: "Name, phone, preferred date, and time are required" },
        { status: 400 }
      );
    }

    const saved = addTestDriveRequest({
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() || undefined,
      vehicle_id: body.vehicle_id || undefined,
      vehicle_title: body.vehicle_title || undefined,
      preferred_date: body.preferred_date,
      preferred_time: body.preferred_time,
      message: body.message?.trim() || undefined,
      status: body.status || "new",
    });

    return NextResponse.json({ success: true, request: saved }, { status: 201 });
  } catch (error) {
    console.error("POST /api/test-drives error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to book test drive" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json(
      { success: false, error: "Admin authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const updated = updateTestDriveRequest(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("PUT /api/test-drives error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update test drive request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json(
      { success: false, error: "Admin authentication required" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }

    const deleted = deleteTestDriveRequest(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/test-drives error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete record" },
      { status: 500 }
    );
  }
}
