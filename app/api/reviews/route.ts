import { NextResponse } from "next/server";
import {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
} from "@/lib/reviews-store";
import { hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const isAdmin = await hasAdminSession();
    const list = getReviews();
    // Return all reviews for admin, or published only for public
    const results = isAdmin ? list : list.filter((r) => r.is_published);
    return NextResponse.json({ success: true, reviews: results });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customer_name || !body.rating || !body.comment) {
      return NextResponse.json(
        { success: false, error: "Name, rating, and review comment are required" },
        { status: 400 }
      );
    }

    const saved = addReview({
      customer_name: body.customer_name.trim(),
      rating: Math.max(1, Math.min(5, Number(body.rating) || 5)),
      comment: body.comment.trim(),
      vehicle_id: body.vehicle_id || undefined,
      vehicle_title: body.vehicle_title || undefined,
      is_published: body.is_published !== undefined ? Boolean(body.is_published) : true,
    });

    return NextResponse.json({ success: true, review: saved }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create review" },
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

    const updated = updateReview(body.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    console.error("PUT /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update review" },
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

    const deleted = deleteReview(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
