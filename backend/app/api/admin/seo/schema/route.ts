import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminAuth";
import { storage } from "@/lib/storage";
import { structuredDataRegistry, breadcrumbStructuredDataRegistry, breadcrumbPages } from "@/lib/seo/structuredData";
import { getStructuredData, getStructuredDataOverrides } from "@/lib/seo/structuredDataResolve";

export const dynamic = "force-dynamic";

const labelForPath = new Map<string, string>(breadcrumbPages.map(([path, label]) => [path, label]));
labelForPath.set("/", "Home");
labelForPath.set("/__schema/sitewide-organization", "Sitewide (Organization)");

function labelOf(path: string) {
  return labelForPath.get(path) ?? path;
}

export async function GET(request: NextRequest) {
  const error = await requireAdmin(request);
  if (error) return error;

  const saved = await getStructuredDataOverrides();
  const events = await storage.getAllEvents();

  const paths = new Set<string>(["/__schema/sitewide-organization"]);
  for (const entry of structuredDataRegistry) {
    if (entry.key !== "/__schema/sitewide-organization") paths.add(entry.path);
  }
  for (const entry of breadcrumbStructuredDataRegistry) paths.add(entry.path);
  for (const event of events) paths.add(`/events/${event.slug}`);

  const rows = await Promise.all(
    [...paths].map(async (path) => {
      const label = path.startsWith("/events/") ? events.find((e) => `/events/${e.slug}` === path)?.title ?? path : labelOf(path);
      const row = saved.get(path);
      const json = await getStructuredData(path, label);
      return {
        path,
        label,
        json,
        isOverridden: Array.isArray(row?.overrides),
        enabled: row?.enabled ?? true,
        lastModified: row?.updatedAt?.toISOString() ?? null,
      };
    })
  );

  rows.sort((a, b) => a.path.localeCompare(b.path));
  return NextResponse.json(rows);
}

const body = z.object({
  path: z.string().min(1),
  enabled: z.boolean(),
  // Full JSON-LD array replacement for the whole page, or null to reset to the computed default.
  overrides: z.array(z.record(z.string(), z.unknown())).nullable(),
});

export async function PUT(request: NextRequest) {
  const error = await requireAdmin(request);
  if (error) return error;
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid structured data update" }, { status: 400 });

  const { path, enabled, overrides } = parsed.data;
  if (overrides) {
    for (const item of overrides) {
      if (item["@context"] !== "https://schema.org") {
        return NextResponse.json({ error: '@context must be "https://schema.org" on every object' }, { status: 400 });
      }
      if (typeof item["@type"] !== "string" || !item["@type"].trim()) {
        return NextResponse.json({ error: "@type is required on every schema object" }, { status: 400 });
      }
    }
  }

  const schemaType = overrides?.map((item) => item["@type"]).filter(Boolean).join(", ") || "Custom";
  await storage.upsertSeoSchemaOverride(path, schemaType, enabled, overrides);
  revalidatePath(path.startsWith("/events/") ? path : "/", "layout");
  revalidatePath("/events");
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const error = await requireAdmin(request);
  if (error) return error;
  const path = new URL(request.url).searchParams.get("path");
  if (!path) return NextResponse.json({ error: "Missing path" }, { status: 400 });
  await storage.deleteSeoSchemaOverride(path);
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
