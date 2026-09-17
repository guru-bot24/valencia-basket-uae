import assert from "node:assert/strict";
import test from "node:test";
import {
  breadcrumbStructuredDataRegistry,
  structuredDataRegistry,
} from "@/lib/seo/structuredData";
import {
  getEventStructuredData,
  getStructuredData,
} from "@/lib/seo/structuredDataResolve";
import { storage } from "@/lib/storage";

test("structured-data registry covers the requested static inner breadcrumbs", () => {
  const paths = new Set(breadcrumbStructuredDataRegistry.map((entry) => entry.path));
  for (const path of ["/programs", "/programs/future-ballers", "/programs/mini-basket", "/programs/youth-academy", "/programs/private-training", "/methodology", "/coaches", "/facilities", "/admissions", "/events", "/contact", "/faqs", "/blog", "/privacy-policy", "/terms"]) {
    assert.ok(paths.has(path), `missing breadcrumb for ${path}`);
  }
});

test("only the three core programs are Course entries", () => {
  assert.deepEqual(
    structuredDataRegistry.filter((entry) => entry.type === "Course").map((entry) => entry.path).sort(),
    ["/programs/future-ballers", "/programs/mini-basket", "/programs/youth-academy"]
  );
});

test("registry identities are unique and editable fields never include locks", () => {
  const keys = structuredDataRegistry.map((entry) => entry.key);
  assert.equal(keys.length, new Set(keys).size);
  for (const entry of structuredDataRegistry) {
    for (const field of entry.fields) assert.equal(entry.lockedFields?.includes(field.key), false);
  }
});

test("event schema uses live start/end dates and offline attendance mode", () => {
  const [event] = getEventStructuredData({
    id: "event-1",
    slug: "summer-camp",
    title: "Summer Camp",
    date: "2026-07-01",
    endDate: "2026-07-05",
    description: "Live event description",
    location: "AllSports Arena",
  });

  assert.equal(event.startDate, "2026-07-01");
  assert.equal(event.endDate, "2026-07-05");
  assert.equal(event.eventAttendanceMode, "https://schema.org/OfflineEventAttendanceMode");
  assert.deepEqual(event.location, { "@type": "Place", name: "AllSports Arena" });
});

test("a saved page override fully replaces the computed default", async () => {
  const originalGetAll = storage.getAllSeoSchemaOverrides;
  const originalGetEvents = storage.getAllEvents;
  const customOverride = [{ "@context": "https://schema.org", "@type": "WebPage", name: "Custom" }];
  storage.getAllSeoSchemaOverrides = async () => [
    { id: "1", path: "/facilities", schemaType: "WebPage", overrides: customOverride, enabled: true, updatedAt: new Date() },
  ];
  storage.getAllEvents = async () => [];
  try {
    const result = await getStructuredData("/facilities", "Facilities");
    assert.deepEqual(result, customOverride);
  } finally {
    storage.getAllSeoSchemaOverrides = originalGetAll;
    storage.getAllEvents = originalGetEvents;
  }
});
