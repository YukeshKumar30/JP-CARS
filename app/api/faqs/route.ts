import { NextResponse } from "next/server";
import {
  getFAQs,
  addFAQ,
  updateFAQ,
  deleteFAQ,
} from "@/lib/faqs-store";
import { hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const isAdmin = await hasAdminSession();
    const list = getFAQs();
    const results = isAdmin ? list : list.filter((f) => f.is_published);
    return NextResponse.json({ success: true, faqs: results });
  } catch (error) {
    console.error("GET /api/faqs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json(
      { success: false, error: "Admin authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    if (!body.question || !body.answer) {
      return NextResponse.json(
        { success: false, error: "Question and Answer are required" },
        { status: 400 }
      );
    }

    const saved = addFAQ({
      question: body.question.trim(),
      answer: body.answer.trim(),
      category: body.category?.trim() || "General",
      sort_order: Number(body.sort_order) || 0,
      is_published: body.is_published !== undefined ? Boolean(body.is_published) : true,
    });

    return NextResponse.json({ success: true, faq: saved }, { status: 201 });
  } catch (error) {
    console.error("POST /api/faqs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create FAQ" },
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

    const updated = updateFAQ(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, faq: updated });
  } catch (error) {
    console.error("PUT /api/faqs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update FAQ" },
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

    const deleted = deleteFAQ(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "FAQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/faqs error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
