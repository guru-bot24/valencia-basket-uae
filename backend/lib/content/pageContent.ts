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
    label: "Future Ballers card blurb (short — separate from the Programs page description)",
    type: "textarea",
    maxLength: 140,
    default: "Playful first steps into basketball, building coordination, confidence, and fun.",
  },
  {
    key: "home.program.mini-basket.description",
    page: "Home",
    label: "Mini Basket card blurb (short — separate from the Programs page description)",
    type: "textarea",
    maxLength: 140,
    default: "Fun, fundamentals, and coordination. The perfect start to structured basketball.",
  },
  {
    key: "home.program.youth-academy.description",
    page: "Home",
    label: "Youth Academy card blurb (short — separate from the Programs page description)",
    type: "textarea",
    maxLength: 140,
    default: "Technical mastery, tactical understanding, and competition preparation.",
  },
  {
    key: "home.program.elite.description",
    page: "Home",
    label: "Elite / Select card blurb (short — separate from the Programs page description)",
    type: "textarea",
    maxLength: 140,
    default: "High-performance training for top-tier talent aiming for professional pathways.",
  },
  {
    key: "home.program.private-training.description",
    page: "Home",
    label: "Private Training card blurb (short — separate from the Programs page description)",
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

  // ---- Program Images (shared — each appears on BOTH the Home page card and the Programs page) ----
  {
    key: "program.future-ballers.image",
    page: "Program Images",
    label: "Future Ballers photo (shown on Home and Programs)",
    type: "image",
    default: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/mini-basket-team.jpg",
  },
  {
    key: "program.mini-basket.image",
    page: "Program Images",
    label: "Mini Basket photo (shown on Home and Programs)",
    type: "image",
    default: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/youth-team-small.jpg",
  },
  {
    key: "program.youth-academy.image",
    page: "Program Images",
    label: "Youth Academy photo (shown on Home and Programs)",
    type: "image",
    default: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/youth-program.jpeg",
  },
  {
    key: "program.elite.image",
    page: "Program Images",
    label: "Elite / Select photo (shown on Home and Programs)",
    type: "image",
    default: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/team-award.jpg",
  },
  {
    key: "program.private-training.image",
    page: "Program Images",
    label: "Private Training photo (shown on Home and Programs)",
    type: "image",
    default: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/1v1-a.jpg",
  },

  // ---- Facilities ----
  {
    key: "facilities.intro",
    page: "Location",
    label: "Intro subtext",
    type: "textarea",
    maxLength: 220,
    default: "One dedicated home from August 2026.",
  },
  {
    key: "facilities.whats-inside.description",
    page: "Location",
    label: "\"What's Inside\" subtext",
    type: "textarea",
    maxLength: 200,
    default: "A professional, purpose-built environment for every session.",
  },
  {
    key: "facilities.travel-band.description",
    page: "Location",
    label: "Travel-time section subtext",
    type: "textarea",
    maxLength: 200,
    default: "Al Quoz sits at the crossroads of the city, an easy drive from wherever you are.",
  },
  {
    key: "facilities.getting-here.description1",
    page: "Location",
    label: "\"Getting Here\" paragraph 1",
    type: "textarea",
    maxLength: 300,
    default:
      "AllSports Arena is on Latifa Bint Hamdan Street, Al Quoz Industrial First, minutes from Sheikh Zayed Road and Al Khail Road, with easy access from both sides of the city.",
  },
  {
    key: "facilities.getting-here.description2",
    page: "Location",
    label: "\"Getting Here\" paragraph 2",
    type: "textarea",
    maxLength: 200,
    default: "Free parking is available on site, right by the entrance.",
  },
  {
    key: "facilities.why-venue.description",
    page: "Location",
    label: "\"One Home, One Standard\" description",
    type: "textarea",
    maxLength: 400,
    default:
      "From August 2026, every Valencia Basket Academy UAE session takes place under one roof, one consistent, professional training base built around the same standards our players experience at L'Alqueria del Basket in Valencia. Same courts, same coaches, same methodology, every week.",
  },
  {
    key: "facilities.closing-cta.description",
    page: "Location",
    label: "Closing CTA subtext",
    type: "textarea",
    maxLength: 220,
    default: "Book a free trial session and experience the new home of Valencia Basket Academy UAE.",
  },
  {
    key: "facilities.image.arena-render",
    page: "Location",
    label: "Arena carousel — image 1",
    type: "image",
    default: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/allsports-arena-render.jpg",
  },
  {
    key: "facilities.image.arena-courts",
    page: "Location",
    label: "Arena carousel — image 2",
    type: "image",
    default: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/All-sports-arena.jpg",
  },

  // ---- Methodology ----
  {
    key: "methodology.hero.subtext",
    page: "Methodology",
    label: "Hero subtext",
    type: "textarea",
    maxLength: 260,
    default:
      "A proven system developed in Valencia, Spain, built on strong, non-negotiable human values that run through every stage of basketball learning and development.",
  },
  {
    key: "methodology.how-we-train.description",
    page: "Methodology",
    label: "\"How We Train\" section subtext",
    type: "textarea",
    maxLength: 320,
    default:
      "Our methodology is based on not rushing any part of a player's journey, whether technical or tactical. We fully respect individual learning rhythms, making sure that progress is real, solid, and long-lasting.",
  },
  {
    key: "methodology.how-we-train.paragraph",
    page: "Methodology",
    label: "\"How We Train\" body paragraph",
    type: "textarea",
    maxLength: 400,
    default:
      "Our approach is a mix of different training methods, designed to create a global and complete learning experience that connects all elements of the game. We don't just teach offensive or defensive techniques; we help players understand how and when to use them in real game situations, and most importantly, why.",
  },
  {
    key: "methodology.tactical.description",
    page: "Methodology",
    label: "\"Tactical Learning\" section subtext",
    type: "textarea",
    maxLength: 260,
    default: "Our tactical philosophy is built around key principles that reflect how modern professional basketball is played at the highest level.",
  },
  {
    key: "methodology.long-term.description",
    page: "Methodology",
    label: "\"Long-Term Development\" section subtext",
    type: "textarea",
    maxLength: 260,
    default: "Our methodology avoids accelerating development in an artificial or rushed way. We believe in a process that must be respected at every stage.",
  },
  {
    key: "methodology.cta.subtext",
    page: "Methodology",
    label: "Closing CTA subtext",
    type: "textarea",
    maxLength: 200,
    default: "Book a free trial session and see our proven development system in action.",
  },
  {
    key: "methodology.image",
    page: "Methodology",
    label: "\"Long-Term Vision\" image",
    type: "image",
    default: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/methodology.jpeg",
  },

  // ---- Contact ----
  {
    key: "contact.hero.subtext",
    page: "Contact Us",
    label: "Hero subtext",
    type: "textarea",
    maxLength: 200,
    default: "Questions about programs, trials, or partnerships? We're here to help.",
  },

  // ---- FAQs ----
  {
    key: "faqs.still-have-question.description",
    page: "FAQs",
    label: "\"Still have a question?\" subtext",
    type: "textarea",
    maxLength: 200,
    default: "We're happy to help. Reach out directly and we'll get back to you.",
  },

  // ---- Admissions ----
  {
    key: "admissions.hero.subtext",
    page: "Admissions",
    label: "Hero subtext",
    type: "textarea",
    maxLength: 200,
    default: "Join the Valencia Basket family. Simple steps to start your journey.",
  },
  {
    key: "admissions.step1.description",
    page: "Admissions",
    label: "Step 1 — Book a Free Trial",
    type: "textarea",
    maxLength: 200,
    default: "Register online for an assessment session. Choose a convenient time and location.",
  },
  {
    key: "admissions.step2.description",
    page: "Admissions",
    label: "Step 2 — Attend Assessment",
    type: "textarea",
    maxLength: 200,
    default: "Come to the court! Meet the coaches and enjoy a training session. We'll evaluate your level.",
  },
  {
    key: "admissions.step3.description",
    page: "Admissions",
    label: "Step 3 — Placement & Registration",
    type: "textarea",
    maxLength: 200,
    default: "Receive your group placement and schedule options. Complete the registration forms and payment.",
  },
  {
    key: "admissions.step4.description",
    page: "Admissions",
    label: "Step 4 — Start Training",
    type: "textarea",
    maxLength: 200,
    default: "Receive your kit and start your development journey with Valencia Basket UAE.",
  },
  {
    key: "admissions.term1.dates",
    page: "Admissions",
    label: "Term 1 (Autumn) dates",
    type: "text",
    maxLength: 60,
    default: "Sep 1st - Dec 15th",
  },
  {
    key: "admissions.term2.dates",
    page: "Admissions",
    label: "Term 2 (Winter) dates",
    type: "text",
    maxLength: 60,
    default: "Jan 5th - Mar 28th",
  },
  {
    key: "admissions.term3.dates",
    page: "Admissions",
    label: "Term 3 (Spring) dates",
    type: "text",
    maxLength: 60,
    default: "Apr 14th - Jun 30th",
  },

  // ---- Events ----
  {
    key: "events.intro",
    page: "Events & Camps",
    label: "Intro subtext",
    type: "textarea",
    maxLength: 220,
    default: "Upcoming opportunities to compete, learn, and grow outside regular season training.",
  },

  // ---- Program: Future Ballers ----
  {
    key: "future-ballers.hero.subtext",
    page: "Future Ballers",
    label: "Hero subtext",
    type: "textarea",
    maxLength: 260,
    default: "The perfect first basketball program for kids, ages 4 to 6, in Dubai. Where tiny hands meet big dreams, through movement, laughter, and play.",
  },
  {
    key: "future-ballers.about.paragraph1",
    page: "Future Ballers",
    label: "About — paragraph 1",
    type: "textarea",
    maxLength: 500,
    default:
      "Future Ballers is our entry-level program built entirely around the 4 to 6 age group. Sessions are playful, movement-rich, and structured around what young children actually enjoy, games, challenges, and celebrating small wins. Coaches keep group sizes small so every child gets hands-on attention and plenty of encouragement, not just instructions from the sideline.",
  },
  {
    key: "future-ballers.about.paragraph2",
    page: "Future Ballers",
    label: "About — paragraph 2",
    type: "textarea",
    maxLength: 400,
    default:
      "No prior experience needed. No pressure. Just a great first introduction to basketball and a sport they'll want to come back to every week, with each session designed to build a little more confidence and coordination than the last.",
  },
  {
    key: "future-ballers.cta.subtext",
    page: "Future Ballers",
    label: "Closing CTA subtext",
    type: "textarea",
    maxLength: 200,
    default: "Book a free trial session, no commitment, just a brilliant first experience of basketball.",
  },

  // ---- Program: Mini Basket ----
  {
    key: "mini-basket.hero.subtext",
    page: "Mini Basket",
    label: "Hero subtext",
    type: "textarea",
    maxLength: 260,
    default: "A structured basketball program for kids ages 7 to 10 in Dubai. Real skills, real drills, and a real love for the game, in a low-pressure, high-energy environment.",
  },
  {
    key: "mini-basket.about.paragraph1",
    page: "Mini Basket",
    label: "About — paragraph 1",
    type: "textarea",
    maxLength: 500,
    default:
      "Mini Basket bridges the gap between pure play and structured training. Players aged 7 to 10 are ready to absorb real technique, and this program delivers it in a way that keeps them coming back for more. Coaches use small-group formats so every child gets individual correction and feedback, not just group instruction.",
  },
  {
    key: "mini-basket.about.paragraph2",
    page: "Mini Basket",
    label: "About — paragraph 2",
    type: "textarea",
    maxLength: 500,
    default:
      "Coaches introduce ball handling, passing, shooting, and the basics of basketball rules through engaging drills and short-sided games. Players progress through skills at their own pace, building from close-range form shooting to full 3v3 game situations as confidence grows. The goal: leave every session better than you arrived.",
  },
  {
    key: "mini-basket.cta.subtext",
    page: "Mini Basket",
    label: "Closing CTA subtext",
    type: "textarea",
    maxLength: 200,
    default: "One free trial session. No strings attached. See exactly how we coach and why kids love it.",
  },

  // ---- Program: Youth Academy ----
  {
    key: "youth-academy.hero.subtext",
    page: "Youth Academy",
    label: "Hero subtext",
    type: "textarea",
    maxLength: 260,
    default: "A competitive basketball program for teens ages 11 to 18 in Dubai, built to develop technical mastery, tactical intelligence, and the mindset to perform under pressure.",
  },
  {
    key: "youth-academy.about.paragraph1",
    page: "Youth Academy",
    label: "About — paragraph 1",
    type: "textarea",
    maxLength: 700,
    default:
      "Youth Academy is where basketball becomes a genuine pursuit, not just a class. Players aged 11 to 18 in Dubai who are ready for more, more intensity, more tactical depth, and more competitive challenge, will find all three here, rooted in the Valencia Basket methodology from Spain. Coaches trained in this system bring a proven European approach to player development, one built on discipline, repetition, and game intelligence rather than shortcuts.",
  },
  {
    key: "youth-academy.about.paragraph2",
    page: "Youth Academy",
    label: "About — paragraph 2",
    type: "textarea",
    maxLength: 700,
    default:
      "Sessions blend high-repetition technical work with tactical concepts, progressing into competition preparation and league play as players advance. This is a program designed for the long game: many players use it as a genuine pathway toward higher-level basketball, whether that means school and college teams, national-level trials, or simply becoming the best player they can be. Top performers are considered for invitation to the Elite/Select program, Valencia Basket UAE's most competitive tier.",
  },
  {
    key: "youth-academy.cta.subtext",
    page: "Youth Academy",
    label: "Closing CTA subtext",
    type: "textarea",
    maxLength: 200,
    default: "Book a free trial session and let our coaches assess exactly where your game is, and where it can go.",
  },

  // ---- Program: Private Training ----
  {
    key: "private-training.hero.subtext",
    page: "Private Training",
    label: "Hero subtext",
    type: "textarea",
    maxLength: 220,
    default: "Accelerate your development with focused, personalized instruction from our expert staff.",
  },
  {
    key: "private-training.about.paragraph",
    page: "Private Training",
    label: "About paragraph",
    type: "textarea",
    maxLength: 400,
    default:
      "While team practice teaches concepts and systems, private training builds the individual tools needed to execute them. Our 1-on-1 and small group sessions are designed to isolate weaknesses and turn them into strengths through high-volume repetition and immediate feedback.",
  },
  {
    key: "private-training.format.description",
    page: "Private Training",
    label: "\"Choose Your Format\" subtext",
    type: "textarea",
    maxLength: 220,
    default: "Every session is tailored to the player. Select the ratio that fits your goals and budget, all formats are available across our weekly slots.",
  },
  {
    key: "private-training.availability.description",
    page: "Private Training",
    label: "\"Weekly Availability\" subtext",
    type: "textarea",
    maxLength: 220,
    default: "Private training slots are limited and booked on a first-come, first-served basis. Regular weekly slots can be reserved for the term.",
  },
  {
    key: "private-training.schedule.weekdays",
    page: "Private Training",
    label: "Weekdays (Sun - Thu) hours",
    type: "text",
    maxLength: 40,
    default: "2:00 PM - 4:30 PM",
  },
  {
    key: "private-training.schedule.saturday",
    page: "Private Training",
    label: "Saturday hours",
    type: "text",
    maxLength: 40,
    default: "8:00 AM - 12:00 PM",
  },

  // ---- Blog (listing page only — individual posts are managed in the Blog tab) ----
  {
    key: "blog.hero.subtext",
    page: "Blog",
    label: "Hero subtext",
    type: "textarea",
    maxLength: 220,
    default: "Practical basketball insight, academy stories, and guidance for players and families in Dubai.",
  },

  // ---- Staff (Coaches page) ----
  {
    key: "staff.hero.subtext",
    page: "Staff",
    label: "Hero subtext",
    type: "textarea",
    maxLength: 220,
    default: "FIBA-certified and Spanish-licensed coaches with experience at the highest levels of European basketball, dedicated to your child's growth.",
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
