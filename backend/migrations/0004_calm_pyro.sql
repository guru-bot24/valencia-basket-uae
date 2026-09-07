CREATE TABLE "seo_schema_overrides" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"path" text NOT NULL,
	"schema_type" text NOT NULL,
	"overrides" jsonb,
	"enabled" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seo_schema_overrides_path_unique" UNIQUE("path")
);
