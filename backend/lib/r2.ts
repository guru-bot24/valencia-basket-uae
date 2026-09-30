import "server-only";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { optimizeBlogImage, type ImagePurpose } from "@/lib/imageOptimize";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME ?? "";
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev";

/** Image formats blog uploads accept, mapped to their file extension. */
export const BLOG_IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Largest photo accepted for upload; it's shrunk before storing (see imageOptimize.ts). */
export const BLOG_IMAGE_MAX_BYTES = 20 * 1024 * 1024;
/** GIFs are stored untouched (to keep animation), so they keep a lower limit. */
export const BLOG_GIF_MAX_BYTES = 5 * 1024 * 1024;

export function blogImageTooBig(bytes: number, contentType: string): string | null {
  if (contentType === "image/gif" && bytes > BLOG_GIF_MAX_BYTES) return "GIFs must be 5 MB or smaller";
  if (bytes > BLOG_IMAGE_MAX_BYTES) return "Image must be 20 MB or smaller";
  return null;
}

/** Stores a blog image in R2 under blog/<uuid>.<ext> and returns its public URL. */
export async function uploadBlogImage(body: Uint8Array, contentType: string): Promise<string> {
  const extension = BLOG_IMAGE_TYPES[contentType];
  if (!extension) throw new Error(`Unsupported image type: ${contentType}`);
  const key = `blog/${crypto.randomUUID()}.${extension}`;
  await r2Client.send(new PutObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key, Body: body, ContentType: contentType }));
  return `${R2_PUBLIC_URL}/${key}`;
}

/** Shrinks the image (see optimizeBlogImage) and stores it in R2. */
export async function storeBlogImage(input: Uint8Array, contentType: string, purpose: ImagePurpose = "content") {
  const image = await optimizeBlogImage(input, contentType, purpose);
  const url = await uploadBlogImage(image.body, image.contentType);
  return { url, bytes: image.body.byteLength, originalBytes: image.originalBytes, width: image.width, height: image.height, optimized: image.optimized };
}
