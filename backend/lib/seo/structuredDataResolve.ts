import "server-only";
import { cache } from "react";
import { storage } from "@/lib/storage";
import { structuredDataRegistry, breadcrumbStructuredDataRegistry, breadcrumbs, type ManagedStructuredDataEntry } from "./structuredData";

export const eventSchemaKey = (eventId: string) => `/__schema/event/${eventId}`;
export const eventBreadcrumbSchemaKey = (eventId: string) =>
  `/__schema/event-breadcrumb/${eventId}`;

export const EDITABLE_SCHEMA_TYPES = [
  "Article",
  "WebPage",
  "Organization",
  "Person",
  "Product",
  "Event",
  "FAQPage",
  "BreadcrumbList",
] as const;

export const getStructuredDataOverrides = cache(async () => {
  try { return new Map((await storage.getAllSeoSchemaOverrides()).map((row) => [row.path, row])); }
  catch (error) { console.error("[seo] failed to load structured data overrides:", error); return new Map(); }
});

/**
 * Editable entries store a full JSON-LD replacement, not a sparse field diff.
 * The API route validates shape (@context/@type present, name/url unchanged
 * from the verified default) before a save is accepted, so anything already
 * in the database here is trusted as complete, valid schema.
 */
export function resolveStructuredEntry(entry: ManagedStructuredDataEntry, override?: { enabled: boolean | null; overrides: Record<string, unknown> | null }) {
  const json = override?.overrides && typeof override.overrides === "object"
    ? (override.overrides as Record<string, unknown>)
    : (entry.json as Record<string, unknown>);
  return { enabled: override?.enabled ?? entry.enabledByDefault, json };
}
export async function getStructuredData(path: string, label?: string) {
  const overrides = await getStructuredDataOverrides();
  const entries = structuredDataRegistry
    .filter(
      (entry) =>
        entry.path === path && entry.key !== "/__schema/sitewide-organization"
    )
    .map((entry) => resolveStructuredEntry(entry, overrides.get(entry.key)));
  if (path !== "/" && label) {
    const entry = breadcrumbStructuredDataRegistry.find((candidate) => candidate.path === path);
    if (entry) entries.push(resolveStructuredEntry(entry, overrides.get(entry.key)));
    else {
      const event = /^\/events\/[^/]+$/.test(path)
        ? await storage.getEventBySlug(path.slice("/events/".length))
        : undefined;
      const breadcrumbOverride = event
        ? overrides.get(eventBreadcrumbSchemaKey(event.id))
        : undefined;
      entries.push({ enabled: breadcrumbOverride?.enabled ?? true, json: breadcrumbs(path, label) });
    }
  }
  return entries.filter((entry) => entry.enabled).map((entry) => entry.json);
}
export async function getSitewideStructuredData() {
  const overrides = await getStructuredDataOverrides();
  return structuredDataRegistry.filter((entry) => entry.key === "/__schema/sitewide-organization")
    .map((entry) => resolveStructuredEntry(entry, overrides.get(entry.key))).filter((entry) => entry.enabled).map((entry) => entry.json);
}
export async function isStructuredEntryEnabled(key: string) {
  return (await getStructuredDataOverrides()).get(key)?.enabled ?? true;
}
export async function getEventStructuredData(event: { id: string; slug: string; title: string; date: string; description: string; location: string; endDate: string | null }, includeDisabled = false) {
  const overrides = await getStructuredDataOverrides();
  const path = `/events/${event.slug}`;
  if (!includeDisabled && overrides.get(eventSchemaKey(event.id))?.enabled === false) return [];
  const startDate = /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(event.date) ? { startDate: event.date } : {};
  const endDate = event.endDate && /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(event.endDate) ? { endDate: event.endDate } : {};
  return [{ "@context": "https://schema.org", "@type": "Event", name: event.title, url: `https://valenciabasket.ae${path}`, description: event.description, ...startDate, ...endDate, eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Place", name: event.location } }];
}