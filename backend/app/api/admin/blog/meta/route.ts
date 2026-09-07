import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { storage } from "@/lib/storage";
import { z } from "zod";

export const dynamic = "force-dynamic";
const taxonomySchema = z.object({
  kind: z.enum(["category", "tag"]),
  name: z.string().trim().min(1).max(80),
});

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const [categories, tags] = await Promise.all([
      storage.getBlogCategories(),
      storage.getBlogTagsMostUsed(),
    ]);
    return NextResponse.json({ categories, tags });
  } catch (error) {
    console.error("[blog] failed to load taxonomy:", error);
    return NextResponse.json({ error: "Failed to load categories and tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const { kind, name } = taxonomySchema.parse(await request.json());
    const result = kind === "category"
      ? await storage.createBlogCategory(name)
      : await storage.createBlogTag(name);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") return NextResponse.json({ error: "A valid category or tag name is required" }, { status: 400 });
    if (error?.code === "BLOG_TAXONOMY_CONFLICT" || error?.code === "23505") return NextResponse.json({ error: error.message }, { status: 409 });
    console.error("[blog] failed to save taxonomy:", error);
    return NextResponse.json({ error: "Failed to save category or tag" }, { status: 500 });
  }
}