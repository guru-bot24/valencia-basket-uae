import "server-only";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

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

export const BLOG_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

/** Stores a blog image in R2 under blog/<uuid>.<ext> and returns its public URL. */
export async function uploadBlogImage(body: Uint8Array, contentType: string): Promise<string> {
  const extension = BLOG_IMAGE_TYPES[contentType];
  if (!extension) throw new Error(`Unsupported image type: ${contentType}`);
  const key = `blog/${crypto.randomUUID()}.${extension}`;
  await r2Client.send(new PutObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key, Body: body, ContentType: contentType }));
  return `${R2_PUBLIC_URL}/${key}`;
}
