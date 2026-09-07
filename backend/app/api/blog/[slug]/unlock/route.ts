import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { storage } from "@/lib/storage";
import { blogAccessCookieName, createBlogAccessToken, isLiveBlogPost } from "@/lib/blogAccess";
import { createHmac } from "node:crypto";

export const dynamic = "force-dynamic";
const inputSchema = z.object({ password: z.string().min(8).max(120) });

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const post = await storage.getBlogPostBySlug(slug, true);
  if (!post || post.visibility !== "password" || !post.passwordHash || !isLiveBlogPost(post)) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret) return NextResponse.json({ error: "Password access is unavailable" }, { status: 500 });
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unavailable";
  const clientKey = createHmac("sha256", secret).update(clientIp).digest("hex");
  const limit = await storage.consumeBlogPasswordAttempt(post.id, clientKey, 5, 15);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, {
      status: 429,
      headers: { "retry-after": String(limit.retryAfterSeconds) },
    });
  }

  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !(await bcrypt.compare(parsed.data.password, post.passwordHash))) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  await storage.clearBlogPasswordAttempts(post.id, clientKey);
  const response = NextResponse.json({ success: true });
  response.cookies.set(blogAccessCookieName(post.id), createBlogAccessToken(post.id, secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600,
    path: `/blog/${post.slug}`,
  });
  return response;
}