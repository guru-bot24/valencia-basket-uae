-- Schema-only release SQL. Overrides are deliberately not seeded.
CREATE TABLE IF NOT EXISTS seo_schema_overrides (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  schema_type text NOT NULL,
  overrides jsonb,
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamp NOT NULL DEFAULT now()
);