import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const projectFile = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

test("production builds do not apply database schema changes or seed data", () => {
  const buildScript = projectFile("script/build.ts");

  assert.doesNotMatch(buildScript, /drizzle-kit\s+(push|migrate)/);
  assert.doesNotMatch(buildScript, /scripts\/seed\.ts/);
  assert.match(buildScript, /next build/);
});

test("database changes use explicit release commands", () => {
  const packageJson = JSON.parse(projectFile("package.json")) as {
    scripts: Record<string, string>;
  };

  assert.equal(packageJson.scripts["db:generate"], "drizzle-kit generate");
  assert.equal(
    packageJson.scripts["db:migrate"],
    "drizzle-kit migrate && tsx scripts/run-seo-image-review-backfill.ts"
  );
  assert.equal(packageJson.scripts["db:seed"], "tsx scripts/seed.ts");
  assert.equal(packageJson.scripts["db:push"], "drizzle-kit push --strict --verbose");
});

test("image review columns and their database check are committed release steps", () => {
  const packageJson = JSON.parse(projectFile("package.json")) as {
    scripts: Record<string, string>;
  };
  const migration = projectFile("migrations/0000_add-image-description-review-columns.sql");

  assert.equal(
    packageJson.scripts["check:image-review"],
    "tsx scripts/check-image-description-review.ts"
  );
  assert.match(migration, /ADD COLUMN IF NOT EXISTS "image_src" text/);
  assert.match(migration, /ADD COLUMN IF NOT EXISTS "is_decorative" boolean NOT NULL DEFAULT false/);
  assert.match(migration, /ADD COLUMN IF NOT EXISTS "needs_review" boolean NOT NULL DEFAULT false/);
  assert.match(migration, /ADD COLUMN IF NOT EXISTS "reviewed_at" timestamp/);
  assert.match(migration, /CREATE UNIQUE INDEX IF NOT EXISTS "seo_image_alts_image_src_unique"/);
  assert.match(
    projectFile("scripts/run-seo-image-review-backfill.ts"),
    /backfillSeoImageReviews/
  );
});