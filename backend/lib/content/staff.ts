import { z } from "zod";
import { SOCIAL_PLATFORMS, normalizeSocialUrl } from "@/lib/content/socialLinks";

/**
 * Staff page (/coaches) members. The live list is stored in the
 * staff_members table and edited in Admin → Staff; DEFAULT_STAFF below is
 * what the table starts with and what the site shows until it's filled.
 * Client-safe: no database access here (see staffStore.ts).
 */

export const STAFF_SECTIONS = ["Leadership", "Management & Operations", "Coaching Staff", "Alumni Coaches"] as const;
export type StaffSection = (typeof STAFF_SECTIONS)[number];

export interface StaffMember {
  id: number | null;
  slug: string;
  section: StaffSection;
  name: string;
  role: string;
  bio: string;
  image: string;
  /** Managed-image key for the original photo, so its SEO alt text still applies. */
  imageKey: string | null;
  sortOrder: number;
  visible: boolean;
  isAuthor: boolean;
  authorBio: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
}

export const STAFF_LIMITS = { name: 80, role: 80, bio: 400, authorBio: 1500 } as const;

/** Blog authors: fixed slugs backing /blog/author/<slug>. */
export const AUTHOR_SLUGS = ["maros-kovacik", "martin-pospisil"] as const;

type DefaultStaff = Omit<StaffMember, "id" | "sortOrder" | "instagram" | "facebook" | "tiktok">;

const DEFAULTS: DefaultStaff[] = [
  {
    slug: "maros-kovacik",
    section: "Leadership",
    name: "Coach Maros Kovacik",
    role: "Director & Head Coach",
    bio: "Maros Kovacik leads Valencia Basket Academy UAE as Director and Head Coach. A EuroLeague Coach of the Year (2013) and a 15-time champion, he brings elite coaching experience from across Europe and Asia, splitting his work between Valencia and Dubai.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach-maros.jpg",
    imageKey: "coaches.maros-kovacik",
    visible: true,
    isAuthor: true,
    authorBio: "Maros Kovacik leads Valencia Basket Academy UAE as Director and Head Coach. A EuroLeague Coach of the Year (2013) and a 15-time champion, he brings elite coaching experience from across Europe and Asia, splitting his work between Valencia and Dubai.\n\nOn the academy blog, Maros writes about player development, coaching methodology, and the pathway that connects young players in Dubai to the standards of European basketball.",
  },
  {
    slug: "martin-pospisil",
    section: "Leadership",
    name: "Martin Pospisil",
    role: "Assistant Technical Director & Coach",
    bio: "Martin Pospisil joins Valencia Basket Academy UAE as Assistant Technical Director and Coach. Head coach of the Slovak women's national team and a longtime assistant to Maros Kovacik with the Polish and Slovak national teams, he brings elite European coaching experience with a focus on player development.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach-martin-pospisil.webp",
    imageKey: "coaches.martin-pospisil",
    visible: true,
    isAuthor: true,
    authorBio: "Martin Pospisil joins Valencia Basket Academy UAE as Assistant Technical Director and Coach. Head coach of the Slovak women's national team and a longtime assistant to Maros Kovacik with the Polish and Slovak national teams, he brings elite European coaching experience with a focus on player development.\n\nOn the academy blog, Martin writes about training, skill development, and what it takes for young players to grow at every stage of the game.",
  },
  {
    slug: "saiid",
    section: "Management & Operations",
    name: "Coach Saiid",
    role: "General Manager",
    bio: "FIBA-certified coach with solid experience in the basketball environment of Dubai and Lebanon. Coach Saiid brings strong international knowledge and leadership to the academy.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach_new/saiid.jpeg",
    imageKey: "coaches.saiid",
    visible: true,
    isAuthor: false,
    authorBio: null,
  },
  {
    slug: "rabih",
    section: "Management & Operations",
    name: "Rabih",
    role: "Operations Manager",
    bio: "Rabih is an experienced manager of basketball academies and brings his empathy, dedication to Valencia.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach_new/rabih.jpeg",
    imageKey: "coaches.rabih",
    visible: true,
    isAuthor: false,
    authorBio: null,
  },
  {
    slug: "majil",
    section: "Coaching Staff",
    name: "Coach Majil",
    role: "Coach",
    bio: "Coach with extensive experience in Dubai, working with both individual skill development and team programs.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach_new/majil.jpeg",
    imageKey: "coaches.majil",
    visible: true,
    isAuthor: false,
    authorBio: null,
  },
  {
    slug: "ahmed",
    section: "Coaching Staff",
    name: "Coach Ahmed",
    role: "Coach",
    bio: "Coach with experience in Dubai, specialized in individual and team development programs.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach_new/doksal.jpeg",
    imageKey: "coaches.ahmed",
    visible: true,
    isAuthor: false,
    authorBio: null,
  },
  {
    slug: "guillem",
    section: "Alumni Coaches",
    name: "Coach Guillem",
    role: "Technical Director",
    bio: "Level 3 coach certified in Spain, with experience in the EuroLeague Adidas Next Generation Tournament and as a U18 and U16 coach at Valencia Basket. He oversees the technical and developmental direction of the academy.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach-guillem.jpg",
    imageKey: "coaches.guillem",
    visible: true,
    isAuthor: false,
    authorBio: null,
  },
  {
    slug: "andreu",
    section: "Alumni Coaches",
    name: "Coach Andreu",
    role: "Assistant Coordinator",
    bio: "Coach with experience in Valencia Basket's Elite Program, holding official Spanish coaching licenses. Actively involved in player development and program coordination.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach-andreu.jpg",
    imageKey: "coaches.andreu",
    visible: true,
    isAuthor: false,
    authorBio: null,
  },
  {
    slug: "ruben",
    section: "Alumni Coaches",
    name: "Coach Ruben",
    role: "Coach",
    bio: "Coach with experience in Valencia Basket's Elite youth programs, focused on long-term player development in formative categories.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach-ruben.jpg",
    imageKey: "coaches.ruben",
    visible: true,
    isAuthor: false,
    authorBio: null,
  },
  {
    slug: "carles",
    section: "Alumni Coaches",
    name: "Coach Carles",
    role: "Coach",
    bio: "Coach with experience in elite development programs, working mainly in youth and formative categories.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach-carles.jpg",
    imageKey: "coaches.carles",
    visible: true,
    isAuthor: false,
    authorBio: null,
  },
];

