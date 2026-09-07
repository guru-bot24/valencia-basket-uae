import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const projectFile = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

test("blog landing page is linked from Explore and has registered metadata", () => {
  const page = projectFile("app/blog/page.tsx");
  const footer = projectFile("components/layout/Footer.tsx");
  const registry = projectFile("lib/seo/registry.ts");
  const sitemap = projectFile("app/sitemap.ts");

  assert.match(page, /export default async function BlogPage/);
  assert.match(page, /getPublishedBlogPosts/);
  assert.match(page, /href=\{`\/blog\/\$\{post\.slug\}`\}/);
  assert.match(page, /buildPageMetadata\("\/blog"\)/);
  assert.match(
    footer,
    /<Link href="\/blog"[^>]*>Blog<\/Link>/,
    "Explore footer links must include the blog"
  );
  assert.match(
    registry,
    /path: "\/blog"[\s\S]*canonical: "\/blog"/,
    "the blog route must have an SEO default"
  );
  assert.match(
    sitemap,
    /url: `\$\{baseUrl\}\/blog`/,
    "the blog route must be discoverable in the sitemap"
  );
});