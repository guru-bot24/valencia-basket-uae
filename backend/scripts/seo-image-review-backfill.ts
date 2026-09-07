import type { PoolClient } from "pg";
import { pool } from "../db";
import { MANAGED_IMAGE_ASSETS } from "../lib/seo/images";

interface LegacyAltRow {
  image_key: string;
  alt_text: string | null;
  updated_at: Date;
}

interface FileAltRow {
  image_key: string;
  reviewed_at: Date | null;
}

export interface SeoImageReviewBackfillResult {
  migrated: number;
  queuedForReview: number;
}

/**
 * Moves legacy placement descriptions to one canonical row per image file.
 * Conflicting descriptions retain their legacy rows and remain pending until an
 * administrator resolves the resulting review.
 */
export async function backfillSeoImageReviews(): Promise<SeoImageReviewBackfillResult> {
  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");
    const { rows } = await client.query<LegacyAltRow>(
      `SELECT image_key, alt_text, updated_at
       FROM seo_image_alts
       WHERE image_src IS NULL
         AND alt_text IS NOT NULL
         AND btrim(alt_text) <> ''
       ORDER BY updated_at DESC, image_key ASC`
    );
    const legacyByKey = new Map(rows.map((row) => [row.image_key, row]));
    let migrated = 0;
    let queuedForReview = 0;

    for (const asset of MANAGED_IMAGE_ASSETS) {
      const candidates = asset.placements
        .map((placement) => legacyByKey.get(placement.key))
        .filter((row): row is LegacyAltRow => !!row)
        .sort(
          (left, right) =>
            new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime() ||
            left.image_key.localeCompare(right.image_key)
        );
      if (candidates.length === 0) continue;

      const hasConflict = new Set(candidates.map((row) => row.alt_text!.trim())).size > 1;
      const existing = await client.query<FileAltRow>(
        "SELECT image_key, reviewed_at FROM seo_image_alts WHERE image_src = $1 LIMIT 1",
        [asset.src]
      );

      if (existing.rowCount) {
        // Do not reopen a review an administrator has already completed.
        if (hasConflict && !existing.rows[0].reviewed_at) {
          const update = await client.query(
            `UPDATE seo_image_alts
             SET needs_review = true
             WHERE image_key = $1
               AND reviewed_at IS NULL
               AND needs_review = false`,
            [existing.rows[0].image_key]
          );
          queuedForReview += update.rowCount ?? 0;
        }
        continue;
      }

      const chosen = candidates[0];
      const insert = await client.query(
        `INSERT INTO seo_image_alts
           (image_key, image_src, alt_text, is_decorative, needs_review, updated_at)
         VALUES ($1, $2, $3, false, $4, $5)
         ON CONFLICT (image_key) DO NOTHING`,
        [asset.storageKey, asset.src, chosen.alt_text, hasConflict, chosen.updated_at]
      );
      migrated += insert.rowCount ?? 0;
      if (hasConflict && insert.rowCount) queuedForReview += 1;
    }

    await client.query("COMMIT");
    return { migrated, queuedForReview };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}