import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminAuth";
import { storage } from "@/lib/storage";
import { CONTENT_FIELDS, getContentField, getContentOverrides } from "@/lib/content/pageContent";

export const dynamic = "force-dynamic";

const PAGE_PATHS: Record<string, string[]> = {
  Home: ["/"],
  Blog: ["/blog"],
  Programs: ["/programs"],
  Location: ["/facilities"],
  Staff: ["/coaches"],
  Methodology: ["/methodology"],
  "Contact Us": ["/contact"],
  FAQs: ["/faqs"],
  Admissions: ["/admissions"],
  "Events & Camps": ["/events"],
  "Future Ballers": ["/programs/future-ballers"],
  "Mini Basket": ["/programs/mini-basket"],
  "Youth Academy": ["/programs/youth-academy"],
  "Private Training": ["/programs/private-training"],
  // Each field here shows on Home AND the Programs listing (and, for four of
  // them, their own dedicated program page too) — revalidate everywhere.
  "Program Images": [
    "/",
    "/programs",
    "/programs/future-ballers",
    "/programs/mini-basket",
    "/programs/youth-academy",
    "/programs/private-training",
  ],
};

export async function GET(request: NextRequest) {
  const error = await requireAdmin(request);
  if (error) return error;

  const overrides = await getContentOverrides();
  // The Staff page header is edited in Admin → Staff, not here.
  const rows = CONTENT_FIELDS.filter((field) => field.page !== "Staff").map((field) => {
    const row = overrides.get(field.key);
    return {
      key: field.key,
      page: field.page,
      label: field.label,
      type: field.type,
      maxLength: field.maxLength ?? null,
      default: field.default,
      value: row?.value ?? field.default,
      isOverridden: !!row,
      lastModified: row?.updatedAt?.toISOString() ?? null,
    };
  });

  return NextResponse.json(rows);
}

const body = z.object({
  key: z.string().min(1),
  // A string to set an override, or null to reset to the code default.
  value: z.string().max(5000).nullable(),
});

export async function PUT(request: NextRequest) {
  const error = await requireAdmin(request);
  if (error) return error;
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid content update" }, { status: 400 });

  const field = getContentField(parsed.data.key);
  if (!field) return NextResponse.json({ error: "Unknown content field" }, { status: 400 });

  if (parsed.data.value === null) {
    await storage.deletePageContentOverride(field.key);
  } else {
    const value = parsed.data.value.trim();
    if (!value) return NextResponse.json({ error: "Value cannot be empty" }, { status: 400 });
    if (field.maxLength && value.length > field.maxLength) {
      return NextResponse.json({ error: `Must be ${field.maxLength} characters or fewer` }, { status: 400 });
    }
    if (field.type === "image" && !/^https:\/\//i.test(value)) {
      return NextResponse.json({ error: "Image must be an HTTPS URL" }, { status: 400 });
    }
    await storage.upsertPageContentOverride(field.key, value);
  }

  for (const path of PAGE_PATHS[field.page] ?? []) revalidatePath(path);
  return NextResponse.json({ success: true });
}
