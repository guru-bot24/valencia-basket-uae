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
