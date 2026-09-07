ALTER TABLE "blog_posts" ADD COLUMN "og_title" text;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "og_description" text;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "visibility" text DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "lock_modified_date" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "trashed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_visibility_check" CHECK ("blog_posts"."visibility" IN ('public', 'private', 'password'));