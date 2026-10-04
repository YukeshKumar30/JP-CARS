import { NextRequest, NextResponse } from "next/server";
import { hasAdminSession, authenticateAdmin } from "@/lib/admin-auth";
import fs from "node:fs";
import path from "node:path";

export async function POST(request: NextRequest) {
  // Must be logged in as admin
  if (!(await hasAdminSession())) {
    return NextResponse.json({ success: false, error: "Admin sign-in required" }, { status: 401 });
  }

  let body: { oldPassword?: unknown; newPassword?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const { oldPassword, newPassword } = body;

  if (typeof oldPassword !== "string" || typeof newPassword !== "string") {
    return NextResponse.json({ success: false, error: "Old and new password are required." }, { status: 400 });
  }

  if (newPassword.trim().length < 6) {
    return NextResponse.json({ success: false, error: "New password must be at least 6 characters." }, { status: 400 });
  }

  // Verify old password
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const isValid = authenticateAdmin(adminUsername, oldPassword);

  if (!isValid) {
    return NextResponse.json({ success: false, error: "Old password is incorrect." }, { status: 401 });
  }

  // Update .env.local with new password
  const envPath = path.join(process.cwd(), ".env.local");

  try {
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : "";

    if (/^ADMIN_PASSWORD=.*/m.test(envContent)) {
      envContent = envContent.replace(/^ADMIN_PASSWORD=.*/m, `ADMIN_PASSWORD=${newPassword.trim()}`);
    } else {
      envContent += `\nADMIN_PASSWORD=${newPassword.trim()}`;
    }

    fs.writeFileSync(envPath, envContent, "utf-8");

    // Apply immediately in current process (no restart needed for this session)
    process.env.ADMIN_PASSWORD = newPassword.trim();

    return NextResponse.json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save new password. Check server permissions." },
      { status: 500 }
    );
  }
}
