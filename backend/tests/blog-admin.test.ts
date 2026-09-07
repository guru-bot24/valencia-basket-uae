import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { blogPostInputSchema, sanitizeBlogHtml } from "@/lib/blog";

const projectFile = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

const validPost = {
  title: "Approved academy article",
  slug: "approved-academy-article",
  excerpt: "A concise article summary.",
  content: "Article body content.",
  featuredImageSrc: null,
  featuredImageAlt: null,
  authorName: "Academy Team",
  status: "draft" as const,
  publishedAt: null,
  isFeatured: false,
  metaTitle: null,
  metaDescription: null,
  ogImage: null,
  focusKeyword: null,
  noIndex: false,
  visibility: "public" as const,
  password: null,
  lockModifiedDate: false,
  ogTitle: null,
  ogDescription: null,
  categoryNames: ["Academy"],
  tagNames: [],
};

test("blog post validation rejects unsafe slugs, images, and incomplete schedules", () => {
  assert.equal(blogPostInputSchema.safeParse(validPost).success, true);
  assert.equal(blogPostInputSchema.safeParse({ ...validPost, slug: "../unsafe" }).success, false);
  assert.equal(blogPostInputSchema.safeParse({ ...validPost, featuredImageSrc: "javascript:alert(1)", featuredImageAlt: "Bad" }).success, false);
  assert.equal(blogPostInputSchema.safeParse({ ...validPost, status: "scheduled" }).success, false);
  assert.equal(blogPostInputSchema.safeParse({ ...validPost, status: "scheduled", publishedAt: "2026-12-01T08:00:00.000Z" }).success, true);
});

test("rich blog HTML keeps approved formatting and removes executable content", () => {
  const safe = sanitizeBlogHtml('<h2 style="text-align:center">Title</h2><p><strong>Safe</strong> <a href="https://example.com">link</a></p><script>alert(1)</script><img src="x" onerror="alert(1)">');
  assert.match(safe, /<h2 style="text-align:center">Title<\/h2>/);
  assert.match(safe, /<strong>Safe<\/strong>/);
  assert.match(safe, /href="https:\/\/example.com"/);
  assert.doesNotMatch(safe, /script|onerror|alert\(1\)|src="x"/i);
});

test("blog admin and public routes use authenticated persisted content", () => {
  const adminList = projectFile("app/api/admin/blog/route.ts");
  const adminItem = projectFile("app/api/admin/blog/[id]/route.ts");
  const adminPage = projectFile("app/admin/page.tsx");
  const manager = projectFile("app/admin/BlogManager.tsx");
  const publicPage = projectFile("app/blog/page.tsx");
  const detailPage = projectFile("app/blog/[slug]/page.tsx");
  const unlockRoute = projectFile("app/api/blog/[slug]/unlock/route.ts");

  assert.match(adminList, /requireAdmin/);
  assert.match(adminItem, /requireAdmin/);
  assert.match(adminList, /createBlogPost/);
  assert.match(adminItem, /updateBlogPost/);
  assert.match(adminItem, /deleteBlogPost/);
  assert.match(adminPage, /tab-trigger-blog/);
  const editor = projectFile("app/admin/BlogEditor.tsx");
  const metaApi = projectFile("app/api/admin/blog/meta/route.ts");
  assert.match(manager, /BlogEditor/);
  assert.match(editor, /Add Media/);
  assert.match(editor, /Word count:/);
  assert.match(editor, /Edit Snippet/);
  assert.match(editor, /All Categories/);
  assert.match(editor, /Most Used/);
  assert.match(metaApi, /requireAdmin/);
  assert.match(adminList, /withoutPasswordHash/);
  assert.match(adminItem, /withoutPasswordHash/);
  assert.match(unlockRoute, /bcrypt\.compare/);
  assert.match(unlockRoute, /httpOnly:\s*true/);
  assert.match(detailPage, /verifyBlogAccessToken/);
  assert.match(detailPage, /PasswordForm/);
  assert.match(publicPage, /getPublishedBlogPosts/);
  assert.match(detailPage, /getBlogPostBySlug/);
  assert.doesNotMatch(detailPage, /dangerouslySetInnerHTML=\{\{ __html: post\.content/);
});