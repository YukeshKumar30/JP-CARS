import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const IMAGE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const match = /^([a-f0-9-]{36})\.(jpg|png|webp)$/i.exec(filename);
  if (!match) return new Response("Not found", { status: 404 });

  try {
    const imagePath = path.join(process.cwd(), "data", "uploads", "sell-requests", filename);
    const image = await readFile(imagePath);
    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": IMAGE_TYPES[match[2].toLowerCase()],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}