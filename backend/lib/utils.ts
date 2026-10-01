import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isLegacyImagePath } from "@/lib/content/legacyImages"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev";

/** Resolves a stored image path. The original site's photos are served from
 * /images/ at their old (Google-indexed) addresses, so those stay as they are;
 * any other "/images/x" path maps to its R2 copy; full URLs pass through. */
export function resolveImageSrc(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (isLegacyImagePath(path)) return path;
  if (path.startsWith("/images/")) return `${R2_PUBLIC_URL}${path.slice("/images".length)}`;
  return path;
}

export function isPastEvent(endDate: string | null | undefined): boolean {
  if (!endDate) return false;
  // "Today" in UAE time (UTC+4, no DST) so events flip to past at midnight local time
  const today = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return endDate < today;
}
