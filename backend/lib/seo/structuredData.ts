/**
 * Structured data emitted by the site. These objects are the single source of
 * truth: the pages render them as JSON-LD and the admin SEO Manager reads them
 * back for its read-only "Structured data" view. There is no free-form schema
 * editor by design.
 */

export const CONTACT_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=AllSports+Arena+Al+Quoz+Dubai";

export const contactStructuredData = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "Valencia Basket Academy UAE",
  url: "https://valenciabasket.ae/contact",
  telephone: "+971544386838",
  email: "info@valenciabasket.ae",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Hadaeq Mohammed Bin Rashid, AllSports Arena, Latifa Bint Hamdan St, Al Quoz Ind. First",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  hasMap: CONTACT_MAPS_URL,
  sameAs: [
    "https://www.instagram.com/valenciabasketuae",
    "https://www.tiktok.com/@valenciabasketuae",
  ],
} as const;

export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does Valencia Basket Academy UAE do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Valencia Basket Academy UAE is a youth basketball academy in Dubai for children aged 4 to 18, training at AllSports Arena in Al Quoz. We run three age-based programs designed around how young players actually develop, not a one-size-fits-all class.",
      },
    },
    {
      "@type": "Question",
      name: "Is Valencia Basket Academy UAE officially connected to Valencia Basket in Spain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Valencia Basket Academy UAE operates as an official academy partner of Valencia Basket, one of Spain's leading professional basketball clubs.",
      },
    },
    {
      "@type": "Question",
      name: "Where are you located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We train at AllSports Arena, Al Quoz, Dubai.",
      },
    },
    {
      "@type": "Question",
      name: "What programs do you offer, and what age is each for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer three age-based programs: Future Ballers for ages 4 to 6, Mini Basket for ages 7 to 10, and Youth Academy for ages 11 to 18. We also have a Private Training program with smaller batch and 1-on-1 sessions.",
      },
    },
    {
      "@type": "Question",
      name: "My child has never played basketball before — can they still join?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All three programs are built to take in complete beginners alongside more experienced players. Coaches adjust drills and pacing to each child's current ability, so no prior experience is needed to start.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer a competitive or selection-based track?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Alongside our three core programs, we run an Elite/Select tier for players ready for a higher level of competition. Entry is invitation-only, based on tryouts, and coaches invite players they feel are ready.",
      },
    },
    {
      "@type": "Question",
      name: "What will players be evaluated on?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Players are assessed according to Valencia Basket's methodology and curriculum developed in Spain. The assessment covers their understanding of the game, shooting, read-and-react ability, ball handling, court vision, decision-making, and their understanding of the Spanish style and system of play.",
      },
    },
    {
      "@type": "Question",
      name: "When does the season start and end?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The season runs in three terms: Term 1 (September to December), Term 2 (January to March), and Term 3 (April to June).",
      },
    },
    {
      "@type": "Question",
      name: "How do I book a free trial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Fill in the Book a Free Trial form on our website with your child's name, age group, and your contact details, or message us directly on WhatsApp. We'll confirm a trial session at AllSports Arena.",
      },
    },
    {
      "@type": "Question",
      name: "What documents do I need to register?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We require a copy of the participant's passport or Emirates ID so that the necessary documents are available if the player participates in tournaments or represents the country. A medical form may also be requested when required by tournament organisers.",
      },
    },
    {
      "@type": "Question",
      name: "What is your refund policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Refunds may be provided depending on the participant's circumstances and the reason given. Where approved, the refund is issued as a cash refund rather than a credit note.",
      },
    },
    {
      "@type": "Question",
      name: "Does Valencia Basket Academy UAE offer any discounts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer a sibling discount for the second child. We also offer a specific discount for families who register for all three terms. However, we do not offer financial assistance.",
      },
    },
    {
      "@type": "Question",
      name: "What are your training days and times?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our training sessions run Monday to Friday in the evenings. Contact us to get an update on your ideal batch timing.",
      },
    },
    {
      "@type": "Question",
      name: "Does the schedule change during Ramadan or public holidays?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. During Ramadan, training times may shift to accommodate Iftar. Sessions falling on national or religious holidays are adjusted in advance, and families are notified ahead of any change.",
      },
    },
    {
      "@type": "Question",
      name: "What is the coach to player ratio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There are at least two coaches, with a maximum of 15 players per group.",
      },
    },
    {
      "@type": "Question",
      name: "What if my child misses a session — is a make-up class available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There are no make-up sessions provided when a player misses a class.",
      },
    },
    {
      "@type": "Question",
      name: "Does my child need any fitness or medical clearance to join?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Parents/guardians confirm at registration that their child is physically fit to take part in basketball training, and are asked to disclose any medical condition or special requirement relevant to safe participation.",
      },
    },
    {
      "@type": "Question",
      name: "Is insurance provided for participants?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Valencia Basket Academy UAE does not currently provide participant accident or injury insurance. Participation is therefore subject to the family's own responsibility and insurance arrangements.",
      },
    },
    {
      "@type": "Question",
      name: "What should my child bring to training?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Players must bring their official academy kit, suitable basketball shoes, and a water bottle.",
      },
    },
    {
      "@type": "Question",
      name: "Do you take photos or videos of participants during training?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We may photograph or film sessions and events for use on our website and social media, only where a parent or guardian has given consent. If you'd prefer your child not be included, you can let us know at registration or at any time afterward.",
      },
    },
    {
      "@type": "Question",
      name: "Can parents watch training sessions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, parents can observe from the designated viewing area during the training sessions.",
      },
    },
    {
      "@type": "Question",
      name: "How do I get in touch with the academy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can reach us by call or WhatsApp at +971 54 438 6838, or through the contact form on our website. You can also email us at info@valenciabasket.ae.",
      },
    },
  ],
} as const;

