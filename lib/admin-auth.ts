import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "jp_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

function safeEqual(actual: string, expected: string) {
  const actualDigest = createHash("sha256").update(actual).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(actualDigest, expectedDigest);
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

export function isAdminAuthConfigured() {
  return Boolean(
    process.env.ADMIN_USERNAME &&
      process.env.ADMIN_PASSWORD &&
      sessionSecret()
  );
}

export function authenticateAdmin(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  return Boolean(
    expectedUsername &&
      expectedPassword &&
      safeEqual(username, expectedUsername) &&
      safeEqual(password, expectedPassword)
  );
}

export function createAdminSession() {
  const secret = sessionSecret();
  if (!secret) throw new Error("Admin session secret is not configured.");

  const expiresAt = String(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000);
  const signature = createHmac("sha256", secret).update(expiresAt).digest("base64url");
  return `${expiresAt}.${signature}`;
}

export function isValidAdminSession(session: string | undefined) {
  const secret = sessionSecret();
  if (!secret || !session) return false;

  const [expiresAt, signature, ...extraParts] = session.split(".");
  const expiry = Number(expiresAt);
  if (!expiresAt || !signature || extraParts.length || !Number.isFinite(expiry) || expiry <= Date.now()) {
    return false;
  }

  const expectedSignature = createHmac("sha256", secret).update(expiresAt).digest("base64url");
  return safeEqual(signature, expectedSignature);
}

export async function hasAdminSession() {
  const session = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  return isValidAdminSession(session);
}