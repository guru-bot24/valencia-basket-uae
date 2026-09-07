import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminAuth";
import { storage } from "@/lib/storage";
import { breadcrumbStructuredDataRegistry, contactStructuredData, faqStructuredData, structuredDataRegistry } from "@/lib/seo/structuredData";
import { EDITABLE_SCHEMA_TYPES, eventBreadcrumbSchemaKey, eventSchemaKey, getEventStructuredData, getStructuredDataOverrides, resolveStructuredEntry } from "@/lib/seo/structuredDataResolve";
import { getCoachStructuredEntries } from "@/lib/seo/coaches";
export const dynamic = "force-dynamic";
const body = z.object({ key: z.string().min(1), schemaType: z.enum(EDITABLE_SCHEMA_TYPES).optional(), enabled: z.boolean().nullable(), overrides: z.record(z.string(), z.string().trim().max(1000)).nullable() });
const lockedEntries = new Map([
  ["/faqs", { type: "FAQPage", route: "/faqs" }],
  ["/contact", { type: "SportsActivityLocation", route: "/contact" }],
]);

export async function GET(request: NextRequest) {
  const error = await requireAdmin(request); if (error) return error;
  const saved = await getStructuredDataOverrides();
  const staticEntries = [...structuredDataRegistry, ...breadcrumbStructuredDataRegistry].map((entry) => { const row = saved.get(entry.key); const result = resolveStructuredEntry(entry, row); return { ...entry, type: row?.schemaType ?? entry.type, schemaTypes: entry.fields.length ? EDITABLE_SCHEMA_TYPES : [entry.type], enabled: result.enabled, override: row?.overrides ?? null, lastModified: row?.updatedAt?.toISOString() ?? null, json: result.json }; });
  const events = await storage.getAllEvents();
  const eventEntries = await Promise.all(events.map(async (event) => {
    const path = `/events/${event.slug}`; const key = eventSchemaKey(event.id); const row = saved.get(key);
    return { key, path, label: event.title, type: "Event", note: "Name, dates, location and details are locked to live event content.", fields: [], lockedFields: ["name", "startDate", "endDate", "location", "description"], enabled: row?.enabled ?? true, override: null, lastModified: row?.updatedAt?.toISOString() ?? null, json: (await getEventStructuredData(event, true))[0] };
  }));
  const eventBreadcrumbEntries = events.map((event) => {
    const path = `/events/${event.slug}`;
    const key = eventBreadcrumbSchemaKey(event.id);
    const row = saved.get(key);
    return { key, path, label: `${event.title} breadcrumb`, type: "BreadcrumbList", note: "Derived from the live event route and title.", fields: [], lockedFields: ["all route and label values"], enabled: row?.enabled ?? true, override: null, lastModified: row?.updatedAt?.toISOString() ?? null, json: { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://valenciabasket.ae" }, { "@type": "ListItem", position: 2, name: "events", item: "https://valenciabasket.ae/events" }, { "@type": "ListItem", position: 3, name: event.title, item: `https://valenciabasket.ae${path}` }] } };
  });
  const coachEntries = await getCoachStructuredEntries(true);
  const locked = (key: string, path: string, label: string, type: string, json: unknown) => {
    const row = saved.get(key);
    return { key, path, label, type, note: "This schema follows verified page content and is locked.", fields: [], lockedFields: ["all content-derived fields"], enabled: row?.enabled ?? true, override: null, lastModified: row?.updatedAt?.toISOString() ?? null, json };
  };
  return NextResponse.json([...staticEntries, ...coachEntries, ...eventEntries, ...eventBreadcrumbEntries, locked("/faqs", "/faqs", "FAQs", "FAQPage", faqStructuredData), locked("/contact", "/contact", "Contact", "SportsActivityLocation", contactStructuredData)]);
}
export async function PUT(request: NextRequest) {
  const error = await requireAdmin(request); if (error) return error;
  const parsed = body.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Invalid structured data update", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  const entry = [...structuredDataRegistry, ...breadcrumbStructuredDataRegistry].find((item) => item.key === parsed.data.key);
  const coach = !entry && (await getCoachStructuredEntries(true)).find((item) => item.key === parsed.data.key);
  const event = !entry && !coach && (await storage.getAllEvents()).find((item) => eventSchemaKey(item.id) === parsed.data.key || eventBreadcrumbSchemaKey(item.id) === parsed.data.key);
  const locked = lockedEntries.get(parsed.data.key);
  if (!entry && !event && !coach && !locked) return NextResponse.json({ error: "Unknown schema" }, { status: 400 });
  if (entry && parsed.data.schemaType && !entry.fields.length && parsed.data.schemaType !== entry.type) return NextResponse.json({ error: "This content-derived schema type is locked" }, { status: 400 });
  if (entry && parsed.data.schemaType && !EDITABLE_SCHEMA_TYPES.includes(parsed.data.schemaType)) return NextResponse.json({ error: "Unsupported schema type" }, { status: 400 });
  const values = parsed.data.overrides ?? {};
  if (!entry && Object.keys(values).length) return NextResponse.json({ error: "Locked content fields cannot be overridden" }, { status: 400 });
  if (entry) {
    const fields = new Map(entry.fields.map((field) => [field.key, field]));
    if (Object.keys(values).some((key) => !fields.has(key))) return NextResponse.json({ error: "A locked field cannot be overridden" }, { status: 400 });
    for (const [key, value] of Object.entries(values)) { const field = fields.get(key)!; if (value && field.type === "url" && !z.string().url().safeParse(value).success) return NextResponse.json({ error: "Invalid URL", fields: { [key]: ["Must be a URL"] } }, { status: 400 }); if (value && field.type === "email" && !z.string().email().safeParse(value).success) return NextResponse.json({ error: "Invalid email", fields: { [key]: ["Must be an email"] } }, { status: 400 }); if (value && field.type === "date" && !z.string().datetime({ offset: true }).safeParse(value).success && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NextResponse.json({ error: "Invalid ISO date", fields: { [key]: ["Must be an ISO 8601 date"] } }, { status: 400 }); }
  }
  const meaningful = Object.fromEntries(Object.entries(values).filter(([, value]) => value.trim()));
  await storage.upsertSeoSchemaOverride(parsed.data.key, parsed.data.schemaType ?? entry?.type ?? (event ? (parsed.data.key === eventBreadcrumbSchemaKey(event.id) ? "BreadcrumbList" : "Event") : coach ? "Person" : locked!.type), parsed.data.enabled ?? true, Object.keys(meaningful).length ? meaningful : null);
  revalidatePath(entry?.path ?? (event ? `/events/${event.slug}` : coach ? "/coaches" : locked!.route)); revalidatePath("/events"); revalidatePath("/", "layout");
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