import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hasAdminSession } from "@/lib/admin-auth";
import { addSellCarRequest, getSellCarRequests } from "@/lib/sell-requests-store";

export const runtime = "nodejs";

const MAX_FILES = 6;
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_TOTAL_SIZE = 25 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const requestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(10).max(30),
  email: z.union([z.string().email().max(254), z.literal("")]).optional(),
  brand: z.string().trim().min(1).max(80),
  model: z.string().trim().min(1).max(80),
  variant: z.string().trim().max(120).optional(),
  year: z.coerce.number().int().min(2000).max(new Date().getFullYear()),
  kilometres: z.coerce.number().int().min(0).max(2_000_000),
  fuel_type: z.string().min(1).max(40),
  transmission: z.string().min(1).max(40),
  owners: z.coerce.number().int().min(1).max(5),
  expected_price: z.coerce.number().min(0).max(1_000_000_000).optional(),
  city: z.string().trim().max(120).optional(),
  message: z.string().trim().max(3000).optional(),
});

function hasValidSignature(bytes: Buffer, contentType: string) {
  if (contentType === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (contentType === "image/png") {
    return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  if (contentType === "image/webp") {
    return bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  }
  return false;
}

export async function GET() {
  if (!await hasAdminSession()) {
    return NextResponse.json({ success: false, error: "Admin sign-in required" }, { status: 401 });
  }

  return NextResponse.json({ success: true, requests: getSellCarRequests() });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_TOTAL_SIZE + 1024 * 1024) {
    return NextResponse.json({ success: false, error: "Total upload must be 25 MB or smaller." }, { status: 413 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid form submission." }, { status: 400 });
  }

  const fields = Object.fromEntries(
    ["name", "phone", "email", "brand", "model", "variant", "year", "kilometres", "fuel_type", "transmission", "owners", "expected_price", "city", "message"]
      .map((key) => [key, formData.get(key) ?? ""])
  );
  const validated = requestSchema.safeParse(fields);
  if (!validated.success) {
    return NextResponse.json({ success: false, error: "Check the submitted car and contact details." }, { status: 400 });
  }

  const rawImages = formData.getAll("images");
  if (rawImages.some((image) => !(image instanceof File))) {
    return NextResponse.json({ success: false, error: "One or more image files are invalid." }, { status: 400 });
  }
  const images = (rawImages as File[]).filter((image) => image.size > 0);
  if (images.length > MAX_FILES) {
    return NextResponse.json({ success: false, error: `Upload up to ${MAX_FILES} images.` }, { status: 400 });
  }

  let totalSize = 0;
  const preparedImages: Array<{ bytes: Buffer; extension: string }> = [];
  for (const image of images) {
    const extension = IMAGE_EXTENSIONS[image.type];
    if (!extension) {
      return NextResponse.json({ success: false, error: "Use JPG, PNG, or WebP images only." }, { status: 415 });
    }
    if (image.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: "Each image must be 8 MB or smaller." }, { status: 413 });
    }

    totalSize += image.size;
    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json({ success: false, error: "Total upload must be 25 MB or smaller." }, { status: 413 });
    }

    const bytes = Buffer.from(await image.arrayBuffer());
    if (!hasValidSignature(bytes, image.type)) {
      return NextResponse.json({ success: false, error: "One or more selected files are not valid images." }, { status: 415 });
    }
    preparedImages.push({ bytes, extension });
  }

  const uploadDirectory = path.join(process.cwd(), "data", "uploads", "sell-requests");
  const savedFiles: string[] = [];

  try {
    await mkdir(uploadDirectory, { recursive: true });
    const imageUrls: string[] = [];

    for (const image of preparedImages) {
      const filename = `${randomUUID()}.${image.extension}`;
      await writeFile(path.join(uploadDirectory, filename), image.bytes, { flag: "wx" });
      savedFiles.push(filename);
      imageUrls.push(`/api/sell-requests/images/${filename}`);
    }

    const savedRequest = addSellCarRequest({
      ...validated.data,
      expected_price: validated.data.expected_price || undefined,
      email: validated.data.email || undefined,
      variant: validated.data.variant || undefined,
      city: validated.data.city || undefined,
      message: validated.data.message || undefined,
      image_urls: imageUrls,
    });

    return NextResponse.json({ success: true, request: savedRequest }, { status: 201 });
  } catch (error) {
    await Promise.all(savedFiles.map((filename) => unlink(path.join(uploadDirectory, filename)).catch(() => undefined)));
    console.error("POST /api/sell-requests error:", error);
    return NextResponse.json({ success: false, error: "Could not save your request. Please try again." }, { status: 500 });
  }
}