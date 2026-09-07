#!/bin/bash
set -e

echo "==> Installing dependencies"
npm install

echo "==> Applying SEO Manager schema"
npx tsx scripts/apply-seo-schema.ts

echo "==> Building Next.js app"
npx next build

echo "==> Post-merge setup complete"
