import "server-only";
import sharp from "sharp";

/**
 * Shrinks uploaded photos before they're stored, so articles load fast on
 * phones: at most 2000px on the longest side, saved as WebP. Phone photos of
 * 4-12 MB typically end up at 200-500 KB with no visible difference.
 *
 * - The photo is turned upright using its camera orientation, then camera
 *   metadata (including GPS location) is dropped.
 * - Transparency is kept (WebP supports it).
 * - GIFs are stored untouched so animations keep working.
 * - If the original is already smaller and within 2000px, it's kept as is.
 * - "social" images (a post's featured image, also used for link previews on
 *   WhatsApp/Facebook/LinkedIn) are saved as JPEG, which every preview app
 *   reads; transparent areas become white.
 */

export type ImagePurpose = "content" | "social";

export const OPTIMIZE_MAX_EDGE = 2000;
const WEBP_QUALITY = 80;
const JPEG_QUALITY = 82;
/** Refuses absurd dimensions (decompression bombs) before decoding: ~12,000 × 12,000. */
const MAX_INPUT_PIXELS = 150_000_000;

export interface OptimizedImage {
  body: Uint8Array;
  contentType: string;
  width: number | null;
  height: number | null;
  originalBytes: number;
  optimized: boolean;
}

export class ImageOptimizeError extends Error {}

export async function optimizeBlogImage(input: Uint8Array, contentType: string, purpose: ImagePurpose = "content"): Promise<OptimizedImage> {
  const original: OptimizedImage = { body: input, contentType, width: null, height: null, originalBytes: input.byteLength, optimized: false };
  if (contentType === "image/gif") return original;

  let pipeline: ReturnType<typeof sharp>;
  let meta: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
  try {
    pipeline = sharp(input, { limitInputPixels: MAX_INPUT_PIXELS, failOn: "error" });
    meta = await pipeline.metadata();
  } catch {
    throw new ImageOptimizeError("That image file is damaged or too large to process.");
  }

  // Orientation 5-8 means the camera stored the photo sideways.
  const sideways = (meta.orientation ?? 1) >= 5;
  const width = (sideways ? meta.height : meta.width) ?? 0;
  const height = (sideways ? meta.width : meta.height) ?? 0;

  let output: { data: Buffer; info: { width: number; height: number } };
  try {
    const resized = pipeline
      .rotate()
      .resize({ width: OPTIMIZE_MAX_EDGE, height: OPTIMIZE_MAX_EDGE, fit: "inside", withoutEnlargement: true });
    output = await (purpose === "social"
      ? resized.flatten({ background: "#ffffff" }).jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      : resized.webp({ quality: WEBP_QUALITY, effort: 4 })
    ).toBuffer({ resolveWithObject: true });
  } catch {
    // A file can have a valid header and still be cut off or corrupt further in.
    throw new ImageOptimizeError("That image file is damaged or too large to process.");
  }

  const outputType = purpose === "social" ? "image/jpeg" : "image/webp";
  const fitsAlready = Math.max(width, height) <= OPTIMIZE_MAX_EDGE && (meta.orientation ?? 1) === 1;
  // Keep a smaller original, unless a social image would stay in a format previews may not read.
  const originalIsFine = purpose === "content" || contentType === "image/jpeg" || contentType === "image/png";
  if (fitsAlready && originalIsFine && output.data.byteLength >= input.byteLength) {
    return { ...original, width, height };
  }
  return {
    body: new Uint8Array(output.data),
    contentType: outputType,
    width: output.info.width,
    height: output.info.height,
    originalBytes: input.byteLength,
    optimized: true,
  };
}