export interface StructuredDataEntry {
  key?: string;
  path: string;
  label: string;
  type: string;
  /** Where the JSON-LD comes from, shown in the admin as context. */
  note: string;
  json: unknown;
  enabled?: boolean;
}

export type EditableSchemaField = { key: string; label: string; type: "text" | "url" | "email" | "date"; required?: boolean };
export interface ManagedStructuredDataEntry extends StructuredDataEntry {
  key: string;
  fields: EditableSchemaField[];
  lockedFields?: string[];
  enabledByDefault: boolean;
}

const SITE = "https://valenciabasket.ae";
const organization = {
  "@context": "https://schema.org", "@type": "SportsOrganization",
  name: "Valencia Basket Academy UAE", url: SITE, telephone: "+971544386838",
  email: "info@valenciabasket.ae",
  logo: `${SITE}/images/logo.png`,
  address: { "@type": "PostalAddress", streetAddress: "Hadaeq Mohammed Bin Rashid, AllSports Arena, Latifa Bint Hamdan St, Al Quoz Ind. First", addressLocality: "Dubai", addressCountry: "AE" },
  sameAs: ["https://www.instagram.com/valenciabasketuae", "https://www.tiktok.com/@valenciabasketuae", "https://www.facebook.com/profile.php?id=61587608243652", "https://www.linkedin.com/company/valencia-basket-academy-uae/"],
};
const page = (path: string, name: string, type = "WebPage") => ({
  "@context": "https://schema.org", "@type": type, name, url: `${SITE}${path}`,
});
export const structuredDataRegistry: ManagedStructuredDataEntry[] = [
  { key: "/__schema/sitewide-organization", path: "/", label: "Academy organization", type: "SportsOrganization", note: "Sitewide academy identity.", json: organization, enabledByDefault: true, fields: [{ key: "telephone", label: "Telephone", type: "text", required: true }, { key: "email", label: "Email", type: "email", required: true }], lockedFields: ["name", "url", "logo", "address", "sameAs"] },
  { key: "/__schema/home-website", path: "/", label: "Website", type: "WebSite", note: "Home page website identity.", json: { "@context": "https://schema.org", "@type": "WebSite", name: "Valencia Basket Academy UAE", url: SITE }, enabledByDefault: true, fields: [], lockedFields: ["name", "url"] },
  { key: "future-ballers", path: "/programs/future-ballers", label: "Future Ballers", type: "Course", note: "Core program details.", json: { ...page("/programs/future-ballers", "Future Ballers", "Course"), description: "Basketball development program for ages 4 to 6." }, enabledByDefault: true, fields: [{ key: "description", label: "Description", type: "text", required: true }], lockedFields: ["name", "url"] },
  { key: "mini-basket", path: "/programs/mini-basket", label: "Mini Basket", type: "Course", note: "Core program details.", json: { ...page("/programs/mini-basket", "Mini Basket", "Course"), description: "Basketball development program for ages 7 to 10." }, enabledByDefault: true, fields: [{ key: "description", label: "Description", type: "text", required: true }], lockedFields: ["name", "url"] },
  { key: "youth-academy", path: "/programs/youth-academy", label: "Youth Academy", type: "Course", note: "Core program details.", json: { ...page("/programs/youth-academy", "Youth Academy", "Course"), description: "Basketball development program for ages 11 to 18." }, enabledByDefault: true, fields: [{ key: "description", label: "Description", type: "text", required: true }], lockedFields: ["name", "url"] },
  { key: "facilities", path: "/facilities", label: "Facilities", type: "SportsActivityLocation", note: "Academy's venue page.", json: { ...page("/facilities", "AllSports Arena", "SportsActivityLocation"), hasMap: CONTACT_MAPS_URL }, enabledByDefault: true, fields: [{ key: "hasMap", label: "Map URL", type: "url" }], lockedFields: ["name", "url"] },
  { key: "admissions", path: "/admissions", label: "Admissions", type: "WebPage", note: "Admissions page.", json: page("/admissions", "Admissions"), enabledByDefault: true, fields: [], lockedFields: ["name", "url"] },
];
const breadcrumbPages = [
  ["/programs", "Programs"], ["/programs/future-ballers", "Future Ballers"],
  ["/programs/mini-basket", "Mini Basket"], ["/programs/youth-academy", "Youth Academy"],
  ["/programs/private-training", "Private Training"], ["/methodology", "Methodology"],
  ["/coaches", "Coaches"], ["/facilities", "Facilities"], ["/admissions", "Admissions"],
  ["/events", "Events"], ["/contact", "Contact"], ["/faqs", "FAQs"], ["/blog", "Blog"],
  ["/privacy-policy", "Privacy Policy"], ["/terms", "Terms and Conditions"],
] as const;
export const breadcrumbStructuredDataRegistry: ManagedStructuredDataEntry[] = breadcrumbPages.map(([path, label]) => ({
  key: `/__schema/breadcrumb${path}`, path, label: `${label} breadcrumb`, type: "BreadcrumbList",
  note: "Derived from the route and page label.", json: breadcrumbs(path, label), enabledByDefault: true,
  fields: [], lockedFields: ["all route and label values"],
}));

export function breadcrumbs(path: string, label: string) {
  const crumbs = path.split("/").filter(Boolean);
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE }, ...crumbs.map((part, index) => ({ "@type": "ListItem", position: index + 2, name: index === crumbs.length - 1 ? label : part.replace(/-/g, " "), item: `${SITE}/${crumbs.slice(0, index + 1).join("/")}` }))] };
}
