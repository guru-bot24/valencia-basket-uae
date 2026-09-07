import { storage } from "@/lib/storage";

/**
 * Database-backed content redirects. These are additive: the host/domain and
 * legacy-path rules in next.config.ts stay exactly where they are.
 *
 * The map is cached in-process for a short window so the redirect check does
 * not hit the database on every request. Admin writes clear it immediately.
 */
const CACHE_TTL_MS = 10_000;

let cache: Map<string, string> | null = null;
let cachedAt = 0;

export function invalidateRedirectCache(): void {
  cache = null;
  cachedAt = 0;
}

export async function getRedirectMap(): Promise<Map<string, string>> {
  const now = Date.now();
  if (cache && now - cachedAt < CACHE_TTL_MS) return cache;

  try {
    const rows = await storage.getAllSeoRedirects();
    cache = new Map(
      rows.filter((row) => row.enabled).map((row) => [normalizePath(row.source), row.destination])
    );
    cachedAt = now;
  } catch (error) {
    console.error("[seo] failed to load redirects:", error);
    // Serve the previous map if we have one; otherwise redirect nothing.
    cache = cache ?? new Map();
    cachedAt = now;
  }
  return cache;
}

/** Trailing slashes are insignificant for matching; "/" is preserved. */
export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.replace(/\/+$/, "");
  return pathname;
}

export async function lookupRedirect(pathname: string): Promise<string | null> {
  const map = await getRedirectMap();
  return map.get(normalizePath(pathname)) ?? null;
}
