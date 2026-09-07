-- MANUAL CLEANUP ONLY — never add this file to the Drizzle migration journal.
-- Removes the temporary blog fixtures that were previously inserted in
-- development. Review the target environment before running.

DELETE FROM blog_post_tags;
DELETE FROM blog_post_categories;
DELETE FROM blog_tags;
DELETE FROM blog_posts;
DELETE FROM blog_categories;