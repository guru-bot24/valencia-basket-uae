-- File-level image descriptions keep legacy placement rows intact while adding
-- an administrator review state for conflicting descriptions.
ALTER TABLE "seo_image_alts" ADD COLUMN IF NOT EXISTS "image_src" text;
--> statement-breakpoint
ALTER TABLE "seo_image_alts" ADD COLUMN IF NOT EXISTS "is_decorative" boolean NOT NULL DEFAULT false;
--> statement-breakpoint
ALTER TABLE "seo_image_alts" ADD COLUMN IF NOT EXISTS "needs_review" boolean NOT NULL DEFAULT false;
--> statement-breakpoint
ALTER TABLE "seo_image_alts" ADD COLUMN IF NOT EXISTS "reviewed_at" timestamp;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "seo_image_alts_image_src_unique"
  ON "seo_image_alts" USING btree ("image_src")
  WHERE "seo_image_alts"."image_src" IS NOT NULL;