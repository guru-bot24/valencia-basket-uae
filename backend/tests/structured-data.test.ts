import assert from "node:assert/strict";
import test from "node:test";
import {
  breadcrumbStructuredDataRegistry,
  structuredDataRegistry,
} from "@/lib/seo/structuredData";
import {
  getEventStructuredData,
  resolveStructuredEntry,
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

test("structured-data overrides inherit blanks and ignore locked properties", () => {
  const entry = structuredDataRegistry.find((candidate) => candidate.type === "Course");
  assert.ok(entry);

  const defaults = entry.json as Record<string, unknown>;
  const resolved = resolveStructuredEntry(entry, {
    enabled: true,
    schemaType: "Article",
    overrides: {
      description: "Approved program description",
      name: "Attempted locked override",
      url: "https://example.com/not-allowed",
      ignoredBlank: "",
    },
  });
  assert.equal((resolved.json as Record<string, unknown>)["@type"], "Article");

  assert.equal(resolved.enabled, true);
  assert.equal((resolved.json as Record<string, unknown>).description, "Approved program description");
  assert.equal((resolved.json as Record<string, unknown>).name, defaults.name);
  assert.equal((resolved.json as Record<string, unknown>).url, defaults.url);

  const inherited = resolveStructuredEntry(entry, {
    enabled: false,
    overrides: { description: "" },
  });
  assert.equal(inherited.enabled, false);
  assert.equal((inherited.json as Record<string, unknown>).description, defaults.description);
});

test("event schema uses live start/end dates and offline attendance mode", async () => {
  const original = storage.getAllSeoSchemaOverrides;
  storage.getAllSeoSchemaOverrides = async () => [];
  try {
    const [event] = await getEventStructuredData({
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
    assert.equal(
      event.eventAttendanceMode,
      "https://schema.org/OfflineEventAttendanceMode"
    );
    assert.deepEqual(event.location, {
      "@type": "Place",
      name: "AllSports Arena",
    });
  } finally {
    storage.getAllSeoSchemaOverrides = original;
  }
});