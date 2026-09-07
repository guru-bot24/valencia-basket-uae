ALTER TABLE "blog_password_attempts" ADD COLUMN "client_key" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "blog_password_attempts" DROP CONSTRAINT "blog_password_attempts_pkey";--> statement-breakpoint
ALTER TABLE "blog_password_attempts" ADD CONSTRAINT "blog_password_attempts_post_id_client_key_pk" PRIMARY KEY("post_id","client_key");--> statement-breakpoint
ALTER TABLE "blog_password_attempts" ALTER COLUMN "client_key" DROP DEFAULT;