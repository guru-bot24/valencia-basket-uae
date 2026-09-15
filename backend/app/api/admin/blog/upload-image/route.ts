import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { requireAdmin } from "@/lib/adminAuth";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";

export const dynamic = "force-dynamic";

const allowedTypes: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

const maxBytes = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const extension = allowedTypes[file.type];
  if (!extension) {
    return NextResponse.json({ error: "Use a PNG, JPEG, WebP, or GIF image" }, { status: 400 });
  }
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "Image must be 5 MB or smaller" }, { status: 400 });
  }

  const key = `blog/${randomUUID()}.${extension}`;
  const body = new Uint8Array(await file.arrayBuffer());

  try {
    await r2Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: file.type,
    }));
  } catch (error) {
    console.error("[blog] failed to upload image to R2:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }

  return NextResponse.json({ url: `${R2_PUBLIC_URL}/${key}` });
}
