/**
 * Shrinks images uploaded before automatic optimisation existed.
 *
 *   Dry run (changes nothing, prints the plan):
 *     railway run npx tsx --conditions=react-server scripts/optimize-existing-images.ts
 *   Apply:
 *     railway run npx tsx --conditions=react-server scripts/optimize-existing-images.ts --apply
 *
 * Needs DATABASE_URL and the R2_* variables. Originals stay in R2 (nothing is
 * deleted); only the database links are switched to the smaller copies.
 */
import { eq } from "drizzle-orm";
import { db, pool } from "../db";
import { blogPosts, pageContentOverrides, staffMembers } from "@shared/schema";
import { CONTENT_FIELDS } from "@/lib/content/pageContent";
import { DEFAULT_STAFF } from "@/lib/content/staff";
import { optimizeBlogImage } from "@/lib/imageOptimize";
import { collectCandidates, planBackfill, replaceImageSrc } from "@/lib/imageBackfill";
import { R2_PUBLIC_URL, uploadBlogImage } from "@/lib/r2";
import { sniffImageType } from "@/lib/imageImport";

const apply = process.argv.includes("--apply");
const kb = (bytes: number) => (bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`);

async function load(src: string) {
  if (src.startsWith("data:")) {
    const [, type, base64] = /^data:(image\/[a-z]+);base64,(.+)$/i.exec(src) ?? [];
    if (!type) throw new Error("unreadable inline image");
    return { body: new Uint8Array(Buffer.from(base64, "base64")), contentType: type };
  }
  const response = await fetch(src, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const body = new Uint8Array(await response.arrayBuffer());
  const contentType = sniffImageType(body);
  if (!contentType) throw new Error("not a PNG/JPEG/WebP/GIF file");
  return { body, contentType };
}

async function main() {
  const [posts, pageContent, staff] = await Promise.all([
    db.select({ id: blogPosts.id, title: blogPosts.title, content: blogPosts.content, featuredImageSrc: blogPosts.featuredImageSrc, ogImage: blogPosts.ogImage }).from(blogPosts),
    db.select({ key: pageContentOverrides.key, value: pageContentOverrides.value }).from(pageContentOverrides),
    db.select({ id: staffMembers.id, name: staffMembers.name, image: staffMembers.image }).from(staffMembers),
  ]);

  const candidates = collectCandidates({ posts, pageContent, staff }, {
    ownHost: new URL(R2_PUBLIC_URL).hostname,
    imageContentKeys: new Set(CONTENT_FIELDS.filter((field) => field.type === "image").map((field) => field.key)),
    defaultStaffImages: new Set(DEFAULT_STAFF.map((member) => member.image)),
  });
  console.log(`${apply ? "APPLYING" : "DRY RUN (nothing will change)"}: ${candidates.length} image(s) found in ${posts.length} article(s), ${pageContent.length} Page Content override(s), ${staff.length} staff member(s).\n`);

  const plan = await planBackfill(candidates, { load, optimize: optimizeBlogImage });
  let before = 0;
  let after = 0;
  for (const item of plan) {
    const name = item.candidate.src.startsWith("data:") ? `inline image (${kb(item.beforeBytes)})` : item.candidate.src.split("/").pop();
    const used = item.candidate.refs.map((ref) => ref.label).join("; ");
    if (item.action !== "skip") {
      before += item.beforeBytes;
      after += item.afterBytes!;
      const why = item.action === "move" ? ` [moving: ${item.reason}]` : "";
      console.log(`  ✔ ${item.action.padEnd(6)}  ${name}: ${kb(item.beforeBytes)} → ${kb(item.afterBytes!)} (${item.optimized!.contentType})${why}  — ${used}`);
    } else {
      console.log(`  · skip    ${name}: ${item.reason}  — ${used}`);
    }
  }
  const toShrink = plan.filter((item) => item.action !== "skip");
  console.log(`\n${toShrink.length} to shrink or move, ${plan.length - toShrink.length} left as they are. Total ${kb(before)} → ${kb(after)}.`);

  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to store the smaller copies and switch the links.");
    return;
  }

  for (const item of toShrink) {
    const url = await uploadBlogImage(item.optimized!.body, item.optimized!.contentType);
    await db.transaction(async (tx) => {
      for (const ref of item.candidate.refs) {
        if (ref.table === "blog_posts") {
          const [post] = await tx.select().from(blogPosts).where(eq(blogPosts.id, Number(ref.id)));
          if (!post) continue;
          if (ref.field === "content") await tx.update(blogPosts).set({ content: replaceImageSrc(post.content, item.candidate.src, url) }).where(eq(blogPosts.id, post.id));
          if (ref.field === "featured_image_src") await tx.update(blogPosts).set({ featuredImageSrc: url }).where(eq(blogPosts.id, post.id));
          if (ref.field === "og_image") await tx.update(blogPosts).set({ ogImage: url }).where(eq(blogPosts.id, post.id));
        } else if (ref.table === "page_content_overrides") {
          await tx.update(pageContentOverrides).set({ value: url, updatedAt: new Date() }).where(eq(pageContentOverrides.key, String(ref.id)));
        } else {
          await tx.update(staffMembers).set({ image: url, updatedAt: new Date() }).where(eq(staffMembers.id, Number(ref.id)));
        }
      }
    });
    console.log(`  switched ${item.candidate.refs.length} use(s) to ${url}`);
  }
  console.log("\nDone. Pages refresh within a minute (or on the next edit). Originals were kept in R2.");
}

main()
  .catch((error) => {
    console.error("Image optimisation failed:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
