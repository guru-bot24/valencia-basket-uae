import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev";

/** Resolves a stored image path to a direct R2 URL. Legacy DB rows may still
 * hold "/images/x.jpg" paths from before the R2 migration; anything already
 * a full URL passes through unchanged. */
export function resolveImageSrc(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("/images/")) return `${R2_PUBLIC_URL}${path.slice("/images".length)}`;
  return path;
}

export function isPastEvent(endDate: string | null | undefined): boolean {
  if (!endDate) return false;
  // "Today" in UAE time (UTC+4, no DST) so events flip to past at midnight local time
  const today = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return endDate < today;
}
