/**
 * Verifies the migrated database supports the administrator image-description
 * review flow. This intentionally runs outside of builds as an explicit
 * release check:
 *
 *   npm run db:migrate
 *   npm run check:image-review
 */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { GET as listImageAlts, PUT as saveImageAlt } from "@/app/api/admin/seo/images/route";
import { pool } from "@/db";
import { MANAGED_IMAGE_ASSETS } from "@/lib/seo/images";
import { storage } from "@/lib/storage";
import { backfillSeoImageReviews } from "./seo-image-review-backfill";

const token = `image-review-check-${randomUUID()}`;
const userId = `image-review-check-${randomUUID()}`;

function request(method: "GET" | "PUT", body?: unknown) {
  return new NextRequest("http://localhost/api/admin/seo/images", {
    method,
    headers: {
      cookie: `admin_token=${token}`,
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

async function main() {
  let cleanupKeys: string[] = [];

  try {
    const existingRows = await storage.getAllSeoImageAlts();
    const asset = MANAGED_IMAGE_ASSETS.find(
      (candidate) =>
        candidate.placements.length >= 2 &&
        !existingRows.some((row) =>
          row.imageKey === candidate.storageKey ||
          row.imageSrc === candidate.src ||
          candidate.placements.some((placement) => placement.key === row.imageKey)
        )
    );
    assert.ok(
      asset,
      "No unused managed image is available for the database review check; refusing to overwrite an administrator's description."
    );
    const [olderPlacement, newerPlacement] = asset.placements;
    cleanupKeys = [asset.storageKey, olderPlacement.key, newerPlacement.key];

    await storage.createSession(userId, token, new Date(Date.now() + 60_000));
    await Promise.all([
      pool.query(
        "INSERT INTO seo_image_alts (image_key, alt_text, updated_at) VALUES ($1, $2, $3)",
        [olderPlacement.key, "Earlier legacy description", new Date("2026-01-01T12:00:00Z")]
      ),
      pool.query(
        "INSERT INTO seo_image_alts (image_key, alt_text, updated_at) VALUES ($1, $2, $3)",
        [newerPlacement.key, "Later legacy description", new Date("2026-01-02T12:00:00Z")]
      ),
    ]);

    const backfill = await backfillSeoImageReviews();
    assert.equal(backfill.migrated, 1, "Migration should create one shared file record");
    assert.equal(backfill.queuedForReview, 1, "Conflicting legacy descriptions should require review");

    const pendingReview = await storage.getSeoImageAltFile(asset.src);
    assert.equal(pendingReview?.altText, "Later legacy description");
    assert.equal(pendingReview?.needsReview, true);

    const listResponse = await listImageAlts(request("GET"));
    assert.equal(listResponse.status, 200, "Administrator should be able to list image reviews");
    const listed = await listResponse.json();
    assert.ok(
      listed.conflicts.some((conflict: { src: string }) => conflict.src === asset.src),
      "Pending database review should appear in the administrator review list"
    );

    const resolveResponse = await saveImageAlt(
      request("PUT", {
        imageSrc: asset.src,
        altText: "Approved database review description",
        isDecorative: false,
        reviewConflict: true,
      })
    );
    assert.equal(resolveResponse.status, 200, "Administrator should be able to resolve an image review");

    const resolved = await storage.getSeoImageAltFile(asset.src);
    assert.equal(resolved?.needsReview, false);
    assert.equal(resolved?.altText, "Approved database review description");
    assert.ok(resolved?.reviewedAt, "Resolving a review should record when it was reviewed");

    const resolvedListResponse = await listImageAlts(request("GET"));
    assert.equal(resolvedListResponse.status, 200);
    const resolvedList = await resolvedListResponse.json();
    assert.equal(
      resolvedList.conflicts.some((conflict: { src: string }) => conflict.src === asset.src),
      false,
      "Resolved image reviews should leave the administrator review list"
    );

    console.log("Image-description review database check passed");
  } finally {
    if (cleanupKeys.length > 0) {
      await pool.query("DELETE FROM seo_image_alts WHERE image_key = ANY($1::text[])", [cleanupKeys]);
    }
    await storage.deleteSession(token);
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Image-description review database check failed:", error);
  process.exitCode = 1;
});