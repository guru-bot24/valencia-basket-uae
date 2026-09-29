/**
 * Blog authors with a public bio page at /blog/author/<slug>.
 *
 * The staff page (/coaches) renders the same records, so a name, title or
 * photo change here updates both places. The long author-page bio is an
 * editable Page Content field ("Blog Authors" group); `defaultBio` is its
 * code default.
 */

export interface BlogAuthor {
  slug: string;
  /** Name used on posts, in schema, and matched against a post's authorName. */
  name: string;
  /** Name as shown on the staff page card. */
  staffName: string;
  role: string;
  /** Short bio shown on the staff card and in the author box under articles. */
  shortBio: string;
  /** Code default for the longer bio on the author page. */
  defaultBio: string;
  image: string;
  imageKey: string;
}

export const BLOG_AUTHORS: BlogAuthor[] = [
  {
    slug: "maros-kovacik",
    name: "Maros Kovacik",
    staffName: "Coach Maros Kovacik",
    role: "Director & Head Coach",
    shortBio:
      "Maros Kovacik leads Valencia Basket Academy UAE as Director and Head Coach. A EuroLeague Coach of the Year (2013) and a 15-time champion, he brings elite coaching experience from across Europe and Asia, splitting his work between Valencia and Dubai.",
    defaultBio:
      "Maros Kovacik leads Valencia Basket Academy UAE as Director and Head Coach. A EuroLeague Coach of the Year (2013) and a 15-time champion, he brings elite coaching experience from across Europe and Asia, splitting his work between Valencia and Dubai.\n\nOn the academy blog, Maros writes about player development, coaching methodology, and the pathway that connects young players in Dubai to the standards of European basketball.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach-maros.jpg",
    imageKey: "coaches.maros-kovacik",
  },
  {
    slug: "martin-pospisil",
    name: "Martin Pospisil",
    staffName: "Martin Pospisil",
    role: "Assistant Technical Director & Coach",
    shortBio:
      "Martin Pospisil joins Valencia Basket Academy UAE as Assistant Technical Director and Coach. Head coach of the Slovak women's national team and a longtime assistant to Maros Kovacik with the Polish and Slovak national teams, he brings elite European coaching experience with a focus on player development.",
    defaultBio:
      "Martin Pospisil joins Valencia Basket Academy UAE as Assistant Technical Director and Coach. Head coach of the Slovak women's national team and a longtime assistant to Maros Kovacik with the Polish and Slovak national teams, he brings elite European coaching experience with a focus on player development.\n\nOn the academy blog, Martin writes about training, skill development, and what it takes for young players to grow at every stage of the game.",
    image: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/coach-martin-pospisil.webp",
    imageKey: "coaches.martin-pospisil",
  },
];

export function authorPath(author: BlogAuthor) {
  return `/blog/author/${author.slug}`;
}

export function getAuthorBySlug(slug: string) {
  return BLOG_AUTHORS.find((author) => author.slug === slug);
}

const normalizeName = (value: string) =>
  value.trim().toLowerCase().replace(/^coach\s+/, "").replace(/\s+/g, " ");

/** Matches a post's free-text authorName ("Maros Kovacik", "Coach Maros Kovacik", …). */
export function getAuthorByName(name: string | null | undefined) {
  if (!name) return undefined;
  const wanted = normalizeName(name);
  return BLOG_AUTHORS.find(
    (author) => normalizeName(author.name) === wanted || normalizeName(author.staffName) === wanted,
  );
}
