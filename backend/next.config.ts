import type { NextConfig } from "next";
import { LEGACY_IMAGES } from "./lib/content/legacyImages";

// /images/<anything except the restored originals>, as a path-to-regexp pattern.
const NOT_LEGACY_IMAGE = `:path((?!(?:${LEGACY_IMAGES.map((name) => name.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")).join("|")})$).+)`;

const nextConfig: NextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ["*.replit.dev", "*.replit.app", "*.janeway.replit.dev", "127.0.0.1"],
  images: {
    contentDispositionType: "inline",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev",
      },
    ],
  },
  async redirects() {
    return [
      // www → non-www (primary canonical domain)
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.valenciabasket.ae",
          },
        ],
        destination: "https://valenciabasket.ae/:path*",
        statusCode: 301,
      },
      // Railway's own addresses (e.g. web-production-xxxx.up.railway.app) → the real domain,
      // so the site is only ever reached at valenciabasket.ae. Cloudflare forwards the
      // original Host (valenciabasket.ae), so this never matches real visitors.
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "(?<railwayHost>.+)\\.up\\.railway\\.app",
          },
        ],
        destination: "https://valenciabasket.ae/:path*",
        statusCode: 301,
      },
      // Legacy domain redirects
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "valenciabasketuae.com",
          },
        ],
        destination: "https://valenciabasket.ae/:path*",
        statusCode: 301,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.valenciabasketuae.com",
          },
        ],
        destination: "https://valenciabasket.ae/:path*",
        statusCode: 301,
      },
      // The original photos are served from public/images/ at their old addresses
      // (see lib/content/legacyImages.ts). Any OTHER /images/* path → its R2 copy.
      // A redirect, not a rewrite: proxying to r2.dev forwarded Host: valenciabasket.ae,
      // which Cloudflare rejects as a loop (error 1000, "DNS points to prohibited IP").
      {
        source: `/images/${NOT_LEGACY_IMAGE}`,
        destination: `${process.env.R2_PUBLIC_URL || "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev"}/:path*`,
        statusCode: 301,
      },
      {
        source: "/book-trial",
        destination: "/#book-trial",
        permanent: true,
      },
      {
        source: "/parents",
        destination: "/",
        permanent: true,
      },
      {
        source: "/teams",
        destination: "/programs",
        statusCode: 301,
      },
      {
        source: "/teams/:path*",
        destination: "/programs",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
