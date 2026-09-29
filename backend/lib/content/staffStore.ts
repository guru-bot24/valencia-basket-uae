import "server-only";
import { cache } from "react";
import { storage } from "@/lib/storage";
import type { InsertStaffMemberRow, StaffMemberRow } from "@shared/schema";
import {
  DEFAULT_STAFF,
  STAFF_SECTIONS,
  matchAuthor,
  sortStaff,
  type StaffMember,
  type StaffSection,
} from "@/lib/content/staff";
import { SOCIAL_PLATFORMS, type SocialLinks } from "@/lib/content/socialLinks";

export function rowToStaffMember(row: StaffMemberRow): StaffMember {
  return {
    id: row.id,
    slug: row.slug,
    section: (STAFF_SECTIONS as readonly string[]).includes(row.section) ? (row.section as StaffSection) : "Coaching Staff",
    name: row.name,
    role: row.role,
    bio: row.bio,
    image: row.image,
    imageKey: row.imageKey,
    sortOrder: row.sortOrder,
    visible: row.visible,
    isAuthor: row.isAuthor,
    authorBio: row.authorBio,
    instagram: row.instagram,
    facebook: row.facebook,
    tiktok: row.tiktok,
  };
}

/**
 * Everyone, hidden included, in display order. Until Admin → Staff has been
 * opened once (which fills the table) — or if the database is unreachable —
 * this is the built-in default list, so the Staff page never breaks.
 */
export const getAllStaff = cache(async (): Promise<StaffMember[]> => {
  try {
    const rows = await storage.getStaffMembers();
    if (rows.length) return sortStaff(rows.map(rowToStaffMember));
  } catch (error) {
    console.error("[staff] failed to load staff members, using defaults:", error);
  }
  return sortStaff(DEFAULT_STAFF);
});

export async function getVisibleStaff() {
  return (await getAllStaff()).filter((member) => member.visible);
}

/** Visible blog authors only: a hidden author has no public author page. */
export async function getBlogAuthors() {
  return (await getVisibleStaff()).filter((member) => member.isAuthor);
}

export async function getAuthorBySlug(slug: string) {
  return (await getBlogAuthors()).find((author) => author.slug === slug);
}

export async function getAuthorForPost(authorName: string | null | undefined) {
  return matchAuthor(await getBlogAuthors(), authorName);
}

export function staffSocialLinks(member: StaffMember): SocialLinks {
  const links: SocialLinks = {};
  for (const platform of SOCIAL_PLATFORMS) {
    const value = member[platform.id]?.trim();
    if (value) links[platform.id] = value;
  }
  return links;
}

/** Social links as a schema.org sameAs list (undefined when there are none). */
export function staffSameAs(member: StaffMember) {
  const urls = SOCIAL_PLATFORMS.map((platform) => member[platform.id]).filter((url): url is string => !!url);
  return urls.length ? urls : undefined;
}

/**
 * Alt text for a member's photo: the SEO-managed alt while the original photo
 * is in use, otherwise the person's name (a newly uploaded photo).
 */
export function staffPhotoAlt(member: StaffMember, managedAlt: (imageKey: string) => string) {
  const original = DEFAULT_STAFF.find((candidate) => candidate.slug === member.slug);
  if (member.imageKey && original && original.image === member.image) return managedAlt(member.imageKey) || member.name;
  return member.name;
}

/**
 * Fills an empty staff table with the defaults (idempotent). Carries over any
 * author bios and social links saved under the previous Page Content keys.
 */
export async function seedStaffIfEmpty() {
  if ((await storage.getStaffMembers()).length) return;
  const overrides = new Map((await storage.getAllPageContentOverrides()).map((row) => [row.key, row.value]));
  const rows: InsertStaffMemberRow[] = DEFAULT_STAFF.map((member) => ({
    slug: member.slug,
    section: member.section,
    name: member.name,
    role: member.role,
    bio: member.bio,
    image: member.image,
    imageKey: member.imageKey,
    sortOrder: member.sortOrder,
    visible: member.visible,
    isAuthor: member.isAuthor,
    authorBio: overrides.get(`author.${member.slug}.bio`) ?? member.authorBio,
    instagram: overrides.get(`social.${member.slug}.instagram`) ?? null,
    facebook: overrides.get(`social.${member.slug}.facebook`) ?? null,
    tiktok: overrides.get(`social.${member.slug}.tiktok`) ?? null,
  }));
  await storage.seedStaffMembers(rows);
}
