import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import pg from "pg";

const projectFile = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

test("blog schema and migrations preserve the approved database foundation", () => {
  const schema = projectFile("shared/schema.ts");
  const tablesMigration = projectFile("migrations/0001_gorgeous_mach_iv.sql");
  const searchMigration = projectFile("migrations/0002_blog_search_vector.sql");
  const cleanupScript = projectFile("scripts/sql/blog-cleanup.sql");
  const seed = projectFile("scripts/seed.ts");

  for (const table of [
    "blog_categories",
    "blog_posts",
    "blog_post_categories",
    "blog_tags",
    "blog_post_tags",
  ]) {
    assert.match(tablesMigration, new RegExp(`CREATE TABLE "${table}"`));
  }

  assert.match(tablesMigration, /idx_blog_posts_live[\s\S]*"published_at" DESC/);
  assert.match(tablesMigration, /idx_blog_postcat_cat/);
  assert.match(tablesMigration, /idx_blog_cat_order/);
  assert.doesNotMatch(tablesMigration, /"search_vector" text/);

  assert.match(searchMigration, /"search_vector" tsvector/);
  assert.match(searchMigration, /GENERATED ALWAYS AS/);
  assert.match(searchMigration, /to_tsvector\('english'/);
  assert.match(searchMigration, /setweight[\s\S]*'A'/);
  assert.match(searchMigration, /setweight[\s\S]*'B'/);
  assert.match(searchMigration, /setweight[\s\S]*'C'/);
  assert.match(searchMigration, /STORED/);
  assert.match(searchMigration, /idx_blog_posts_search[\s\S]*USING gin/);

  assert.match(schema, /insertBlogPostSchema[\s\S]*searchVector:\s*true/);
  assert.doesNotMatch(seed, /blogCategories|blogPosts|blogTags|blogPostCategories|blogPostTags/);
  assert.match(
    cleanupScript,
    /DELETE FROM blog_post_tags;[\s\S]*DELETE FROM blog_post_categories;[\s\S]*DELETE FROM blog_tags;[\s\S]*DELETE FROM blog_posts;[\s\S]*DELETE FROM blog_categories;/
  );
});

test("migrations are schema-only and the cleanup stays manual", () => {
  const migrationFiles = [
    "migrations/0000_add-image-description-review-columns.sql",
    "migrations/0001_gorgeous_mach_iv.sql",
    "migrations/0002_blog_search_vector.sql",
  ];
  for (const file of migrationFiles) {
    assert.doesNotMatch(
      projectFile(file),
      /^\s*(?:DELETE|TRUNCATE)\b/im,
      `${file} must not contain data cleanup`
    );
  }
  assert.match(
    projectFile("scripts/sql/blog-cleanup.sql"),
    /MANUAL CLEANUP ONLY[\s\S]*DELETE FROM blog_post_tags/
  );
  assert.doesNotMatch(
    projectFile("migrations/meta/_journal.json"),
    /0003_remove_blog_seed_data|blog-cleanup/
  );
});

test("blog query foundations work with transactional fixtures and leave no data behind", async () => {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const tableCounts = async () => {
    const result = await client.query<{
      categories: number;
      posts: number;
      tags: number;
      categoryLinks: number;
      tagLinks: number;
    }>(`
      SELECT
        (SELECT count(*)::int FROM blog_categories) AS categories,
        (SELECT count(*)::int FROM blog_posts) AS posts,
        (SELECT count(*)::int FROM blog_tags) AS tags,
        (SELECT count(*)::int FROM blog_post_categories) AS "categoryLinks",
        (SELECT count(*)::int FROM blog_post_tags) AS "tagLinks"
    `);
    return result.rows[0];
  };

  const baseline = await tableCounts();
  let testFailure: unknown;
  await client.query("BEGIN");

  try {
    const categoryResult = await client.query<{ id: number; slug: string }>(`
      INSERT INTO blog_categories (name, slug, display_order)
      VALUES
        ('Fixture Development', 'fixture-development', 1),
        ('Fixture Tactics', 'fixture-tactics', 2)
      RETURNING id, slug
    `);
    const categoryIds = new Map(categoryResult.rows.map((row) => [row.slug, row.id]));

    const fixtures = [
      {
        title: "Fixture Live One",
        slug: "fixture-live-one",
        content: "Decision making and transition spacing for young guards.",
        status: "published",
        publishedAt: new Date(Date.now() - 1 * 86_400_000),
        featured: true,
      },
      {
        title: "Fixture Live Two",
        slug: "fixture-live-two",
        content: "Passing angles and shared category ranking.",
        status: "published",
        publishedAt: new Date(Date.now() - 2 * 86_400_000),
        featured: true,
      },
      {
        title: "Fixture Live Three",
        slug: "fixture-live-three",
        content: "A searchable pick and roll development session.",
        status: "published",
        publishedAt: new Date(Date.now() - 3 * 86_400_000),
        featured: true,
      },
      {
        title: "Fixture Live Four",
        slug: "fixture-live-four",
        content: "Finishing practice for youth basketball.",
        status: "published",
        publishedAt: new Date(Date.now() - 4 * 86_400_000),
        featured: true,
      },
      {
        title: "Fixture Live Five",
        slug: "fixture-live-five",
        content: "Defensive footwork and communication.",
        status: "published",
        publishedAt: new Date(Date.now() - 5 * 86_400_000),
        featured: false,
      },
      {
        title: "Fixture Live Six",
        slug: "fixture-live-six",
        content: "Rebounding habits and team responsibility.",
        status: "published",
        publishedAt: new Date(Date.now() - 6 * 86_400_000),
        featured: false,
      },
      {
        title: "Fixture Draft One",
        slug: "fixture-draft-one",
        content: "Unpublished draft content.",
        status: "draft",
        publishedAt: null,
        featured: false,
      },
      {
        title: "Fixture Draft Two",
        slug: "fixture-draft-two",
        content: "Another unpublished draft.",
        status: "draft",
        publishedAt: null,
        featured: false,
      },
      {
        title: "Fixture Scheduled Future",
        slug: "fixture-scheduled-future",
        content: "Scheduled content must stay hidden until its date.",
        status: "scheduled",
        publishedAt: new Date(Date.now() + 7 * 86_400_000),
        featured: false,
      },
    ] as const;

    const postIds = new Map<string, number>();
    for (const fixture of fixtures) {
      const result = await client.query<{ id: number }>(
        `
          INSERT INTO blog_posts (
            title, slug, content, author_name, status, published_at, is_featured
          )
          VALUES ($1, $2, $3, 'Fixture Author', $4, $5, $6)
          RETURNING id
        `,
        [
          fixture.title,
          fixture.slug,
          fixture.content,
          fixture.status,
          fixture.publishedAt,
          fixture.featured,
        ]
      );
      postIds.set(fixture.slug, result.rows[0].id);
    }

    const developmentCategoryId = categoryIds.get("fixture-development")!;
    const tacticsCategoryId = categoryIds.get("fixture-tactics")!;
    for (let index = 1; index <= 6; index += 1) {
      await client.query(
        "INSERT INTO blog_post_categories (post_id, category_id) VALUES ($1, $2)",
        [postIds.get(`fixture-live-${["one", "two", "three", "four", "five", "six"][index - 1]}`), developmentCategoryId]
      );
    }
    for (const slug of ["fixture-live-one", "fixture-live-two"]) {
      await client.query(
        "INSERT INTO blog_post_categories (post_id, category_id) VALUES ($1, $2)",
        [postIds.get(slug), tacticsCategoryId]
      );
    }

    const tagResult = await client.query<{ id: number }>(
      "INSERT INTO blog_tags (name, slug) VALUES ('Fixture Skills', 'fixture-skills') RETURNING id"
    );
    await client.query(
      "INSERT INTO blog_post_tags (post_id, tag_id) VALUES ($1, $2)",
      [postIds.get("fixture-live-one"), tagResult.rows[0].id]
    );

    const categoryWindow = await client.query<{ slug: string; rn: string }>(
      `
        WITH ranked AS (
          SELECT
            posts.slug,
            row_number() OVER (
              PARTITION BY post_categories.category_id
              ORDER BY posts.published_at DESC
            ) AS rn
          FROM blog_posts AS posts
          INNER JOIN blog_post_categories AS post_categories
            ON post_categories.post_id = posts.id
          WHERE post_categories.category_id = $1
            AND posts.published_at <= now()
        )
        SELECT slug, rn
        FROM ranked
        WHERE rn <= 4
        ORDER BY rn
      `,
      [developmentCategoryId]
    );
    assert.deepEqual(
      categoryWindow.rows.map((row) => row.slug),
      ["fixture-live-one", "fixture-live-two", "fixture-live-three", "fixture-live-four"]
    );

    const featured = await client.query<{ count: number }>(`
      SELECT count(*)::int AS count
      FROM blog_posts
      WHERE is_featured = true
        AND published_at <= now()
    `);
    assert.equal(featured.rows[0].count, 4);

    const related = await client.query<{ slug: string; sharedCategories: number }>(
      `
        SELECT
          candidate.slug,
          count(*)::int AS "sharedCategories"
        FROM blog_post_categories AS source_categories
        INNER JOIN blog_post_categories AS candidate_categories
          ON candidate_categories.category_id = source_categories.category_id
         AND candidate_categories.post_id <> source_categories.post_id
        INNER JOIN blog_posts AS candidate
          ON candidate.id = candidate_categories.post_id
        WHERE source_categories.post_id = $1
          AND candidate.published_at <= now()
        GROUP BY candidate.id, candidate.slug
        ORDER BY "sharedCategories" DESC, candidate.published_at DESC
      `,
      [postIds.get("fixture-live-one")]
    );
    assert.equal(related.rows[0].slug, "fixture-live-two");
    assert.equal(related.rows[0].sharedCategories, 2);
    assert.equal(
      related.rows.find((row) => row.slug === "fixture-live-three")?.sharedCategories,
      1
    );

    const livePosts = await client.query<{ slug: string }>(`
      SELECT slug
      FROM blog_posts
      WHERE published_at <= now()
      ORDER BY slug
    `);
    assert.deepEqual(
      livePosts.rows.map((row) => row.slug),
      [
        "fixture-live-five",
        "fixture-live-four",
        "fixture-live-one",
        "fixture-live-six",
        "fixture-live-three",
        "fixture-live-two",
      ]
    );

    const search = await client.query<{ slug: string }>(
      `
        SELECT slug
        FROM blog_posts
        WHERE search_vector @@ plainto_tsquery('english', $1)
      `,
      ["pick roll"]
    );
    assert.deepEqual(search.rows, [{ slug: "fixture-live-three" }]);
  } catch (error) {
    testFailure = error;
  } finally {
    await client.query("ROLLBACK");
  }

  try {
    assert.deepEqual(
      await tableCounts(),
      baseline,
      "transactional blog fixtures must leave every blog table unchanged"
    );
  } finally {
    await client.end();
  }

  if (testFailure) throw testFailure;
});