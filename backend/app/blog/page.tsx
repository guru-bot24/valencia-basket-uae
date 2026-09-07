import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CalendarDays } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo/resolve";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import { storage, type BlogPostWithTaxonomy } from "@/lib/storage";
import { blogPlainText } from "@/lib/blog";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/blog");
}

function postSummary(post: BlogPostWithTaxonomy) {
  if (post.visibility === "password") return "This article is password protected.";
  const content = blogPlainText(post.content);
  return post.excerpt || `${content.slice(0, 180).trim()}${content.length > 180 ? "…" : ""}`;
}

function postDate(post: BlogPostWithTaxonomy) {
  return post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-AE", { year: "numeric", month: "long", day: "numeric" })
    : "Coming soon";
}

export default async function BlogPage() {
  const posts = await storage.getPublishedBlogPosts().catch((error) => {
    console.error("[blog] failed to load public posts:", error);
    return [];
  });

  return (
    <>
      <BreadcrumbJsonLd path="/blog" label="Blog" />
      <section className="bg-black text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm mb-5">
              <BookOpen className="h-4 w-4" />
              From the Academy
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95] mb-7">
              The Valencia Basket UAE Blog
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl leading-relaxed">
              Practical basketball insight, academy stories, and guidance for
              players and families in Dubai.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          {posts.length === 0 ? (
            <div className="mx-auto max-w-3xl border-l-4 border-primary bg-gray-50 p-8 md:p-12">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">No published articles</p>
              <h2 className="mb-5 text-3xl font-black uppercase tracking-tight">Stories from the court are on the way</h2>
              <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
                Approved articles will appear here once they are published by the academy team.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="group overflow-hidden border border-gray-200 bg-white" data-testid={`card-blog-post-${post.id}`}>
                  {post.featuredImageSrc && (
                    <img src={post.featuredImageSrc} alt={post.featuredImageAlt ?? post.title} className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      <CalendarDays className="h-4 w-4" /> {postDate(post)}
                      {post.isFeatured && <span className="text-gray-400">• Featured</span>}
                    </div>
                    <h2 className="mb-3 text-2xl font-black uppercase leading-tight">{post.title}</h2>
                    <p className="mb-5 text-gray-600">{postSummary(post)}</p>
                    <Link href={`/blog/${post.slug}`} className="font-bold uppercase tracking-wider text-primary hover:underline">Read article →</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}