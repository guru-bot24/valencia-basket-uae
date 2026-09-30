import "server-only";
import type { ImagePurpose, OptimizedImage } from "@/lib/imageOptimize";

/**
 * One-off pass that shrinks images uploaded before automatic optimisation
 * existed. Pure planning/apply logic with injected I/O, so it can be tested
 * without R2 or a real database (see scripts/optimize-existing-images.ts).
 */

export interface ImageRef {
  table: "blog_posts" | "page_content_overrides" | "staff_members";
  id: string | number;
  field: string;
  label: string;
}

export interface Candidate {
  src: string;
  purpose: ImagePurpose;
  refs: ImageRef[];
}

export interface BackfillRows {
  posts: Array<{ id: number; title: string; content: string; featuredImageSrc: string | null; ogImage: string | null }>;
  pageContent: Array<{ key: string; value: string }>;
  staff: Array<{ id: number; name: string; image: string }>;
}

export interface BackfillOptions {
  /** Host of our R2 public bucket; only images stored there (or inline data: URLs) are touched. */
  ownHost: string;
  /** Page Content keys that hold images. */
  imageContentKeys: Set<string>;
  /** Staff photos that ship with the site (left alone: their SEO alt text is tied to them). */
  defaultStaffImages: Set<string>;
}

const IMG_SRC = /<img\b[^>]*?\bsrc\s*=\s*"([^"]+)"/gi;

function isCandidateSrc(src: string | null | undefined, ownHost: string): src is string {
  if (!src) return false;
  if (/^data:image\/(?:png|jpeg|webp);base64,/i.test(src)) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === ownHost && !/\.gif$/i.test(url.pathname);
  } catch {
    return false;
  }
}

/** Every image the site uses that could be shrunk, each listed once with all the places using it. */
export function collectCandidates(rows: BackfillRows, options: BackfillOptions): Candidate[] {
  const byKey = new Map<string, Candidate>();
  const add = (src: string, purpose: ImagePurpose, ref: ImageRef) => {
    const key = `${purpose} ${src}`;
    const existing = byKey.get(key);
    if (existing) existing.refs.push(ref);
    else byKey.set(key, { src, purpose, refs: [ref] });
  };

  for (const post of rows.posts) {
    for (const match of post.content.matchAll(IMG_SRC)) {
      const src = match[1].replace(/&amp;/g, "&");
      if (isCandidateSrc(src, options.ownHost)) add(src, "content", { table: "blog_posts", id: post.id, field: "content", label: `Article "${post.title}" (inside the text)` });
    }
    if (isCandidateSrc(post.featuredImageSrc, options.ownHost)) {
      add(post.featuredImageSrc, "social", { table: "blog_posts", id: post.id, field: "featured_image_src", label: `Article "${post.title}" (featured image)` });
    }
    if (isCandidateSrc(post.ogImage, options.ownHost)) {
      add(post.ogImage, "social", { table: "blog_posts", id: post.id, field: "og_image", label: `Article "${post.title}" (social image)` });
    }
  }
  for (const row of rows.pageContent) {
    if (options.imageContentKeys.has(row.key) && isCandidateSrc(row.value, options.ownHost)) {
      add(row.value, "content", { table: "page_content_overrides", id: row.key, field: "value", label: `Page Content "${row.key}"` });
    }
  }
  for (const member of rows.staff) {
    if (!options.defaultStaffImages.has(member.image) && isCandidateSrc(member.image, options.ownHost)) {
      add(member.image, "content", { table: "staff_members", id: member.id, field: "image", label: `Staff photo of ${member.name}` });
    }
  }
  return [...byKey.values()];
}

export interface PlanItem {
  candidate: Candidate;
  beforeBytes: number;
  afterBytes: number | null;
  /** shrink: smaller copy; move: out of the database / into a preview-safe format even if not smaller. */
  action: "shrink" | "move" | "skip";
  reason: string;
  optimized?: OptimizedImage;
}

/** Only worth replacing when it saves at least 10% and 20 KB. */
const MIN_SAVING_RATIO = 0.1;
const MIN_SAVING_BYTES = 20 * 1024;

export async function planBackfill(
  candidates: Candidate[],
  deps: {
    load: (src: string) => Promise<{ body: Uint8Array; contentType: string }>;
    optimize: (body: Uint8Array, contentType: string, purpose: ImagePurpose) => Promise<OptimizedImage>;
  },
): Promise<PlanItem[]> {
  const plan: PlanItem[] = [];
  for (const candidate of candidates) {
    let loaded: { body: Uint8Array; contentType: string };
    try {
      loaded = await deps.load(candidate.src);
    } catch (error) {
      plan.push({ candidate, beforeBytes: 0, afterBytes: null, action: "skip", reason: `couldn't load it (${(error as Error).message})` });
      continue;
    }
    try {
      const optimized = await deps.optimize(loaded.body, loaded.contentType, candidate.purpose);
      const saved = loaded.body.byteLength - optimized.body.byteLength;
      const worthIt = optimized.optimized && saved >= MIN_SAVING_BYTES && saved / loaded.body.byteLength >= MIN_SAVING_RATIO;
      // Moved regardless of size: images stored inside the database (bloat every
      // page load, and link previews need a real address), and featured images
      // in a format some preview apps can't read.
      const inline = candidate.src.startsWith("data:");
      const previewUnsafe = candidate.purpose === "social" && !["image/jpeg", "image/png"].includes(loaded.contentType);
      const action = worthIt ? "shrink" : inline || previewUnsafe ? "move" : "skip";
      plan.push({
        candidate,
        beforeBytes: loaded.body.byteLength,
        afterBytes: optimized.body.byteLength,
        action,
        reason: action === "move" ? (inline ? "stored inside the database" : "format link previews may not read") : action === "skip" ? "already small enough" : "",
        optimized: action === "skip" ? undefined : optimized,
      });
    } catch (error) {
      plan.push({ candidate, beforeBytes: loaded.body.byteLength, afterBytes: null, action: "skip", reason: `couldn't process it (${(error as Error).message})` });
    }
  }
  return plan;
}

/** Replaces every use of `from` with `to` in a stored value (article HTML or a single URL). */
export function replaceImageSrc(value: string, from: string, to: string): string {
  if (value === from) return to;
  const escaped = from.replace(/&/g, "&amp;");
  return value.split(`src="${from}"`).join(`src="${to}"`).split(`src="${escaped}"`).join(`src="${to}"`);
}
