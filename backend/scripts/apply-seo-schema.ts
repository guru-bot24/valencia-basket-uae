/**
 * Applies scripts/sql/seo-manager.sql to the configured database.
 *
 * This is the idempotent schema path used by post-merge setup.
 *
 * Usage: npx tsx scripts/apply-seo-schema.ts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pool } from "../db";
import { backfillSeoImageReviews } from "./seo-image-review-backfill";

async function main() {
  const sql = readFileSync(join(process.cwd(), "scripts/sql/seo-manager.sql"), "utf8");
  await pool.query(sql);
  const { migrated, queuedForReview } = await backfillSeoImageReviews();
  console.log(
    `SEO image review backfill complete: ${migrated} file record(s) created, ${queuedForReview} review(s) queued.`
  );
  console.log("SEO Manager schema applied");
  await pool.end();
}

main().catch((error) => {
  console.error("Failed to apply SEO Manager schema:", error);
  process.exit(1);
});
