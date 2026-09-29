import assert from "node:assert/strict";
import test from "node:test";
import type { ReactElement } from "react";
import { normalizeSocialUrl } from "@/lib/content/socialLinks";
import { SocialIcons } from "@/components/SocialIcons";
import { AUTHOR_SLUGS, DEFAULT_STAFF, STAFF_SECTIONS, slugify, staffInputSchema } from "@/lib/content/staff";

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

test("default staff: unique slugs, known sections, and both blog authors present", () => {
  const slugs = DEFAULT_STAFF.map((member) => member.slug);
  assert.equal(slugs.length, new Set(slugs).size);
  for (const member of DEFAULT_STAFF) assert.ok(STAFF_SECTIONS.includes(member.section));
  assert.deepEqual(DEFAULT_STAFF.filter((member) => member.isAuthor).map((member) => member.slug), [...AUTHOR_SLUGS]);
});

test("staff input requires name and title, checks photo and social links", () => {
  const valid = { section: "Coaching Staff", name: " Coach Test ", role: "Coach", bio: "", image: "", visible: false, instagram: "instagram.com/test" };
  const parsed = staffInputSchema.parse(valid);
  assert.equal(parsed.name, "Coach Test");
  assert.equal(parsed.instagram, "https://instagram.com/test");
  assert.equal(parsed.facebook, null, "empty social boxes are stored as null");
  assert.equal(staffInputSchema.safeParse({ ...valid, name: "  " }).success, false);
  assert.equal(staffInputSchema.safeParse({ ...valid, role: "" }).success, false);
  assert.equal(staffInputSchema.safeParse({ ...valid, section: "Players" }).success, false);
  assert.equal(staffInputSchema.safeParse({ ...valid, image: "javascript:alert(1)" }).success, false);
  const wrongSocial = staffInputSchema.safeParse({ ...valid, tiktok: "https://facebook.com/x" });
  assert.equal(wrongSocial.success, false);
  assert.equal(wrongSocial.error?.issues[0].path[0], "tiktok", "the error points at the right box");
});

test("new member slugs drop 'Coach' and accents", () => {
  assert.equal(slugify("Coach Maroš Kováčik"), "maros-kovacik");
  assert.equal(slugify("  Omar Al-Hassan "), "omar-al-hassan");
  assert.equal(slugify("!!!"), "staff");
});
