-- Blog database foundation.
-- Idempotent release SQL for environments that apply schema changes outside
-- the generated Drizzle migration workflow.

CREATE TABLE IF NOT EXISTS blog_categories (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT,
  parent_id     INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id                  SERIAL PRIMARY KEY,
  title               TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  excerpt             TEXT,
  content             TEXT NOT NULL,
  featured_image_src  TEXT,
  featured_image_alt  TEXT,
  author_name         TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at        TIMESTAMPTZ,
  is_featured         BOOLEAN NOT NULL DEFAULT false,
  view_count          INTEGER NOT NULL DEFAULT 0,
  meta_title          TEXT,
  meta_description    TEXT,
  og_image            TEXT,
  focus_keyword       TEXT,
  no_index            BOOLEAN NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_post_categories (
  post_id     INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

CREATE TABLE IF NOT EXISTS blog_tags (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id  INTEGER NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_blog_posts_live
  ON blog_posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_postcat_cat
  ON blog_post_categories (category_id);
CREATE INDEX IF NOT EXISTS idx_blog_cat_order
  ON blog_categories (display_order, name);
CREATE INDEX IF NOT EXISTS idx_blog_posts_search
  ON blog_posts USING GIN (search_vector);