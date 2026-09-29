import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminAuth";
import { storage } from "@/lib/storage";
import { STAFF_SECTIONS } from "@/lib/content/staff";
import { revalidateStaffPages } from "@/lib/content/staffRevalidate";

export const dynamic = "force-dynamic";

const body = z.object({
  section: z.enum(STAFF_SECTIONS),
  ids: z.array(z.number().int().positive()).min(1).max(200),
});

/** Saves the new order of one section (the full list of its member ids, top to bottom). */
export async function PUT(request: NextRequest) {
  const error = await requireAdmin(request);
  if (error) return error;
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid order" }, { status: 400 });

  const inSection = (await storage.getStaffMembers()).filter((row) => row.section === parsed.data.section).map((row) => row.id);
  const sameMembers = inSection.length === parsed.data.ids.length && inSection.every((id) => parsed.data.ids.includes(id));
  if (!sameMembers) return NextResponse.json({ error: "The list changed; reload and try again" }, { status: 409 });

  await storage.reorderStaffMembers(parsed.data.section, parsed.data.ids);
  revalidateStaffPages();
  return NextResponse.json({ success: true });
}