export const DEFAULT_STAFF: StaffMember[] = DEFAULTS.map((member, index) => ({
  ...member,
  id: null,
  sortOrder: index,
  instagram: null,
  facebook: null,
  tiktok: null,
}));

/** Display order: by section, then by sortOrder within it. */
export function sortStaff(members: StaffMember[]) {
  return [...members].sort(
    (a, b) => STAFF_SECTIONS.indexOf(a.section) - STAFF_SECTIONS.indexOf(b.section) || a.sortOrder - b.sortOrder || a.name.localeCompare(b.name),
  );
}

export function authorPath(slug: string) {
  return `/blog/author/${slug}`;
}

/** Name used on posts, bylines and schema: the staff name without "Coach". */
export function authorDisplayName(member: Pick<StaffMember, "name">) {
  return member.name.replace(/^coach\s+/i, "").trim();
}

const normalizeName = (value: string) =>
  value.trim().toLowerCase().replace(/^coach\s+/, "").replace(/\s+/g, " ");

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/^coach\s+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "staff";
}

/**
 * Matches a post's free-text authorName ("Maros Kovacik", "Coach Maros
 * Kovacik", …) to a blog author. Also matches the slug, so renaming an
 * author in admin doesn't unlink their older articles.
 */
export function matchAuthor(authors: StaffMember[], name: string | null | undefined) {
  if (!name) return undefined;
  const wanted = normalizeName(name);
  return authors.find(
    (author) => author.isAuthor && (normalizeName(author.name) === wanted || slugify(wanted) === author.slug),
  );
}

const socialField = (platform: (typeof SOCIAL_PLATFORMS)[number]["id"]) =>
  z
    .string()
    .max(500)
    .default("")
    .transform((value, context) => {
      const result = normalizeSocialUrl(platform, value);
      if ("error" in result) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: result.error, path: [] });
        return z.NEVER;
      }
      return result.url || null;
    });

/** What the admin sends when creating or editing a member. */
export const staffInputSchema = z.object({
  section: z.enum(STAFF_SECTIONS),
  name: z.string().trim().min(1, "Name is required").max(STAFF_LIMITS.name),
  role: z.string().trim().min(1, "Title is required").max(STAFF_LIMITS.role),
  bio: z.string().trim().max(STAFF_LIMITS.bio).default(""),
  image: z
    .string()
    .trim()
    .max(1000)
    .refine((value) => value === "" || /^https:\/\//i.test(value), "Photo must be an uploaded image (HTTPS link)")
    .default(""),
  visible: z.boolean(),
  authorBio: z.string().trim().max(STAFF_LIMITS.authorBio).nullable().optional(),
  instagram: socialField("instagram"),
  facebook: socialField("facebook"),
  tiktok: socialField("tiktok"),
});

export type StaffInput = z.infer<typeof staffInputSchema>;
