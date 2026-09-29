import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { storage } from "@/lib/storage";
import { getContentField, getContentOverrides } from "@/lib/content/pageContent";
import { slugify, sortStaff, staffInputSchema } from "@/lib/content/staff";
import { rowToStaffMember, seedStaffIfEmpty } from "@/lib/content/staffStore";
import { revalidateStaffPages } from "@/lib/content/staffRevalidate";

export const dynamic = "force-dynamic";

const HERO_KEY = "staff.hero.subtext";

export async function GET(request: NextRequest) {
  const error = await requireAdmin(request);
  if (error) return error;

  // First visit fills the table with today's staff, so edits have rows to change.
  await seedStaffIfEmpty();
  const [rows, overrides] = await Promise.all([storage.getStaffMembers(), getContentOverrides()]);
  const heroField = getContentField(HERO_KEY)!;
  return NextResponse.json({
    members: sortStaff(rows.map(rowToStaffMember)),
    hero: {
      key: HERO_KEY,
      value: overrides.get(HERO_KEY)?.value ?? heroField.default,
      default: heroField.default,
      maxLength: heroField.maxLength ?? null,
      isOverridden: overrides.has(HERO_KEY),
    },
  });
}

export async function POST(request: NextRequest) {
  const error = await requireAdmin(request);
  if (error) return error;
  const parsed = staffInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ error: issue?.message ?? "Invalid staff member", field: issue?.path[0] ?? null }, { status: 400 });
  }

  await seedStaffIfEmpty();
  const existing = await storage.getStaffMembers();
  const taken = new Set(existing.map((row) => row.slug));
  const base = slugify(parsed.data.name);
  let slug = base;
  for (let suffix = 2; taken.has(slug); suffix += 1) slug = `${base}-${suffix}`;
  const lastInSection = Math.max(-1, ...existing.filter((row) => row.section === parsed.data.section).map((row) => row.sortOrder));

  const created = await storage.createStaffMember({
    ...parsed.data,
    slug,
    imageKey: null,
    sortOrder: lastInSection + 1,
    isAuthor: false,
    authorBio: null,
  });
  revalidateStaffPages();
  return NextResponse.json(rowToStaffMember(created), { status: 201 });
}
