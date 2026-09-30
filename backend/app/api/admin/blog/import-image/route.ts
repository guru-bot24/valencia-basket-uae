import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminAuth";
import { BLOG_IMAGE_MAX_BYTES, R2_PUBLIC_URL, blogImageTooBig, storeBlogImage } from "@/lib/r2";
import { ImageOptimizeError } from "@/lib/imageOptimize";
import { ImageImportError, fetchRemoteImage } from "@/lib/imageImport";

export const dynamic = "force-dynamic";

const body = z.object({ url: z.string().min(1).max(4000) });

/**
 * Copies an image from another site (e.g. pasted from Google Docs) into R2 so
 * the article no longer depends on the original host. Images already in R2
 * are returned unchanged.
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Missing image link" }, { status: 400 });

  const { url } = parsed.data;
  if (url.startsWith(`${R2_PUBLIC_URL}/`)) return NextResponse.json({ url, copied: false });

  let image: Awaited<ReturnType<typeof fetchRemoteImage>>;
  try {
    image = await fetchRemoteImage(url, { maxBytes: BLOG_IMAGE_MAX_BYTES });
  } catch (error) {
    const message = error instanceof ImageImportError ? error.message : "Couldn't download that image.";
    if (!(error instanceof ImageImportError)) console.error("[blog] image import failed:", error);
    return NextResponse.json({ error: message }, { status: 422 });
  }

  const tooBig = blogImageTooBig(image.body.byteLength, image.contentType);
  if (tooBig) return NextResponse.json({ error: tooBig }, { status: 422 });

  try {
    return NextResponse.json({ ...(await storeBlogImage(image.body, image.contentType)), copied: true });
  } catch (error) {
    if (error instanceof ImageOptimizeError) return NextResponse.json({ error: error.message }, { status: 422 });
    console.error("[blog] failed to store imported image in R2:", error);
    return NextResponse.json({ error: "Failed to save the copied image" }, { status: 500 });
  }
}
