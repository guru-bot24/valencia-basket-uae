import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { storage } from "@/lib/storage";
import { staffInputSchema } from "@/lib/content/staff";
import { rowToStaffMember } from "@/lib/content/staffStore";
import { revalidateStaffPages } from "@/lib/content/staffRevalidate";

export const dynamic = "force-dynamic";

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const error = await requireAdmin(request);
  if (error) return error;
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid staff member id" }, { status: 400 });
  const existing = await storage.getStaffMemberById(id);
  if (!existing) return NextResponse.json({ error: "Staff member not found" }, { status: 404 });

  const parsed = staffInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ error: issue?.message ?? "Invalid staff member", field: issue?.path[0] ?? null }, { status: 400 });
  }

  const { authorBio, ...fields } = parsed.data;
  const movedSection = fields.section !== existing.section;
  let sortOrder = existing.sortOrder;
  if (movedSection) {
    const others = (await storage.getStaffMembers()).filter((row) => row.section === fields.section);
    sortOrder = Math.max(-1, ...others.map((row) => row.sortOrder)) + 1;
  }

  const updated = await storage.updateStaffMember(id, {
    ...fields,
    sortOrder,
    // Only blog authors have an author-page bio; slug and author status never change here.
    ...(existing.isAuthor ? { authorBio: authorBio?.trim() || null } : {}),
  });
  revalidateStaffPages();
  return NextResponse.json(rowToStaffMember(updated!));
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const error = await requireAdmin(request);
  if (error) return error;
  const id = parseId((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid staff member id" }, { status: 400 });
  const existing = await storage.getStaffMemberById(id);
  if (!existing) return NextResponse.json({ error: "Staff member not found" }, { status: 404 });
  if (existing.isAuthor) {
    return NextResponse.json({ error: "Blog authors can be hidden but not deleted: their articles and author page depend on them." }, { status: 409 });
  }
  await storage.deleteStaffMember(id);
  revalidateStaffPages();
  return NextResponse.json({ success: true });
}
