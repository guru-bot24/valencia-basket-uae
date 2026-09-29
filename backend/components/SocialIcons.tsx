import { SOCIAL_PLATFORMS, type SocialLinks, type SocialPlatform } from "@/lib/content/socialLinks";

// Simplified brand glyphs (lucide-react has no TikTok icon).
const ICON_PATHS: Record<SocialPlatform, string> = {
  instagram:
    "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2M12 0C8.7 0 8.3 0 7.1.1 5.8.1 4.9.3 4.1.6c-.8.3-1.5.7-2.1 1.4C1.3 2.6.9 3.3.6 4.1.3 4.9.1 5.8.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.1 1.3.3 2.2.6 2.9.3.8.7 1.5 1.4 2.1.7.7 1.3 1.1 2.1 1.4.8.3 1.6.5 2.9.6 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.3-.1 2.2-.3 2.9-.6.8-.3 1.5-.7 2.1-1.4.7-.7 1.1-1.3 1.4-2.1.3-.8.5-1.6.6-2.9.1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.3-.3-2.2-.6-2.9-.3-.8-.7-1.5-1.4-2.1C21.4 1.3 20.7.9 19.9.6 19.1.3 18.2.1 16.9.1 15.7 0 15.3 0 12 0Zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9Z",
  facebook:
    "M9.1 23.7v-8H6.6V12h2.5v-1.6c0-4.1 1.8-6 5.9-6 .4 0 1 0 1.5.1.4 0 .8.1 1.1.2v3.3h-.7c-.2 0-.5 0-.7 0-.7 0-1.3.1-1.7.3-.3.1-.5.4-.7.6-.3.4-.4 1-.4 1.8V12h3.9l-.4 2.1-.3 1.6h-3.2V24C19.4 23.2 24 18.2 24 12 24 5.4 18.6 0 12 0S0 5.4 0 12c0 5.6 3.9 10.4 9.1 11.7Z",
  tiktok:
    "M12.5 0c1.3 0 2.6 0 3.9 0 .1 1.5.6 3.1 1.8 4.2 1.1 1.1 2.7 1.6 4.2 1.8V10c-1.4 0-2.9-.3-4.2-1-.6-.3-1.1-.6-1.6-.9v8.8c-.1 1.4-.5 2.8-1.4 3.9-1.3 1.9-3.6 3.2-5.9 3.2-1.4.1-2.9-.3-4.1-1-2-1.2-3.4-3.4-3.7-5.7v-1.5c.2-1.9 1.1-3.7 2.6-5 1.7-1.4 4-2.1 6.2-1.7v4.4c-1-.3-2.2-.2-3 .4-.6.4-1.1 1-1.4 1.8-.2.5-.1 1.1-.1 1.6.2 1.6 1.8 3 3.5 2.9 1.1 0 2.2-.7 2.8-1.6.2-.3.4-.7.4-1.1.1-1.8.1-3.6.1-5.4V0Z",
};

export function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d={ICON_PATHS[platform]} />
    </svg>
  );
}

/**
 * Round outlined profile links for a staff member. Renders nothing when no
 * link is saved, so an empty card looks exactly like it did before.
 */
export function SocialIcons({
  links,
  personName,
  size = "md",
  tone = "light",
  className = "",
}: {
  links: SocialLinks;
  personName: string;
  size?: "sm" | "md";
  tone?: "light" | "dark";
  className?: string;
}) {
  const present = SOCIAL_PLATFORMS.filter((platform) => links[platform.id]);
  if (present.length === 0) return null;

  const box = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const glyph = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const colors =
    tone === "dark"
      ? "border-gray-600 text-white hover:border-primary hover:bg-primary"
      : "border-gray-300 text-gray-700 hover:border-primary hover:bg-primary hover:text-white";

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} data-testid="social-icons">
      {present.map((platform) => (
        <a
          key={platform.id}
          href={links[platform.id]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${personName} on ${platform.label}`}
          title={`${personName} on ${platform.label}`}
          className={`inline-flex ${box} items-center justify-center rounded-full border transition-colors ${colors}`}
        >
          <SocialIcon platform={platform.id} className={glyph} />
        </a>
      ))}
    </div>
  );
}
