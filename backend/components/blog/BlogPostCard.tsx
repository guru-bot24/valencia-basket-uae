import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { BlogPostWithTaxonomy } from "@/lib/storage";
import { blogPlainText } from "@/lib/blog";

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

export function BlogPostCard({ post }: { post: BlogPostWithTaxonomy }) {
  return (
    <article className="group overflow-hidden border border-gray-200 bg-white" data-testid={`card-blog-post-${post.id}`}>
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
  );
}
