ALTER TABLE "blog_posts" ADD COLUMN "search_vector" tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
    setweight(to_tsvector('english', coalesce("excerpt", '')), 'B') ||
    setweight(to_tsvector('english', coalesce("content", '')), 'C')
  ) STORED;
--> statement-breakpoint
CREATE INDEX "idx_blog_posts_search"
  ON "blog_posts" USING gin ("search_vector");