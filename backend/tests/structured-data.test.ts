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

test("blog home page lists only public, indexable, schema-enabled articles and ignores manual overrides", async () => {
  const originalPosts = storage.getPublishedBlogPosts;
  const originalOverrides = storage.getAllSeoSchemaOverrides;
  const base = {
    authorName: "Coach", publishedAt: new Date("2026-09-01T00:00:00Z"), updatedAt: new Date("2026-09-02T00:00:00Z"),
    visibility: "public", noIndex: false, schemaEnabled: true, featuredImageSrc: null,
  };
  storage.getPublishedBlogPosts = (async () => [
    { ...base, title: "Listed", slug: "listed", featuredImageSrc: "https://cdn.example.com/a.jpg" },
    { ...base, title: "Legacy image", slug: "legacy", featuredImageSrc: "data:image/png;base64,AAAA" },
    { ...base, title: "Password", slug: "password", visibility: "password" },
    { ...base, title: "Hidden", slug: "hidden", noIndex: true },
    { ...base, title: "Schema off", slug: "schema-off", schemaEnabled: false },
  ]) as unknown as typeof storage.getPublishedBlogPosts;
  storage.getAllSeoSchemaOverrides = async () => [
    { id: "1", path: "/blog", schemaType: "WebPage", overrides: [{ "@context": "https://schema.org", "@type": "WebPage" }], enabled: true, updatedAt: new Date() },
  ];
  try {
    const result = await getStructuredData("/blog", "Blog");
    const blog = result.find((item) => item["@type"] === "Blog") as { blogPost: Array<Record<string, unknown>> } | undefined;
    assert.ok(blog, "the manual override must be ignored in favour of the generated Blog schema");
    assert.deepEqual(blog.blogPost.map((post) => post.headline), ["Listed", "Legacy image"]);
    assert.equal(blog.blogPost[0].image, "https://cdn.example.com/a.jpg");
    assert.equal(blog.blogPost[1].image, undefined, "data URIs must never be inlined into schema");
    assert.equal(blog.blogPost[0].url, "https://valenciabasket.ae/blog/listed");
  } finally {
    storage.getPublishedBlogPosts = originalPosts;
    storage.getAllSeoSchemaOverrides = originalOverrides;
  }
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
