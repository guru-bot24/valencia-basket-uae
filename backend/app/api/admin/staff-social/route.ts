import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminAuth";
import { storage } from "@/lib/storage";
import { getContentOverrides } from "@/lib/content/pageContent";
import { STAFF, getStaffMember } from "@/lib/content/staff";
import { SOCIAL_PLATFORMS, normalizeSocialUrl, socialContentKey } from "@/lib/content/socialLinks";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const error = await requireAdmin(request);
  if (error) return error;

  const overrides = await getContentOverrides();
  const rows = STAFF.map((member) => {
    const saved = SOCIAL_PLATFORMS.map((platform) => overrides.get(socialContentKey(member.slug, platform.id)));
    const updated = saved.map((row) => row?.updatedAt?.getTime() ?? 0);
    return {
      slug: member.slug,
      name: member.name,
      role: member.role,
      group: member.group,
      image: member.image,
      links: Object.fromEntries(SOCIAL_PLATFORMS.map((platform, index) => [platform.id, saved[index]?.value ?? ""])),
      lastModified: Math.max(...updated) ? new Date(Math.max(...updated)).toISOString() : null,
    };
  });
  return NextResponse.json(rows);
}

const body = z.object({
  slug: z.string().min(1),
  links: z.object({
    instagram: z.string().max(500),
    facebook: z.string().max(500),
    tiktok: z.string().max(500),
  }),
});

export async function PUT(request: NextRequest) {
  const error = await requireAdmin(request);
  if (error) return error;
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid social links update" }, { status: 400 });

  const member = getStaffMember(parsed.data.slug);
  if (!member) return NextResponse.json({ error: "Unknown staff member" }, { status: 400 });

  // Validate every box before writing any, so a bad link never half-saves.
  const normalized: Array<{ key: string; url: string }> = [];
  for (const platform of SOCIAL_PLATFORMS) {
    const result = normalizeSocialUrl(platform.id, parsed.data.links[platform.id]);
    if ("error" in result) return NextResponse.json({ error: result.error, platform: platform.id }, { status: 400 });
    normalized.push({ key: socialContentKey(member.slug, platform.id), url: result.url });
  }
  for (const { key, url } of normalized) {
    if (url) await storage.upsertPageContentOverride(key, url);
    else await storage.deletePageContentOverride(key);
  }

  revalidatePath("/coaches");
  if (member.href) revalidatePath(member.href);
  return NextResponse.json({ success: true, links: Object.fromEntries(SOCIAL_PLATFORMS.map((platform, index) => [platform.id, normalized[index].url])) });
}
