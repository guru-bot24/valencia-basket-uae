import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { BLOG_IMAGE_MAX_BYTES, BLOG_IMAGE_TYPES, uploadBlogImage } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!BLOG_IMAGE_TYPES[file.type]) {
    return NextResponse.json({ error: "Use a PNG, JPEG, WebP, or GIF image" }, { status: 400 });
  }
  if (file.size > BLOG_IMAGE_MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 5 MB or smaller" }, { status: 400 });
  }

  try {
    return NextResponse.json({ url: await uploadBlogImage(new Uint8Array(await file.arrayBuffer()), file.type) });
  } catch (error) {
    console.error("[blog] failed to upload image to R2:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
