import "server-only";
import { getContentOverrides } from "@/lib/content/pageContent";
import { SOCIAL_PLATFORMS, socialContentKey, type SocialLinks } from "@/lib/content/socialLinks";

/** Saved social links for one staff member; platforms without a link are omitted. */
export async function getStaffSocialLinks(slug: string): Promise<SocialLinks> {
  const overrides = await getContentOverrides();
  const links: SocialLinks = {};
  for (const platform of SOCIAL_PLATFORMS) {
    const value = overrides.get(socialContentKey(slug, platform.id))?.value?.trim();
    if (value) links[platform.id] = value;
  }
  return links;
}

/** The links as a schema.org sameAs list (undefined when there are none). */
export function socialSameAs(links: SocialLinks) {
  const urls = SOCIAL_PLATFORMS.map((platform) => links[platform.id]).filter((url): url is string => !!url);
  return urls.length ? urls : undefined;
}
