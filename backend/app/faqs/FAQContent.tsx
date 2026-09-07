"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: string;
  q: string;
  a: React.ReactNode;
}

interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

const categories: FAQCategory[] = [
  {
    id: "about",
    title: "About the Academy",
    items: [
      {
        id: "what-is-vba",
        q: "What does Valencia Basket Academy UAE do?",
        a: "Valencia Basket Academy UAE is a youth basketball academy in Dubai for children aged 4 to 18, training at AllSports Arena in Al Quoz. We run three age-based programs designed around how young players actually develop, not a one-size-fits-all class.",
      },
      {
        id: "spain-connection",
        q: "Is Valencia Basket Academy UAE officially connected to Valencia Basket in Spain?",
        a: (
          <>
            Yes. Valencia Basket Academy UAE operates as an official academy partner of Valencia Basket, one
            of Spain&apos;s leading professional basketball clubs.{" "}
            <Link href="/methodology" className="text-primary hover:underline font-medium">
              Read more about our methodology and Spain connection →
            </Link>
          </>
        ),
      },
      {
        id: "location",
        q: "Where are you located?",
        a: (
          <>
            We train at AllSports Arena, Al Quoz, Dubai.{" "}
            <Link href="/facilities" className="text-primary hover:underline font-medium">
              Click for full directions and details →
            </Link>
          </>
        ),
      },
    ],
  },
  {
    id: "programs",
    title: "Programs and Age Groups",
    items: [
      {
        id: "programs-offered",
        q: "What programs do you offer, and what age is each for?",
        a: (
          <>
            <p className="mb-3">We offer three age-based programs:</p>
            <ol className="list-decimal list-outside ml-5 space-y-1 mb-3">
              <li>Future Ballers for ages 4 to 6</li>
              <li>Mini Basket for ages 7 to 10</li>
              <li>Youth Academy for ages 11 to 18</li>
            </ol>
            <p className="mb-3">
              Each program uses age-appropriate coaching, so players are grouped with peers at a
              similar stage of development.
            </p>
            <p>
              We also have a Private Training program where a player can further enhance their
              skills. This program offers smaller batch training as well as 1-on-1 sessions.
            </p>
          </>
        ),
      },
      {
        id: "beginners",
        q: "My child has never played basketball before — can they still join?",
        a: "Yes. All three programs are built to take in complete beginners alongside more experienced players. Coaches adjust drills and pacing to each child's current ability, so no prior experience is needed to start.",
      },
      {
        id: "competitive",
        q: "Do you offer a competitive or selection-based track?",
        a: "Yes. Alongside our three core programs, we run an Elite/Select tier for players ready for a higher level of competition. Entry is invitation-only, based on tryouts, and coaches invite players they feel are ready.",
      },
      {
        id: "evaluation",
        q: "What will players be evaluated on?",
        a: "Players are assessed according to Valencia Basket's methodology and curriculum developed in Spain. The assessment covers their understanding of the game, shooting, read-and-react ability, ball handling, court vision, decision-making, and their understanding of the Spanish style and system of play.",
      },
      {
        id: "season",
        q: "When does the season start and end?",
        a: "The season runs in three terms: Term 1 (September to December), Term 2 (January to March), and Term 3 (April to June).",
      },
    ],
  },
  {
    id: "registration",
    title: "Trials, Registration and Fees",
    items: [
      {
        id: "book-trial",
        q: "How do I book a free trial?",
        a: "Fill in the Book a Free Trial form on our website with your child's name, age group, and your contact details, or message us directly on WhatsApp. We'll confirm a trial session at AllSports Arena.",
      },
      {
        id: "documents",
        q: "What documents do I need to register?",
        a: "We require a copy of the participant's passport or Emirates ID so that the necessary documents are available if the player participates in tournaments or represents the country. A medical form may also be requested when required by tournament organisers.",
      },
      {
        id: "refund",
        q: "What is your refund policy?",
        a: "Refunds may be provided depending on the participant's circumstances and the reason given. Where approved, the refund is issued as a cash refund rather than a credit note.",
      },
      {
        id: "discounts",
        q: "Does Valencia Basket Academy UAE offer any discounts?",
        a: "Yes, we offer a sibling discount for the second child. We also offer a specific discount for families who register for all three terms. However, we do not offer financial assistance.",
      },
    ],
  },
  {
    id: "schedule",
    title: "Schedule and Location",
    items: [
      {
        id: "training-times",
        q: "What are your training days and times?",
        a: (
          <>
            Our training sessions run Monday to Friday in the evenings.{" "}
            <a href="https://wa.me/971544386838" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              Contact us on WhatsApp
            </a>{" "}
            to get an update on your ideal batch timing.
          </>
        ),
      },
      {
        id: "ramadan",
        q: "Does the schedule change during Ramadan or public holidays?",
        a: "Yes. During Ramadan, training times may shift to accommodate Iftar. Sessions falling on national or religious holidays are adjusted in advance, and families are notified ahead of any change.",
      },
      {
        id: "ratio",
        q: "What is the coach to player ratio?",
        a: "There are at least two coaches, with a maximum of 15 players per group.",
      },
    ],
  },
  {
    id: "health",
    title: "Attendance, Health and Safety",
    items: [
      {
        id: "missed-session",
        q: "What if my child misses a session — is a make-up class available?",
        a: "There are no make-up sessions provided when a player misses a class.",
      },
      {
        id: "medical-clearance",
        q: "Does my child need any fitness or medical clearance to join?",
        a: "Parents/guardians confirm at registration that their child is physically fit to take part in basketball training, and are asked to disclose any medical condition or special requirement relevant to safe participation.",
      },
      {
        id: "insurance",
        q: "Is insurance provided for participants?",
        a: "Valencia Basket Academy UAE does not currently provide participant accident or injury insurance. Participation is therefore subject to the family's own responsibility and insurance arrangements.",
      },
      {
        id: "kit",
        q: "What should my child bring to training?",
        a: "Players must bring their official academy kit, suitable basketball shoes, and a water bottle.",
      },
      {
        id: "photos",
        q: "Do you take photos or videos of participants during training?",
        a: "We may photograph or film sessions and events for use on our website and social media, only where a parent or guardian has given consent. If you'd prefer your child not be included, you can let us know at registration or at any time afterward.",
      },
    ],
  },
  {
    id: "parents",
    title: "Parents and Communication",
    items: [
      {
        id: "watching",
        q: "Can parents watch training sessions?",
        a: "Yes, parents can observe from the designated viewing area during the training sessions.",
      },
      {
        id: "updates",
        q: "How will I be updated about schedule changes or my child's progress?",
        a: "Parents receive a detailed progress report every three months. The report outlines the player's strengths, positive development, areas requiring improvement, and technical progress.",
      },
      {
        id: "contact",
        q: "How do I get in touch with the academy?",
        a: (
          <>
            You can reach us by call or WhatsApp at{" "}
            <a href="tel:+971544386838" className="text-primary hover:underline font-medium">
              +971 54 438 6838
            </a>
            , or through the contact form on our website. You can also email us at{" "}
            <a href="mailto:info@valenciabasket.ae" className="text-primary hover:underline font-medium">
              info@valenciabasket.ae
            </a>
            .
          </>
        ),
      },
    ],
  },
];

function AccordionItem({ item, isOpen, onToggle }: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full text-left flex items-center justify-between gap-4 px-4 py-5 hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-bold text-gray-900 text-base leading-snug pr-2">{item.q}</span>
        <ChevronDown
          className={`shrink-0 h-5 w-5 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-6 pt-1">
          <div className="text-gray-600 leading-relaxed text-sm md:text-base">
            {item.a}
          </div>
        </div>
      )}
    </div>
  );
}

export function FAQContent() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-14">
      {categories.map((cat) => (
        <section key={cat.id}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-primary shrink-0" />
            <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">
              {cat.title}
            </h2>
          </div>
          <div className="border border-gray-200 rounded-none divide-y divide-gray-100">
            {cat.items.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                isOpen={openItems.has(item.id)}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
