import { randomUUID } from "crypto";
import { extname } from "path";
import { del, put } from "@vercel/blob";

const ALLOWED = /\.(jpe?g|png|webp|gif|avif)$/i;
const MAX_BYTES = 8 * 1024 * 1024;

/** Thrown for rejected uploads; routes map this to a 400. */
export class UploadError extends Error {}

/**
 * Upload a product photo to Vercel Blob and return its public CDN URL.
 * Requires `BLOB_READ_WRITE_TOKEN` (Vercel injects it automatically once a Blob
 * store is linked; set it in `.env` for local development).
 */
export async function saveUpload(file: File): Promise<string> {
  if (!ALLOWED.test(file.name)) {
    throw new UploadError("Only image files are allowed (jpg, png, webp, …)");
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError("Image must be 8MB or smaller");
  }
  const key = `products/${randomUUID()}${extname(file.name).toLowerCase()}`;
  const { url } = await put(key, file, {
    access: "public",
    contentType: file.type || undefined,
  });
  return url;
}

/** Best-effort delete of a stored photo by its Blob URL; never throws. */
export async function deleteUpload(url: string | null): Promise<void> {
  if (!url) return;
  try {
    await del(url);
  } catch {
    // a missing/removed blob should not block the DB operation
  }
}
