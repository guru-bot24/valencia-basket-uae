import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { CalendarDays } from "lucide-react";
import { BreadcrumbJsonLd, StructuredData } from "@/components/seo/StructuredData";
import { storage } from "@/lib/storage";
import { blogPlainText, sanitizeBlogContent } from "@/lib/blog";
import { blogAccessCookieName, isLiveBlogPost, verifyBlogAccessToken } from "@/lib/blogAccess";
import { PasswordForm } from "./PasswordForm";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  return storage.getBlogPostBySlug(slug, true);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post || post.visibility === "private" || !isLiveBlogPost(post)) return { title: "Article Not Found | Valencia Basket Academy UAE" };
  if (post.visibility === "password") {
    return {
      title: `${post.title} | Valencia Basket Academy UAE`,
      description: "This article is password protected.",
      robots: { index: false, follow: false },
    };
  }
  const description = post.metaDescription || post.excerpt || blogPlainText(post.content).slice(0, 160);
  return {
    title: post.metaTitle || `${post.title} | Valencia Basket Academy UAE`,
    description,
    robots: post.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: post.ogTitle || post.metaTitle || post.title,
      description: post.ogDescription || description,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.authorName],
      images: post.ogImage || post.featuredImageSrc ? [{ url: post.ogImage || post.featuredImageSrc! }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post || post.visibility === "private" || !isLiveBlogPost(post)) notFound();
  if (post.visibility === "password") {
    const secret = process.env.SESSION_SECRET;
    const token = (await cookies()).get(blogAccessCookieName(post.id))?.value;
    if (!secret || !verifyBlogAccessToken(token, post.id, secret)) {
      return (
        <section className="bg-gray-50 py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <PasswordForm slug={post.slug} />
          </div>
        </section>
      );
    }
  }
  const safeContent = sanitizeBlogContent(post.content);
  const hasRichContent = /<[a-z][\s\S]*>/i.test(safeContent);

  const articleJson = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || blogPlainText(post.content).slice(0, 160),
    author: { "@type": "Person", name: post.authorName },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: post.featuredImageSrc || undefined,
    mainEntityOfPage: `https://valenciabasket.ae/blog/${post.slug}`,
  };

  return (
    <>
      <BreadcrumbJsonLd path={`/blog/${post.slug}`} label={post.title} />
      <StructuredData data={[articleJson]} />
      <article>
        <header className="bg-black py-20 text-white md:py-28">
          <div className="container mx-auto max-w-4xl px-4 md:px-6">
            <div className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
              <CalendarDays className="h-4 w-4" />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-AE", { year: "numeric", month: "long", day: "numeric" }) : ""}
            </div>
            <h1 className="text-4xl font-black uppercase leading-tight tracking-tight md:text-6xl">{post.title}</h1>
            {post.excerpt && <p className="mt-6 max-w-3xl text-xl leading-relaxed text-gray-400">{post.excerpt}</p>}
            <p className="mt-6 text-sm font-bold uppercase tracking-wider text-gray-400">By {post.authorName}</p>
          </div>
        </header>
        <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-20">
          {post.featuredImageSrc && <img src={post.featuredImageSrc} alt={post.featuredImageAlt ?? post.title} className="mb-12 max-h-[32rem] w-full rounded object-cover" />}
          {hasRichContent ? (
            <div className="prose max-w-none text-lg leading-8 text-gray-700" dangerouslySetInnerHTML={{ __html: safeContent }} />
          ) : (
            <div className="whitespace-pre-line text-lg leading-8 text-gray-700">{safeContent}</div>
          )}
        </div>
      </article>
    </>
  );
}