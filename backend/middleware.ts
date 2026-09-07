import { NextRequest, NextResponse } from "next/server";
import { lookupRedirect } from "@/lib/seo/redirects";

/**
 * Applies the admin-managed 301 content redirects. Host-level and legacy-domain
 * redirects continue to be handled by next.config.ts and run before this.
 */
export async function middleware(request: NextRequest) {
  const destination = await lookupRedirect(request.nextUrl.pathname);
  if (!destination) return NextResponse.next();

  const target = destination.startsWith("http")
    ? new URL(destination)
    : new URL(destination + request.nextUrl.search, request.nextUrl.origin);

  return NextResponse.redirect(target, 301);
}

export const config = {
  runtime: "nodejs",
  matcher: [
    // Everything except API routes, admin, Next internals and static files.
    "/((?!api|admin|_next/static|_next/image|images|favicon|apple-touch-icon|sitemap.xml|robots.txt).*)",
  ],
};
