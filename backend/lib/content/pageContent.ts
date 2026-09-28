import "server-only";
import { cache } from "react";
import { storage } from "@/lib/storage";

export type ContentFieldType = "text" | "textarea" | "image";

export interface ContentField {
  key: string;
  page: string;
  label: string;
  type: ContentFieldType;
  maxLength?: number;
  default: string;
}

export const CONTENT_FIELDS: ContentField[] = [
  {
    key: "home.hero.subtext",
    page: "Home",
    label: "Hero subtext",
    type: "textarea",
    maxLength: 220,
    default:
      "Join Valencia Basketball Academy in Dubai and follow an elite player development pathway inspired by L'Alqueria del Basket. Excellence, culture, and high performance for youth and kids.",
  },
  {
    key: "home.hero.image",
    page: "Home",
    label: "Hero background image",
    type: "image",
    default: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/hero-players-2.jpg",
  },
  {
    key: "home.methodology.blurb",
    page: "Home",
    label: "Methodology section blurb",
    type: "textarea",
    maxLength: 320,
    default:
      "A proven system developed in Valencia, Spain, helping players reach the professional level through a mix of training methods that connect all elements of the game.",
  },
  {
    key: "programs.intro",
    page: "Programs",
    label: "Intro subtext",
    type: "textarea",
    maxLength: 220,
    default: "From first dribbles to professional pathways. A structured journey for every stage of development.",
  },
  {
    key: "facilities.intro",
    page: "Facilities",
    label: "Intro subtext",
    type: "textarea",
    maxLength: 220,
    default: "One dedicated home from August 2026.",
  },
];

const fieldMap = new Map(CONTENT_FIELDS.map((field) => [field.key, field]));

export function getContentField(key: string): ContentField | undefined {
  return fieldMap.get(key);
}

export const getContentOverrides = cache(async () => {
  try {
    return new Map((await storage.getAllPageContentOverrides()).map((row) => [row.key, row]));
  } catch (error) {
    console.error("[content] failed to load page content overrides:", error);
    return new Map();
  }
});

export async function getContent(key: string): Promise<string> {
  const field = fieldMap.get(key);
  if (!field) throw new Error(`Unknown content field: ${key}`);
  const overrides = await getContentOverrides();
  return overrides.get(key)?.value ?? field.default;
}
