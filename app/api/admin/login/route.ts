import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  authenticateAdmin,
  createAdminSession,
  isAdminAuthConfigured,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return Response.json(
      { error: "Admin login is not configured. Set the admin environment variables and restart the app." },
      { status: 503 }
    );
  }

  let credentials: { username?: unknown; password?: unknown };
  try {
    credentials = await request.json();
  } catch {
    return Response.json({ error: "Enter a valid username and password." }, { status: 400 });
  }

  if (
    typeof credentials.username !== "string" ||
    typeof credentials.password !== "string" ||
    credentials.username.length > 256 ||
    credentials.password.length > 1024
  ) {
    return Response.json({ error: "Enter a valid username and password." }, { status: 400 });
  }

  if (!authenticateAdmin(credentials.username, credentials.password)) {
    return Response.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });

  return Response.json({ ok: true });
}