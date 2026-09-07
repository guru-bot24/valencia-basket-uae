import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export function blogAccessCookieName(postId: number) {
  return `vbc_blog_access_${postId}`;
}

export function isLiveBlogPost(post: { status: string; publishedAt: Date | null; trashedAt: Date | null }) {
  return !post.trashedAt &&
    (post.status === "published" || post.status === "scheduled") &&
    !!post.publishedAt &&
    post.publishedAt <= new Date();
}

export function createBlogAccessToken(postId: number, secret: string, lifetimeSeconds = 3600) {
  const expires = Math.floor(Date.now() / 1000) + lifetimeSeconds;
  const signature = createHmac("sha256", secret).update(`${postId}:${expires}`).digest("hex");
  return `${expires}.${signature}`;
}

export function verifyBlogAccessToken(token: string | undefined, postId: number, secret: string) {
  if (!token) return false;
  const [expiresText, signature] = token.split(".");
  const expires = Number(expiresText);
  if (!Number.isSafeInteger(expires) || expires <= Math.floor(Date.now() / 1000) || !/^[a-f0-9]{64}$/.test(signature ?? "")) return false;
  const expected = createHmac("sha256", secret).update(`${postId}:${expires}`).digest("hex");
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}