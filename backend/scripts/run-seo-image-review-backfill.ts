import { pool } from "../db";
import { backfillSeoImageReviews } from "./seo-image-review-backfill";

async function main() {
  try {
    const { migrated, queuedForReview } = await backfillSeoImageReviews();
    console.log(
      `SEO image review backfill complete: ${migrated} file record(s) created, ${queuedForReview} review(s) queued.`
    );
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Failed to backfill SEO image reviews:", error);
  process.exitCode = 1;
});