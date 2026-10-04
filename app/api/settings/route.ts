import { NextResponse } from "next/server";
import {
  getDealershipSettings,
  updateDealershipSettings,
} from "@/lib/settings-store";
import { hasAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const settings = getDealershipSettings();
    const hasSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const hasSupabaseAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const hasSupabaseServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

    return NextResponse.json({
      success: true,
      settings,
      database: {
        mode: hasSupabaseUrl && hasSupabaseAnonKey ? "supabase" : "local_file",
        supabaseConfigured: hasSupabaseUrl && hasSupabaseAnonKey,
        hasSupabaseUrl,
        hasSupabaseAnonKey,
        hasSupabaseServiceKey,
        storageEngine: "Local JSON Database (/data/*.json)",
        status: hasSupabaseUrl && hasSupabaseAnonKey ? "Connected to Supabase" : "Active (Local Persistent Database)",
      },
    });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
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
    const updated = updateDealershipSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
