import { z } from "zod";

const allowedHtmlTags = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s", "h1", "h2", "h3", "h4",
  "blockquote", "ul", "ol", "li", "a", "span", "font", "img", "hr", "div",
]);

export function sanitizeBlogHtml(input: string) {
  let html = input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|form|textarea|button|svg|math|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|textarea|button|svg|math|template)\b[^>]*\/?>/gi, "");

  return html.replace(/<([a-z0-9]+)([^>]*)>/gi, (full, rawTag: string, rawAttributes: string) => {
    const tag = rawTag.toLowerCase();
    if (!allowedHtmlTags.has(tag)) return "";
    if (tag === "br" || tag === "hr") return `<${tag}>`;

    const attributes: string[] = [];
    const attributePattern = /([a-z:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gi;
    let match: RegExpExecArray | null;
    while ((match = attributePattern.exec(rawAttributes))) {
      const name = match[1].toLowerCase();
      const value = match[2] ?? match[3] ?? match[4] ?? "";
      if (name.startsWith("on") || name === "id" || name === "class" || name === "srcset") continue;
      if (name === "href") {
        if (!/^(?:https?:\/\/|mailto:|\/|#)/i.test(value)) continue;
        attributes.push(`href="${value.replace(/"/g, "&quot;")}"`);
        continue;
      }
      if (name === "src") {
        if (!/^(?:https:\/\/|\/|data:image\/(?:jpeg|png|webp|gif);base64,)/i.test(value)) continue;
        attributes.push(`src="${value.replace(/"/g, "&quot;")}"`);
        continue;
      }
      if (name === "alt" || name === "title" || name === "target" || name === "rel") {
        attributes.push(`${name}="${value.replace(/"/g, "&quot;")}"`);
        continue;
      }
      if (name === "color" && /^(?:#[0-9a-f]{3,8}|[a-z]+)$/i.test(value)) {
        attributes.push(`color="${value}"`);
        continue;
      }
      if (name === "style") {
        const safeStyles = value
          .split(";")
          .map((style) => style.trim())
          .filter((style) => /^(?:color|text-align)\s*:\s*(?:#[0-9a-f]{3,8}|[a-z]+|left|center|right)\s*$/i.test(style));
        if (safeStyles.length) attributes.push(`style="${safeStyles.join("; ").replace(/"/g, "&quot;")}"`);
      }
    }
    return `<${tag}${attributes.length ? ` ${attributes.join(" ")}` : ""}>`;
  }).replace(/<\/([a-z0-9]+)\s*>/gi, (full, rawTag: string) => {
    const tag = rawTag.toLowerCase();
    return allowedHtmlTags.has(tag) ? `</${tag}>` : "";
  });
}

export function sanitizeBlogContent(input: string) {
  return /<[a-z][\s\S]*>/i.test(input) ? sanitizeBlogHtml(input) : input;
}

export function blogPlainText(input: string) {
  return sanitizeBlogContent(input)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

const imageSource = z
  .string()
  .trim()
  .max(2_850_000, "Featured images must be 2 MB or smaller")
  .refine(
    (value) =>
      value === "" ||
      value.startsWith("/") ||
      value.startsWith("https://") ||
      /^data:image\/(?:jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(value),
    "Use a site image path, HTTPS image URL, or uploaded image file"
  );

export const blogPostInputSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z.string().trim().min(3).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  excerpt: z.string().trim().max(320).nullable().optional(),
  content: z.string().trim().min(1).max(200_000),
  featuredImageSrc: imageSource.nullable().optional(),
  featuredImageAlt: z.string().trim().max(160).nullable().optional(),
  authorName: z.string().trim().min(2).max(120),
  status: z.enum(["draft", "published", "scheduled"]),
  publishedAt: z.string().datetime({ offset: true }).nullable().optional(),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().trim().max(160).nullable().optional(),
  metaDescription: z.string().trim().max(320).nullable().optional(),
  ogTitle: z.string().trim().max(160).nullable().optional(),
  ogDescription: z.string().trim().max(320).nullable().optional(),
  ogImage: imageSource.nullable().optional(),
  focusKeyword: z.string().trim().max(100).nullable().optional(),
  noIndex: z.boolean().default(false),
  visibility: z.enum(["public", "private", "password"]).default("public"),
  password: z.string().min(8).max(120).optional().nullable(),
  lockModifiedDate: z.boolean().default(false),
  schemaEnabled: z.boolean().default(true),
  categoryNames: z.array(z.string().trim().min(1).max(80)).min(1, "Select at least one category").max(20),
  tagNames: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
}).superRefine((value, context) => {
  if (value.status === "scheduled" && !value.publishedAt) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["publishedAt"],
      message: "A scheduled post requires a publish date",
    });
  }
});

export function normalizeBlogPostInput(input: z.infer<typeof blogPostInputSchema>) {
  const featuredImageSrc = input.featuredImageSrc?.trim() || null;
  const featuredImageAlt = input.featuredImageAlt?.trim() || null;
  if (featuredImageSrc && !featuredImageAlt) {
    throw new Error("Featured image alt text is required when an image is selected");
  }

  return {
    ...input,
    excerpt: input.excerpt?.trim() || null,
    content: sanitizeBlogContent(input.content),
    featuredImageSrc,
    featuredImageAlt,
    publishedAt:
      input.status === "published" && !input.publishedAt
        ? new Date()
        : input.publishedAt
          ? new Date(input.publishedAt)
          : null,
    metaTitle: input.metaTitle?.trim() || null,
    metaDescription: input.metaDescription?.trim() || null,
    ogTitle: input.ogTitle?.trim() || null,
    ogDescription: input.ogDescription?.trim() || null,
    ogImage: input.ogImage?.trim() || null,
    focusKeyword: input.focusKeyword?.trim() || null,
    password: input.password?.trim() || null,
    categoryNames: [...new Set(input.categoryNames.map((name) => name.trim()).filter(Boolean))],
    tagNames: [...new Set(input.tagNames.map((name) => name.trim()).filter(Boolean))],
  };
}

export function splitBlogNames(value: string) {
  return [...new Set(value.split(",").map((name) => name.trim()).filter(Boolean))];
}