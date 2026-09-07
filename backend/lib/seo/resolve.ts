import "server-only";
import { cache } from "react";
import type { Metadata } from "next";
import { storage } from "@/lib/storage";
import type { SeoPage } from "@shared/schema";
import { getPageDefaults, type PageSeoDefaults } from "./registry";
import { getManagedImageAssetForKey } from "./images";

/**
 * Loads every stored SEO override once per request. Route handlers and page
 * renders run in separate bundles with separate module state, so anything
 * longer-lived than a request would leave the admin looking at stale metadata
 * after a save. Failures are swallowed on purpose: if the database is
 * unreachable the site must still render with its code-defined metadata.
 */
export const getSeoOverrides = cache(async (): Promise<Map<string, SeoPage>> => {
  try {
    const rows = await storage.getAllSeoPages();
    return new Map(rows.map((row) => [row.path, row]));
  } catch (error) {
    console.error("[seo] failed to load page overrides:", error);
    return new Map();
  }
});

export const getImageAltOverrides = cache(
  async (): Promise<Map<string, { altText: string | null; isDecorative: boolean }>> => {
  try {
    const rows = await storage.getAllSeoImageAltFiles();
    return new Map(
      rows
        .filter((row): row is typeof row & { imageSrc: string } => !!row.imageSrc)
        .map((row) => [
          row.imageSrc,
          { altText: row.altText?.trim() || null, isDecorative: row.isDecorative },
        ])
    );
  } catch (error) {
    console.error("[seo] failed to load image alt overrides:", error);
    return new Map();
  }
  }
);

const blankToNull = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string | null;
  noIndex: boolean;
  noFollow: boolean;
  focusKeyword: string | null;
}

export function mergeSeo(defaults: PageSeoDefaults, override?: SeoPage): ResolvedSeo {
  const title = blankToNull(override?.metaTitle) ?? defaults.title;
  const description = blankToNull(override?.metaDescription) ?? defaults.description;
  return {
    title,
    description,
    canonical: blankToNull(override?.canonicalUrl) ?? defaults.canonical,
    ogTitle: blankToNull(override?.ogTitle) ?? defaults.ogTitle ?? title,
    ogDescription:
      blankToNull(override?.ogDescription) ?? defaults.ogDescription ?? description,
    ogImage: blankToNull(override?.ogImage),
    noIndex: override?.noIndex ?? defaults.noIndex ?? false,
    noFollow: override?.noFollow ?? defaults.noFollow ?? false,
    focusKeyword: blankToNull(override?.focusKeyword),
  };
}

export function toMetadata(resolved: ResolvedSeo): Metadata {
  return {
    title: { absolute: resolved.title },
    description: resolved.description,
    alternates: { canonical: resolved.canonical },
    openGraph: {
      title: resolved.ogTitle,
      description: resolved.ogDescription,
      ...(resolved.ogImage ? { images: [{ url: resolved.ogImage }] } : {}),
    },
    ...(resolved.noIndex || resolved.noFollow
      ? { robots: { index: !resolved.noIndex, follow: !resolved.noFollow } }
      : {}),
  };
}

/** Resolve metadata for a registered static page. */
export async function buildPageMetadata(path: string): Promise<Metadata> {
  const defaults = getPageDefaults(path);
  if (!defaults) {
    throw new Error(`[seo] no defaults registered for path "${path}"`);
  }
  const overrides = await getSeoOverrides();
  return toMetadata(mergeSeo(defaults, overrides.get(path)));
}

/** Resolve metadata for a dynamic page whose defaults are computed at runtime. */
export async function buildDynamicMetadata(defaults: PageSeoDefaults): Promise<Metadata> {
  const overrides = await getSeoOverrides();
  return toMetadata(mergeSeo(defaults, overrides.get(defaults.path)));
}

/**
 * Returns a lookup for managed image alt text. Unset keys fall back to the
 * code-defined alt in the managed-image registry.
 */
export async function getAltResolver(): Promise<(imageKey: string) => string> {
  const overrides = await getImageAltOverrides();
  return (imageKey: string) => {
    const asset = getManagedImageAssetForKey(imageKey);
    if (!asset) return "";
    const override = overrides.get(asset.src);
    if (override?.isDecorative) return "";
    return override?.altText ?? asset.defaultAlt;
  };
}
