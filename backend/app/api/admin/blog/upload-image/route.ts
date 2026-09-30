import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { BLOG_IMAGE_TYPES, blogImageTooBig, storeBlogImage } from "@/lib/r2";
import { ImageOptimizeError } from "@/lib/imageOptimize";

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
  const tooBig = blogImageTooBig(file.size, file.type);
  if (tooBig) return NextResponse.json({ error: tooBig }, { status: 400 });

  try {
    const purpose = form?.get("purpose") === "social" ? "social" : "content";
    const stored = await storeBlogImage(new Uint8Array(await file.arrayBuffer()), file.type, purpose);
    return NextResponse.json(stored);
  } catch (error) {
    if (error instanceof ImageOptimizeError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("[blog] failed to upload image to R2:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
