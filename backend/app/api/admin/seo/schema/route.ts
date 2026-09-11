import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminAuth";
import { storage } from "@/lib/storage";
import { breadcrumbStructuredDataRegistry, contactStructuredData, faqStructuredData, structuredDataRegistry } from "@/lib/seo/structuredData";
import { eventBreadcrumbSchemaKey, eventSchemaKey, getEventStructuredData, getStructuredDataOverrides, resolveStructuredEntry } from "@/lib/seo/structuredDataResolve";
import { getCoachStructuredEntries } from "@/lib/seo/coaches";
export const dynamic = "force-dynamic";

const body = z.object({
  key: z.string().min(1),
  enabled: z.boolean().nullable(),
  // Full JSON-LD replacement, or null to reset to the verified default.
  overrides: z.record(z.string(), z.unknown()).nullable(),
});

const lockedEntries = new Map([
  ["/faqs", { type: "FAQPage", route: "/faqs" }],
  ["/contact", { type: "SportsActivityLocation", route: "/contact" }],
]);

export async function GET(request: NextRequest) {
  const error = await requireAdmin(request); if (error) return error;
  const saved = await getStructuredDataOverrides();
  const staticEntries = [...structuredDataRegistry, ...breadcrumbStructuredDataRegistry].map((entry) => { const row = saved.get(entry.key); const result = resolveStructuredEntry(entry, row); return { ...entry, type: (result.json as Record<string, unknown>)["@type"] ?? entry.type, editable: true, enabled: result.enabled, override: row?.overrides ?? null, lastModified: row?.updatedAt?.toISOString() ?? null, json: result.json }; });
  const events = await storage.getAllEvents();
  const eventEntries = await Promise.all(events.map(async (event) => {
    const path = `/events/${event.slug}`; const key = eventSchemaKey(event.id); const row = saved.get(key);
    return { key, path, label: event.title, type: "Event", note: "Name, dates, location and details are locked to live event content.", fields: [], lockedFields: ["name", "startDate", "endDate", "location", "description"], editable: false, enabled: row?.enabled ?? true, override: null, lastModified: row?.updatedAt?.toISOString() ?? null, json: (await getEventStructuredData(event, true))[0] };
  }));
  const eventBreadcrumbEntries = events.map((event) => {
    const path = `/events/${event.slug}`;
    const key = eventBreadcrumbSchemaKey(event.id);
    const row = saved.get(key);
    return { key, path, label: `${event.title} breadcrumb`, type: "BreadcrumbList", note: "Derived from the live event route and title.", fields: [], lockedFields: ["all route and label values"], editable: false, enabled: row?.enabled ?? true, override: null, lastModified: row?.updatedAt?.toISOString() ?? null, json: { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://valenciabasket.ae" }, { "@type": "ListItem", position: 2, name: "events", item: "https://valenciabasket.ae/events" }, { "@type": "ListItem", position: 3, name: event.title, item: `https://valenciabasket.ae${path}` }] } };
  });
  const coachEntries = (await getCoachStructuredEntries(true)).map((entry) => ({ ...entry, editable: false }));
  const locked = (key: string, path: string, label: string, type: string, json: unknown) => {
    const row = saved.get(key);
    return { key, path, label, type, note: "This schema follows verified page content and is locked.", fields: [], lockedFields: ["all content-derived fields"], editable: false, enabled: row?.enabled ?? true, override: null, lastModified: row?.updatedAt?.toISOString() ?? null, json };
  };
  return NextResponse.json([...staticEntries, ...coachEntries, ...eventEntries, ...eventBreadcrumbEntries, locked("/faqs", "/faqs", "FAQs", "FAQPage", faqStructuredData), locked("/contact", "/contact", "Contact", "SportsActivityLocation", contactStructuredData)]);
}

export async function PUT(request: NextRequest) {
  const error = await requireAdmin(request); if (error) return error;
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid structured data update" }, { status: 400 });

  const entry = [...structuredDataRegistry, ...breadcrumbStructuredDataRegistry].find((item) => item.key === parsed.data.key);
  const coach = !entry && (await getCoachStructuredEntries(true)).find((item) => item.key === parsed.data.key);
  const event = !entry && !coach && (await storage.getAllEvents()).find((item) => eventSchemaKey(item.id) === parsed.data.key || eventBreadcrumbSchemaKey(item.id) === parsed.data.key);
  const locked = lockedEntries.get(parsed.data.key);
  if (!entry && !event && !coach && !locked) return NextResponse.json({ error: "Unknown schema" }, { status: 400 });

  // Only the static registry (page + breadcrumb entries) accepts raw-JSON
  // overrides. Anything derived from live content (events, coaches, FAQs,
  // contact) can only be toggled on/off, never rewritten — its schema must
  // always match what the page actually shows.
  if (!entry && parsed.data.overrides) {
    return NextResponse.json({ error: "This schema follows live content and cannot be edited" }, { status: 400 });
  }

  let overrides: Record<string, unknown> | null = null;
  if (entry && parsed.data.overrides) {
    const candidate = parsed.data.overrides;
    if (candidate["@context"] !== "https://schema.org") {
      return NextResponse.json({ error: '@context must be "https://schema.org"' }, { status: 400 });
    }
    if (typeof candidate["@type"] !== "string" || !(candidate["@type"] as string).trim()) {
      return NextResponse.json({ error: "@type is required" }, { status: 400 });
    }
    const defaultJson = entry.json as Record<string, unknown>;
    for (const identityKey of ["name", "url"] as const) {
      if (identityKey in defaultJson && candidate[identityKey] !== defaultJson[identityKey]) {
        return NextResponse.json({ error: `"${identityKey}" must match the page's actual ${identityKey} and cannot be changed here` }, { status: 400 });
      }
    }
    overrides = candidate;
  }

  const schemaType =
    (overrides?.["@type"] as string | undefined) ??
    entry?.type ??
    (event ? (parsed.data.key === eventBreadcrumbSchemaKey(event.id) ? "BreadcrumbList" : "Event") : coach ? "Person" : locked!.type);

  await storage.upsertSeoSchemaOverride(parsed.data.key, schemaType, parsed.data.enabled ?? true, overrides);
  revalidatePath(entry?.path ?? (event ? `/events/${event.slug}` : coach ? "/coaches" : locked!.route));
  revalidatePath("/events"); revalidatePath("/", "layout");
  return NextResponse.json({ success: true });
}
export async function DELETE(request: NextRequest) {
  const error = await requireAdmin(request); if (error) return error;
  const key = new URL(request.url).searchParams.get("key");
  const entry = [...structuredDataRegistry, ...breadcrumbStructuredDataRegistry].find((item) => item.key === key);
  const locked = key ? lockedEntries.get(key) : undefined;
  const coach = key ? (await getCoachStructuredEntries(true)).find((item) => item.key === key) : undefined;
  const event = key && (await storage.getAllEvents()).find((item) => eventSchemaKey(item.id) === key || eventBreadcrumbSchemaKey(item.id) === key);
  if (!key || (!entry && !locked && !event && !coach)) return NextResponse.json({ error: "Unknown schema" }, { status: 400 });
  await storage.deleteSeoSchemaOverride(key); revalidatePath(entry?.path ?? (event ? `/events/${event.slug}` : coach ? "/coaches" : locked!.route)); revalidatePath("/", "layout"); return NextResponse.json({ success: true });
}
