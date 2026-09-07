import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/adminAuth";
import { seoImageAltSchema, type SeoImageAlt } from "@shared/schema";
import { MANAGED_IMAGE_ASSETS, getManagedImageAsset } from "@/lib/seo/images";

export const dynamic = "force-dynamic";

export function requiresExplicitConflictReviewToReset(
  altText: string | null,
  isDecorative: boolean,
  existing?: Pick<SeoImageAlt, "needsReview">
) {
  return altText === null && !isDecorative && existing?.needsReview === true;
}

export function getImageAltConflictReviews(rows: SeoImageAlt[]) {
  const overrides = new Map(
    rows
      .filter((row): row is SeoImageAlt & { imageSrc: string } => !!row.imageSrc)
      .map((row) => [row.imageSrc, row])
  );
  const legacyRows = new Map(
    rows
      .filter((row) => !row.imageSrc)
      .map((row) => [row.imageKey, row])
  );

  return MANAGED_IMAGE_ASSETS.flatMap((asset) => {
    const override = overrides.get(asset.src);
    if (!override?.needsReview) return [];

    return [{
      src: asset.src,
      sharedDescription: override.isDecorative
        ? ""
        : override.altText?.trim() || asset.defaultAlt,
      previousValues: asset.placements.flatMap((placement) => {
        const legacy = legacyRows.get(placement.key);
        const description = legacy?.altText?.trim();
        return description
          ? [{
              key: placement.key,
              page: placement.page,
              description,
              updatedAt: legacy!.updatedAt,
            }]
          : [];
      }),
    }];
  });
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const [rows, events] = await Promise.all([
      storage.getAllSeoImageAlts(),
      storage.getAllEvents(),
    ]);
    const overrides = new Map(
      rows
        .filter((row): row is typeof row & { imageSrc: string } => !!row.imageSrc)
        .map((row) => [row.imageSrc, row])
    );

    return NextResponse.json(
      {
        assets: MANAGED_IMAGE_ASSETS.map((asset) => {
          const override = overrides.get(asset.src);
          return {
            src: asset.src,
            defaultAlt: asset.defaultAlt,
            override: override?.altText ?? null,
            isDecorative: override?.isDecorative ?? false,
            resolved: override?.isDecorative
              ? ""
              : override?.altText?.trim() || asset.defaultAlt,
            placements: asset.placements.map(({ key, page }) => ({ key, page })),
          };
        }),
        conflicts: getImageAltConflictReviews(rows),
        eventImages: events.map((event) => ({
            id: event.id,
            title: event.title,
            slug: event.slug,
            src: event.image?.trim() || "/images/mini-basket-team.jpg",
            usesFallbackImage: !event.image?.trim(),
            altText: event.imageAlt?.trim() || null,
            fallbackAlt: event.title,
            placements: [
              "Homepage featured event card",
              "Events listing",
              "Event detail page",
            ],
          })),
      }
    );
  } catch (error) {
    console.error("[seo] failed to list image alts:", error);
    return NextResponse.json({ error: "Failed to load image alt text" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { imageSrc, altText, isDecorative } = seoImageAltSchema.parse(body);
    const reviewConflict = body.reviewConflict === true;
    const asset = getManagedImageAsset(imageSrc);
    if (!asset) {
      return NextResponse.json({ error: "Unknown managed image file" }, { status: 400 });
    }

    // A blank non-decorative value restores the file's shared built-in
    // description. Decorative images retain an explicit blank alt attribute.
    if (reviewConflict) {
      await storage.resolveSeoImageAltConflict(imageSrc, altText, isDecorative);
    } else if (altText === null && !isDecorative) {
      const existing = await storage.getSeoImageAltFile(imageSrc);
      if (requiresExplicitConflictReviewToReset(altText, isDecorative, existing)) {
        return NextResponse.json(
          {
            error:
              "This description has conflicting migration values. Confirm the built-in description from the review section instead.",
          },
          { status: 409 }
        );
      }
      await storage.deleteSeoImageAltFile(imageSrc);
    } else {
      await storage.upsertSeoImageAltFile(imageSrc, altText, isDecorative);
    }
    try {
      revalidatePath("/", "layout");
    } catch (revalidationError) {
      // The database mutation has already succeeded. Keep the administrator's
      // response accurate if cache invalidation is temporarily unavailable.
      const missingTestContext =
        revalidationError instanceof Error &&
        revalidationError.message.includes("static generation store missing");
      if (!missingTestContext) {
        console.error("[seo] failed to revalidate image alt text:", revalidationError);
      }
    }
    return NextResponse.json({
      success: true,
      reviewed: reviewConflict,
      affectedPlacements: asset.placements.length,
      affectedPages: new Set(asset.placements.map((placement) => placement.page)).size,
    });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: "Invalid alt text", details: error.errors }, { status: 400 });
    }
    console.error("[seo] failed to save image alt:", error);
    return NextResponse.json({ error: "Failed to save image alt text" }, { status: 500 });
  }
}
