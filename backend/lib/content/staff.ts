import { BLOG_AUTHORS, authorPath } from "@/lib/content/authors";

export type StaffGroup = "Leadership" | "Management & Operations" | "Coaching Staff" | "Alumni Coaches";

export interface StaffMember {
  /** Stable id: matches the managed image key (coaches.<slug>) and social-link keys. */
  slug: string;
  group: StaffGroup;
  name: string;
  role: string;
  bio: string;
  image: string;
  imageKey: string;
  /** Leadership only: their blog author page. */
  href?: string;
}

// Leadership records are shared with the blog author pages.
const leadership: StaffMember[] = BLOG_AUTHORS.map((author) => ({
  slug: author.slug,
  group: "Leadership",
  name: author.staffName,
  role: author.role,
  bio: author.shortBio,
  image: author.image,
  imageKey: author.imageKey,
  href: authorPath(author),
}));

/** Everyone on the Staff page (/coaches), in display order. */
export const STAFF: StaffMember[] = [
  ...leadership,
  {
    slug: "saiid",
    group: "Management & Operations",
    name: "Coach Saiid",
    role: "General Manager",
    bio: "FIBA-certified coach with solid experience in the basketball environment of Dubai and Lebanon. Coach Saiid brings strong international knowledge and leadership to the academy.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach_new/saiid.jpeg",
    imageKey: "coaches.saiid",
  },
  {
    slug: "rabih",
    group: "Management & Operations",
    name: "Rabih",
    role: "Operations Manager",
    bio: "Rabih is an experienced manager of basketball academies and brings his empathy, dedication to Valencia.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach_new/rabih.jpeg",
    imageKey: "coaches.rabih",
  },
  {
    slug: "majil",
    group: "Coaching Staff",
    name: "Coach Majil",
    role: "Coach",
    bio: "Coach with extensive experience in Dubai, working with both individual skill development and team programs.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach_new/majil.jpeg",
    imageKey: "coaches.majil",
  },
  {
    slug: "ahmed",
    group: "Coaching Staff",
    name: "Coach Ahmed",
    role: "Coach",
    bio: "Coach with experience in Dubai, specialized in individual and team development programs.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach_new/doksal.jpeg",
    imageKey: "coaches.ahmed",
  },
  {
    slug: "guillem",
    group: "Alumni Coaches",
    name: "Coach Guillem",
    role: "Technical Director",
    bio: "Level 3 coach certified in Spain, with experience in the EuroLeague Adidas Next Generation Tournament and as a U18 and U16 coach at Valencia Basket. He oversees the technical and developmental direction of the academy.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach-guillem.jpg",
    imageKey: "coaches.guillem",
  },
  {
    slug: "andreu",
    group: "Alumni Coaches",
    name: "Coach Andreu",
    role: "Assistant Coordinator",
    bio: "Coach with experience in Valencia Basket's Elite Program, holding official Spanish coaching licenses. Actively involved in player development and program coordination.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach-andreu.jpg",
    imageKey: "coaches.andreu",
  },
  {
    slug: "ruben",
    group: "Alumni Coaches",
    name: "Coach Ruben",
    role: "Coach",
    bio: "Coach with experience in Valencia Basket's Elite youth programs, focused on long-term player development in formative categories.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach-ruben.jpg",
    imageKey: "coaches.ruben",
  },
  {
    slug: "carles",
    group: "Alumni Coaches",
    name: "Coach Carles",
    role: "Coach",
    bio: "Coach with experience in elite development programs, working mainly in youth and formative categories.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach-carles.jpg",
    imageKey: "coaches.carles",
  },
];

export function getStaffMember(slug: string) {
  return STAFF.find((member) => member.slug === slug);
}

export function staffInGroup(group: StaffGroup) {
  return STAFF.filter((member) => member.group === group);
}
