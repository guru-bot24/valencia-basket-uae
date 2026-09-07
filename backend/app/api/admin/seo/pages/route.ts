import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/adminAuth";
import { seoPageOverrideSchema } from "@shared/schema";
import { getEditablePage, getEditablePages } from "@/lib/seo/adminPages";
import type { PageSeoDefaults } from "@/lib/seo/registry";
import { mergeSeo } from "@/lib/seo/resolve";

export const dynamic = "force-dynamic";

export function hasSeoPageOverride(values: {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  noIndex: boolean | null;
  noFollow: boolean | null;
  focusKeyword: string | null;
}) {
  return [
    values.metaTitle,
    values.metaDescription,
    values.canonicalUrl,
    values.ogTitle,
    values.ogDescription,
    values.ogImage,
    values.noIndex,
    values.noFollow,
    values.focusKeyword,
  ].some((value) => value !== null);
}

/**
 * The admin shows inherited values directly in form controls so they can be
 * copied and edited. Convert unchanged built-in values back to null before
 * persisting them, preserving the additive override model for every caller.
 */
export function normalizeSeoPageOverride(
  values: {
    path: string;
    metaTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    noIndex: boolean | null;
    noFollow: boolean | null;
    focusKeyword: string | null;
  },
  defaults: PageSeoDefaults
) {
  const inheritedText = (value: string | null, builtIn: string) =>
    value?.trim() === builtIn.trim() ? null : value;
  const defaultOgTitle = defaults.ogTitle ?? defaults.title;
  const defaultOgDescription = defaults.ogDescription ?? defaults.description;

  return {
    ...values,
    metaTitle: inheritedText(values.metaTitle, defaults.title),
    metaDescription: inheritedText(values.metaDescription, defaults.description),
    canonicalUrl: inheritedText(values.canonicalUrl, defaults.canonical),
    ogTitle: inheritedText(values.ogTitle, defaultOgTitle),
    ogDescription: inheritedText(values.ogDescription, defaultOgDescription),
    noIndex:
      values.noIndex === (defaults.noIndex ?? false) ? null : values.noIndex,
    noFollow:
      values.noFollow === (defaults.noFollow ?? false) ? null : values.noFollow,
  };
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const [pages, overrideRows] = await Promise.all([
      getEditablePages(),
      storage.getAllSeoPages(),
    ]);
    const overrides = new Map(overrideRows.map((row) => [row.path, row]));

    return NextResponse.json(
      pages.map((defaults) => {
        const override = overrides.get(defaults.path);
        return {
          path: defaults.path,
          label: defaults.label,
          group: defaults.group,
          defaults: {
            title: defaults.title,
            description: defaults.description,
            canonical: defaults.canonical,
            ogTitle: defaults.ogTitle ?? defaults.title,
            ogDescription: defaults.ogDescription ?? defaults.description,
            noIndex: defaults.noIndex ?? false,
            noFollow: defaults.noFollow ?? false,
          },
          override: override
            ? {
                metaTitle: override.metaTitle,
                metaDescription: override.metaDescription,
                canonicalUrl: override.canonicalUrl,
                ogTitle: override.ogTitle,
                ogDescription: override.ogDescription,
                ogImage: override.ogImage,
                noIndex: override.noIndex,
                noFollow: override.noFollow,
                focusKeyword: override.focusKeyword,
                updatedAt: override.updatedAt,
              }
            : null,
          resolved: mergeSeo(defaults, override),
        };
      })
    );
  } catch (error) {
    console.error("[seo] failed to list pages:", error);
    return NextResponse.json({ error: "Failed to load SEO pages" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const parsed = seoPageOverrideSchema.parse(await request.json());

    const page = await getEditablePage(parsed.path);
    if (!page) {
      return NextResponse.json({ error: "Unknown page path" }, { status: 400 });
    }

    const normalized = normalizeSeoPageOverride(parsed, page);
    if (!hasSeoPageOverride(normalized)) {
      await storage.deleteSeoPage(parsed.path);
      revalidatePath(parsed.path);
      return NextResponse.json({ success: true, reset: true });
    }

    const saved = await storage.upsertSeoPage(normalized);
    revalidatePath(parsed.path);
    return NextResponse.json(saved);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: "Invalid SEO data", details: error.errors }, { status: 400 });
    }
    console.error("[seo] failed to save page override:", error);
    return NextResponse.json({ error: "Failed to save SEO overrides" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { path } = await request.json();
    if (typeof path !== "string" || !path.startsWith("/")) {
      return NextResponse.json({ error: "A page path is required" }, { status: 400 });
    }
    await storage.deleteSeoPage(path);
    revalidatePath(path);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[seo] failed to reset page override:", error);
    return NextResponse.json({ error: "Failed to reset SEO overrides" }, { status: 500 });
  }
}
