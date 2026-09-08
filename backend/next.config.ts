import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ["*.replit.dev", "*.replit.app", "*.janeway.replit.dev", "127.0.0.1"],
  images: {
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
  async rewrites() {
    // Fallback only: covers any /images/* path not already migrated to a
    // direct R2 URL (e.g. legacy DB rows). Direct references bypass this.
    return {
      beforeFiles: [
        {
          source: "/images/:path*",
          destination: `${process.env.R2_PUBLIC_URL || "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev"}/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
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
