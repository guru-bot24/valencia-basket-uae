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
  // ---- Home ----
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
    key: "home.programs.description",
    page: "Home",
    label: "Programs section subtext",
    type: "textarea",
    maxLength: 200,
    default: "A comprehensive development structure for every stage of an athlete's journey.",
  },
  {
    key: "home.program.future-ballers.description",
    page: "Home",
    label: "Future Ballers card blurb",
    type: "textarea",
    maxLength: 140,
    default: "Playful first steps into basketball, building coordination, confidence, and fun.",
  },
  {
    key: "home.program.mini-basket.description",
    page: "Home",
    label: "Mini Basket card blurb",
    type: "textarea",
    maxLength: 140,
    default: "Fun, fundamentals, and coordination. The perfect start to structured basketball.",
  },
  {
    key: "home.program.youth-academy.description",
    page: "Home",
    label: "Youth Academy card blurb",
    type: "textarea",
    maxLength: 140,
    default: "Technical mastery, tactical understanding, and competition preparation.",
  },
  {
    key: "home.program.elite.description",
    page: "Home",
    label: "Elite / Select card blurb",
    type: "textarea",
    maxLength: 140,
    default: "High-performance training for top-tier talent aiming for professional pathways.",
  },
  {
    key: "home.program.private-training.description",
    page: "Home",
    label: "Private Training card blurb",
    type: "textarea",
    maxLength: 140,
    default: "Personalized attention to correct mechanics and accelerate growth.",
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
    key: "home.cta-mid.headline",
    page: "Home",
    label: "Mid-page CTA headline",
    type: "text",
    maxLength: 80,
    default: "Book a free trial session",
  },
  {
    key: "home.facilities-preview.title",
    page: "Home",
    label: "Facilities preview title",
    type: "text",
    maxLength: 60,
    default: "AllSports Arena",
  },
  {
    key: "home.facilities-preview.description",
    page: "Home",
    label: "Facilities preview description",
    type: "textarea",
    maxLength: 260,
    default:
      "Our dedicated home in Al Quoz from August 2026, with FIBA-standard indoor courts, professional hoops, and a climate-controlled environment for optimal performance.",
  },
  {
    key: "home.testimonial1.text",
    page: "Home",
    label: "Testimonial 1 — quote",
    type: "textarea",
    maxLength: 220,
    default: "The discipline and structure at Valencia Basket UAE is unlike anything else in Dubai. My son has improved drastically.",
  },
  {
    key: "home.testimonial1.author",
    page: "Home",
    label: "Testimonial 1 — author",
    type: "text",
    maxLength: 60,
    default: "Sarah M.",
  },
  {
    key: "home.testimonial1.role",
    page: "Home",
    label: "Testimonial 1 — role",
    type: "text",
    maxLength: 60,
    default: "Parent of U12 Player",
  },
  {
    key: "home.testimonial2.text",
    page: "Home",
    label: "Testimonial 2 — quote",
    type: "textarea",
    maxLength: 220,
    default: "Professional coaching that actually cares about long-term development, not just winning weekend games.",
  },
  {
    key: "home.testimonial2.author",
    page: "Home",
    label: "Testimonial 2 — author",
    type: "text",
    maxLength: 60,
    default: "James D.",
  },
  {
    key: "home.testimonial2.role",
    page: "Home",
    label: "Testimonial 2 — role",
    type: "text",
    maxLength: 60,
    default: "Parent of U16 Player",
  },
  {
    key: "home.testimonial3.text",
    page: "Home",
    label: "Testimonial 3 — quote",
    type: "textarea",
    maxLength: 220,
    default: "Bringing the Spanish methodology here was a game changer. The attention to detail is world-class.",
  },
  {
    key: "home.testimonial3.author",
    page: "Home",
    label: "Testimonial 3 — author",
    type: "text",
    maxLength: 60,
    default: "Ahmed K.",
  },
  {
    key: "home.testimonial3.role",
    page: "Home",
    label: "Testimonial 3 — role",
    type: "text",
    maxLength: 60,
    default: "Elite Player",
  },
  {
    key: "home.book-trial.headline",
    page: "Home",
    label: "Book-a-trial section headline",
    type: "text",
    maxLength: 60,
    default: "Start Your Journey Today",
  },
  {
    key: "home.book-trial.subtext",
    page: "Home",
    label: "Book-a-trial section subtext",
    type: "textarea",
    maxLength: 200,
    default: "Book a free assessment session. Let our coaches evaluate your potential and place you in the right program.",
  },

  // ---- Programs ----
  {
    key: "programs.intro",
    page: "Programs",
    label: "Intro subtext",
    type: "textarea",
    maxLength: 220,
    default: "From first dribbles to professional pathways. A structured journey for every stage of development.",
  },
  {
    key: "programs.future-ballers.description",
    page: "Programs",
    label: "Future Ballers full description",
    type: "textarea",
    maxLength: 400,
    default:
      "The very first step into basketball. Playful, movement-rich sessions that build coordination, confidence, and a love for the ball.",
  },
  {
    key: "programs.mini-basket.description",
    page: "Programs",
    label: "Mini Basket full description",
    type: "textarea",
    maxLength: 400,
    default:
      "The perfect introduction to structured basketball. We focus on coordination, basic ball handling, and falling in love with the game in a low-pressure environment.",
  },
  {
    key: "programs.youth-academy.description",
    page: "Programs",
    label: "Youth Academy full description",
    type: "textarea",
    maxLength: 400,
    default:
      "Building the complete player. Technical mastery, including shooting form, dribbling mechanics, and defensive footwork, progressing into complex tactical concepts, physical conditioning, and competition preparation.",
  },
  {
    key: "programs.elite.description",
    page: "Programs",
    label: "Elite / Select full description",
    type: "textarea",
    maxLength: 400,
    default: "For athletes with professional aspirations. Intensive training, personalized development plans, and exposure to international pathways.",
  },
  {
    key: "programs.private-training.description",
    page: "Programs",
    label: "Private Training section description",
    type: "textarea",
    maxLength: 400,
    default:
      "Accelerate your development with focused, personalized instruction from our expert staff. Private training builds the individual tools needed to execute at the highest level through high-volume repetition and immediate feedback.",
  },
  {
    key: "programs.not-sure.description",
    page: "Programs",
    label: "\"Not sure which level?\" description",
    type: "textarea",
    maxLength: 260,
    default: "Book a free assessment session and our coaches will evaluate your skills and recommend the perfect program.",
  },

  // ---- Facilities ----
  {
    key: "facilities.intro",
    page: "Facilities",
    label: "Intro subtext",
    type: "textarea",
    maxLength: 220,
    default: "One dedicated home from August 2026.",
  },
  {
    key: "facilities.whats-inside.description",
    page: "Facilities",
    label: "\"What's Inside\" subtext",
    type: "textarea",
    maxLength: 200,
    default: "A professional, purpose-built environment for every session.",
  },
  {
    key: "facilities.travel-band.description",
    page: "Facilities",
    label: "Travel-time section subtext",
    type: "textarea",
    maxLength: 200,
    default: "Al Quoz sits at the crossroads of the city, an easy drive from wherever you are.",
  },
  {
    key: "facilities.getting-here.description1",
    page: "Facilities",
    label: "\"Getting Here\" paragraph 1",
    type: "textarea",
    maxLength: 300,
    default:
      "AllSports Arena is on Latifa Bint Hamdan Street, Al Quoz Industrial First, minutes from Sheikh Zayed Road and Al Khail Road, with easy access from both sides of the city.",
  },
  {
    key: "facilities.getting-here.description2",
    page: "Facilities",
    label: "\"Getting Here\" paragraph 2",
    type: "textarea",
    maxLength: 200,
    default: "Free parking is available on site, right by the entrance.",
  },
  {
    key: "facilities.why-venue.description",
    page: "Facilities",
    label: "\"One Home, One Standard\" description",
    type: "textarea",
    maxLength: 400,
    default:
      "From August 2026, every Valencia Basket Academy UAE session takes place under one roof, one consistent, professional training base built around the same standards our players experience at L'Alqueria del Basket in Valencia. Same courts, same coaches, same methodology, every week.",
  },
  {
    key: "facilities.closing-cta.description",
    page: "Facilities",
    label: "Closing CTA subtext",
    type: "textarea",
    maxLength: 220,
    default: "Book a free trial session and experience the new home of Valencia Basket Academy UAE.",
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
