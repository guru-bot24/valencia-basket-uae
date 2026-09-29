/**
 * Staff social profiles (Instagram, Facebook, TikTok). Shared by the admin
 * editor (client-side checks) and the API/pages (server). A platform with no
 * saved link simply isn't shown.
 */

export const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", hosts: ["instagram.com"], example: "https://www.instagram.com/username" },
  { id: "facebook", label: "Facebook", hosts: ["facebook.com", "fb.com"], example: "https://www.facebook.com/username" },
  { id: "tiktok", label: "TikTok", hosts: ["tiktok.com"], example: "https://www.tiktok.com/@username" },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["id"];
export type SocialLinks = Partial<Record<SocialPlatform, string>>;

export function socialContentKey(slug: string, platform: SocialPlatform) {
  return `social.${slug}.${platform}`;
}

/**
 * Normalizes a pasted profile link. Returns the https URL, "" for an empty box,
 * or an error message when it isn't a link to that platform.
 */
export function normalizeSocialUrl(platform: SocialPlatform, input: string): { url: string } | { error: string } {
  const trimmed = input.trim();
  if (!trimmed) return { url: "" };
  const spec = SOCIAL_PLATFORMS.find((candidate) => candidate.id === platform)!;
  let parsed: URL;
  try {
    parsed = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    return { error: `This should be a ${spec.label} link, e.g. ${spec.example}` };
  }
  const host = parsed.hostname.toLowerCase();
  const onPlatform = spec.hosts.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
  if (!onPlatform || parsed.pathname.replace(/\/+$/, "") === "") {
    return { error: `This should be a ${spec.label} link, e.g. ${spec.example}` };
  }
  parsed.protocol = "https:";
  return { url: parsed.toString() };
}
