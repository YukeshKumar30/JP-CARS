import { NextResponse } from "next/server";
import {
  getFinanceRequests,
  addFinanceRequest,
  updateFinanceRequest,
  deleteFinanceRequest,
} from "@/lib/finance-store";
import { hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const list = getFinanceRequests();
    return NextResponse.json({ success: true, requests: list });
  } catch (error) {
    console.error("GET /api/finance error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch finance requests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, error: "Name and Phone are required" },
        { status: 400 }
      );
    }

    const saved = addFinanceRequest({
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() || undefined,
      vehicle_id: body.vehicle_id || undefined,
      vehicle_title: body.vehicle_title || undefined,
      loan_amount: body.loan_amount ? Number(body.loan_amount) : undefined,
      tenure_months: body.tenure_months ? Number(body.tenure_months) : undefined,
      employment_type: body.employment_type?.trim() || undefined,
      message: body.message?.trim() || undefined,
      status: body.status || "new",
    });

    return NextResponse.json({ success: true, request: saved }, { status: 201 });
  } catch (error) {
    console.error("POST /api/finance error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit finance request" },
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
        { success: false, error: "Request ID is required" },
        { status: 400 }
      );
    }

    const updated = updateFinanceRequest(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Finance request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("PUT /api/finance error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update finance request" },
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

    const deleted = deleteFinanceRequest(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/finance error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete record" },
      { status: 500 }
    );
  }
}
