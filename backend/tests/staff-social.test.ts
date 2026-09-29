import assert from "node:assert/strict";
import test from "node:test";
import type { ReactElement } from "react";
import { normalizeSocialUrl } from "@/lib/content/socialLinks";
import { SocialIcons } from "@/components/SocialIcons";
import { STAFF } from "@/lib/content/staff";
import { LIVE_COACHES } from "@/lib/seo/coaches";

test("social links accept each platform's own URLs and normalize them to https", () => {
  assert.deepEqual(normalizeSocialUrl("instagram", "instagram.com/coach"), { url: "https://instagram.com/coach" });
  assert.deepEqual(normalizeSocialUrl("instagram", "http://www.instagram.com/coach/"), { url: "https://www.instagram.com/coach/" });
  assert.deepEqual(normalizeSocialUrl("facebook", "https://m.facebook.com/coach"), { url: "https://m.facebook.com/coach" });
  assert.deepEqual(normalizeSocialUrl("tiktok", " https://www.tiktok.com/@coach "), { url: "https://www.tiktok.com/@coach" });
  assert.deepEqual(normalizeSocialUrl("tiktok", "   "), { url: "" });
});

test("social links reject another platform, lookalike hosts, and bare homepages", () => {
  assert.ok("error" in normalizeSocialUrl("tiktok", "https://www.facebook.com/coach"));
  assert.ok("error" in normalizeSocialUrl("instagram", "https://instagram.com.evil.example/coach"));
  assert.ok("error" in normalizeSocialUrl("instagram", "https://notinstagram.com/coach"));
  assert.ok("error" in normalizeSocialUrl("facebook", "https://www.facebook.com/"));
  assert.ok("error" in normalizeSocialUrl("facebook", "javascript:alert(1)"));
});

test("only platforms with a saved link render an icon, and none renders nothing", () => {
  const tree = SocialIcons({ links: { instagram: "https://www.instagram.com/coach" }, personName: "Coach Majil" }) as ReactElement<{ children: ReactElement<Record<string, string>>[] }>;
  const anchors = tree.props.children;
  assert.equal(anchors.length, 1);
  assert.equal(anchors[0].props.href, "https://www.instagram.com/coach");
  assert.equal(anchors[0].props["aria-label"], "Coach Majil on Instagram");
  assert.equal(anchors[0].props.target, "_blank");
  assert.equal(anchors[0].props.rel, "noopener noreferrer");
  assert.equal(SocialIcons({ links: {}, personName: "Coach Ahmed" }), null);
});

test("staff list and the coach schema list stay in sync", () => {
  assert.deepEqual(
    STAFF.map((member) => [member.slug, member.name, member.role]),
    LIVE_COACHES.map(([slug, name, role]) => [slug, name, role]),
  );
});
