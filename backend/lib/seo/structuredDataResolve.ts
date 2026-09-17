import "server-only";
import { cache } from "react";
import { storage } from "@/lib/storage";
import {
  structuredDataRegistry,
  breadcrumbStructuredDataRegistry,
  breadcrumbs,
  contactStructuredData,
  faqStructuredData,
} from "./structuredData";
import { getCoachStructuredEntries } from "./coaches";

export const getStructuredDataOverrides = cache(async () => {
  try {
    return new Map((await storage.getAllSeoSchemaOverrides()).map((row) => [row.path, row]));
  } catch (error) {
    console.error("[seo] failed to load structured data overrides:", error);
    return new Map();
  }
});

/** Pure computation of an Event's Schema.org JSON-LD — no DB reads, no overrides. */
export function getEventStructuredData(event: {
  id: string;
  slug: string;
  title: string;
  date: string;
  description: string;
  location: string;
  endDate: string | null;
}): Record<string, unknown>[] {
  const path = `/events/${event.slug}`;
  const startDate = /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(event.date) ? { startDate: event.date } : {};
  const endDate =
    event.endDate && /^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(event.endDate) ? { endDate: event.endDate } : {};
  return [
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.title,
      url: `https://valenciabasket.ae${path}`,
      description: event.description,
      ...startDate,
      ...endDate,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: { "@type": "Place", name: event.location },
    },
  ];
}

/**
 * The full default JSON-LD array for a page, before any admin override is
 * applied. Combines the static registry, the page's breadcrumb, and any
 * live-content schema (events, coaches, FAQs, contact) that belongs on it.
 */
async function computeDefaultPageSchema(path: string, label?: string): Promise<Record<string, unknown>[]> {
  if (path === "/__schema/sitewide-organization") {
    const entry = structuredDataRegistry.find((candidate) => candidate.key === "/__schema/sitewide-organization");
    return entry ? [entry.json as Record<string, unknown>] : [];
  }

  const eventSlugMatch = /^\/events\/([^/]+)$/.exec(path);
  if (eventSlugMatch) {
    const event = await storage.getEventBySlug(eventSlugMatch[1]);
    if (!event) return [];
    return [...getEventStructuredData(event), breadcrumbs(path, event.title) as Record<string, unknown>];
  }

  const staticEntries = structuredDataRegistry
    .filter((entry) => entry.path === path && entry.key !== "/__schema/sitewide-organization")
    .map((entry) => entry.json as Record<string, unknown>);
  const breadcrumbEntry = breadcrumbStructuredDataRegistry.find((entry) => entry.path === path);
  const breadcrumbJson = breadcrumbEntry
    ? (breadcrumbEntry.json as Record<string, unknown>)
    : label && path !== "/"
      ? (breadcrumbs(path, label) as Record<string, unknown>)
      : null;
  const withBreadcrumb = (entries: Record<string, unknown>[]) =>
    breadcrumbJson ? [...entries, breadcrumbJson] : entries;

  if (path === "/coaches") {
    const coaches = (await getCoachStructuredEntries(true)).map((entry) => entry.json as Record<string, unknown>);
    return withBreadcrumb([...staticEntries, ...coaches]);
  }
  if (path === "/faqs") {
    return withBreadcrumb([...staticEntries, faqStructuredData as unknown as Record<string, unknown>]);
  }
  if (path === "/contact") {
    return withBreadcrumb([...staticEntries, contactStructuredData as unknown as Record<string, unknown>]);
  }
  if (path === "/events") {
    const events = await storage.getAllEvents();
    const eventSchemas = events.flatMap((event) => getEventStructuredData(event));
    return withBreadcrumb([...staticEntries, ...eventSchemas]);
  }

  return withBreadcrumb(staticEntries);
}

/**
 * Single entry point pages use to render their JSON-LD. An admin-saved
 * override, when present, fully replaces the computed default for that page.
 */
export async function getStructuredData(path: string, label?: string): Promise<Record<string, unknown>[]> {
  const overrides = await getStructuredDataOverrides();
  const saved = overrides.get(path);
  if (saved) {
    if (!saved.enabled) return [];
    if (Array.isArray(saved.overrides)) return saved.overrides as Record<string, unknown>[];
  }
  return computeDefaultPageSchema(path, label);
}

export async function getSitewideStructuredData(): Promise<Record<string, unknown>[]> {
  return getStructuredData("/__schema/sitewide-organization");
}
