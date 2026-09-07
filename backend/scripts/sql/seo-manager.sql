-- Website SEO Manager schema.
-- Idempotent on purpose: safe to re-run against any environment, including a
-- production database that already has the tables.

ALTER TABLE events ADD COLUMN IF NOT EXISTS image_alt text;

CREATE TABLE IF NOT EXISTS seo_pages (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image text,
  no_index boolean,
  updated_at timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo_image_alts (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  image_key text NOT NULL UNIQUE,
  image_src text,
  alt_text text,
  is_decorative boolean NOT NULL DEFAULT false,
  needs_review boolean NOT NULL DEFAULT false,
  reviewed_at timestamp,
  updated_at timestamp NOT NULL DEFAULT now()
);

-- `image_key` was the old placement identity. Canonical file rows now use
-- `image_src` and retain old placement rows for a safe, non-destructive
-- backfill. The partial index allows legacy rows to remain without claiming a
-- file identity.
ALTER TABLE seo_image_alts ADD COLUMN IF NOT EXISTS image_src text;
ALTER TABLE seo_image_alts ADD COLUMN IF NOT EXISTS is_decorative boolean NOT NULL DEFAULT false;
ALTER TABLE seo_image_alts ADD COLUMN IF NOT EXISTS needs_review boolean NOT NULL DEFAULT false;
ALTER TABLE seo_image_alts ADD COLUMN IF NOT EXISTS reviewed_at timestamp;
CREATE UNIQUE INDEX IF NOT EXISTS seo_image_alts_image_src_unique
  ON seo_image_alts (image_src)
  WHERE image_src IS NOT NULL;

CREATE TABLE IF NOT EXISTS seo_redirects (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL UNIQUE,
  destination text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now()
);
