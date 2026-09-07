import assert from "node:assert/strict";
import test from "node:test";
import { db } from "@/db";
import {
  blogCategories,
  blogPostCategories,
  blogPosts,
  blogPostTags,
  blogTags,
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { syncBlogTaxonomy } from "@/lib/storage";

class RollbackOnly extends Error {}

test("accepted blog taxonomy names are linked and rolled back", async () => {
  let verified = false;
  await assert.rejects(
    db.transaction(async (tx) => {
      const [post] = await tx.insert(blogPosts).values({
        title: "Rollback taxonomy fixture",
        slug: `rollback-taxonomy-${process.pid}`,
        content: "Rollback-only taxonomy verification.",
        authorName: "Test",
        status: "draft",
      }).returning();

      await syncBlogTaxonomy(tx, post.id, ["Rollback Development"], ["Rollback Skills"]);
      const [categoryLinks, tagLinks] = await Promise.all([
        tx.select().from(blogPostCategories).where(eq(blogPostCategories.postId, post.id)),
        tx.select().from(blogPostTags).where(eq(blogPostTags.postId, post.id)),
      ]);
      assert.equal(categoryLinks.length, 1);
      assert.equal(tagLinks.length, 1);
      verified = true;
      throw new RollbackOnly();
    }),
    RollbackOnly
  );
  assert.equal(verified, true);
});

test("normalized taxonomy slug collisions fail the whole transaction", async () => {
  await assert.rejects(
    db.transaction(async (tx) => {
      const [post] = await tx.insert(blogPosts).values({
        title: "Rollback collision fixture",
        slug: `rollback-collision-${process.pid}`,
        content: "Rollback-only collision verification.",
        authorName: "Test",
        status: "draft",
      }).returning();
      await tx.insert(blogCategories).values({
        name: "Rollback Existing Category",
        slug: "rollback-collision",
      });
      await tx.insert(blogTags).values({
        name: "Rollback Existing Tag",
        slug: "rollback-tag-collision",
      });

      await syncBlogTaxonomy(
        tx,
        post.id,
        ["Rollback Collision"],
        ["Rollback Tag Collision"]
      );
    }),
    (error: any) => error?.code === "BLOG_TAXONOMY_CONFLICT"
  );
});