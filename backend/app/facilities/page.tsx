import {
  MapPin,
  ExternalLink,
  Wind,
  Users,
  DoorOpen,
  Car,
  Package,
  HeartPulse,
  Dumbbell,
  Camera,
  CircleDot,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ArenaCarousel from "@/components/facilities/ArenaCarousel";
import type { Metadata } from "next";
import { buildPageMetadata, getAltResolver } from "@/lib/seo/resolve";
import { getStructuredData } from "@/lib/seo/structuredDataResolve";
import { StructuredData } from "@/components/seo/StructuredData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/facilities");
}

// TEMPORARY: "Inside the Arena" photo gallery is hidden until real arena photos
// arrive (photo shoot expected early August 2026). Flip to true to re-enable it.
const SHOW_ARENA_GALLERY = false;

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=AllSports+Arena+Al+Quoz+Dubai";
const MAPS_EMBED_URL = "https://www.google.com/maps?q=AllSports+Arena+Al+Quoz+Dubai&output=embed";

const features = [
  { Icon: CircleDot, label: "FIBA-Standard Indoor Courts" },
  { Icon: Wind, label: "Air-Conditioned & Climate-Controlled" },
  { Icon: Users, label: "Parent Viewing Area" },
  { Icon: DoorOpen, label: "Changing Rooms" },
  { Icon: Car, label: "Free On-Site Parking" },
  { Icon: Package, label: "Equipment Provided" },
  { Icon: HeartPulse, label: "First-Aid & Safety" },
  { Icon: Dumbbell, label: "Warm-Up & Conditioning Space" },
];

// TODO: confirm real travel times with the academy before publishing final numbers.
const travelTimes = [
  { zone: "Dubai Marina", minutes: 20 },
  { zone: "JLT", minutes: 20 },
  { zone: "Downtown", minutes: 15 },
  { zone: "New Dubai", minutes: 20 },
  { zone: "Arabian Ranches", minutes: 20 },
  { zone: "Mirdif", minutes: 25 },
];

/** On-brand placeholder tile for venue/session photos — replace with real images later. */
function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center"
      aria-label={`${label}, photo coming soon`}
    >
      {/* Brand pattern: diagonal orange lines */}
      <svg className="absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
        <defs>
          <pattern id="brand-stripes" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="4" height="24" fill="#FF6C0E" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#brand-stripes)" />
      </svg>
      <div className="relative z-10 flex flex-col items-center gap-2 text-center px-4">
        <Camera className="h-7 w-7 text-primary" aria-hidden="true" />
        <span className="text-white/70 uppercase text-[11px] font-bold tracking-widest">{label}</span>
      </div>
    </div>
  );
}

export default async function Facilities() {
  const alt = await getAltResolver();
  const schema = await getStructuredData("/facilities", "Facilities");
  const arenaAlts = {
    "facilities.arena-render": alt("facilities.arena-render"),
    "facilities.arena-courts": alt("facilities.arena-courts"),
  };
  return (
    <>
      <StructuredData data={schema} />
      {/* ============ HERO (matches Events & Camps hero) ============ */}
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="inline-block rounded-full bg-primary text-white px-4 py-1.5 font-bold uppercase text-xs tracking-widest mb-6" data-testid="badge-main-venue">
            Our Home Venue: Al Quoz, Dubai
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6" data-testid="text-facilities-title">
            AllSports Arena
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            One dedicated home from August 2026.
          </p>
        </div>
      </div>

      {/* ============ ARENA SHOWCASE CAROUSEL ============ */}
      {/* To add more images: open components/facilities/ArenaCarousel.tsx and add entries to the SLIDES array */}
      <div className="container mx-auto px-4 md:px-6 pt-8 md:pt-12">
        <ArenaCarousel altOverrides={arenaAlts} />
      </div>

      {/* ============ WHAT'S INSIDE ============ */}
      <div className="container mx-auto px-4 md:px-6 py-20">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-center">What&apos;s Inside</h2>
        <p className="text-gray-500 text-center max-w-2xl mx-auto mb-12">
          A professional, purpose-built environment for every session.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map(({ Icon, label }) => (
            <div
              key={label}
              className="border border-gray-200 bg-white p-6 flex flex-col items-center text-center gap-4 hover:border-primary transition-colors"
              data-testid={`tile-feature-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            >
              <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
              <span className="font-bold uppercase text-xs md:text-sm tracking-wider text-gray-800">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============ TRAVEL TIME BAND ============ */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-3">
            Under 25 Minutes From Most of Dubai
          </h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
            Al Quoz sits at the crossroads of the city, an easy drive from wherever you are.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {travelTimes.map(({ zone, minutes }) => (
              <span
                key={zone}
                className="border border-white/20 bg-white/5 px-5 py-2.5 uppercase text-xs md:text-sm font-bold tracking-wider"
                data-testid={`chip-travel-${zone.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              >
                {zone} <span className="text-primary ml-1">~{minutes} min</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============ MAP ============ */}
      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="aspect-video lg:aspect-[4/3] w-full overflow-hidden border border-gray-200 shadow-xl">
            <iframe
              src={MAPS_EMBED_URL}
              title="AllSports Arena on Google Maps"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm mb-4">
              <MapPin className="h-4 w-4" /> Getting Here
            </div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">Find Us in Al Quoz</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              AllSports Arena is on Latifa Bint Hamdan Street, Al Quoz Industrial First, minutes from Sheikh Zayed Road
              and Al Khail Road, with easy access from both sides of the city.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Free parking is available on site, right by the entrance.
            </p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open AllSports Arena in Google Maps (opens in a new tab)"
              data-testid="link-open-maps"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 font-bold uppercase tracking-wider text-sm hover:bg-black transition-colors"
            >
              Open in Google Maps <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* ============ WHY THIS VENUE ============ */}
      <div className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">One Home, One Standard</h2>
          <p className="text-lg md:text-xl leading-relaxed text-white/90">
            From August 2026, every Valencia Basket Academy UAE session takes place under one roof, one consistent,
            professional training base built around the same standards our players experience at L&apos;Alqueria del
            Basket in Valencia. Same courts, same coaches, same methodology, every week.
          </p>
        </div>
      </div>

      {/* ============ PHOTO GALLERY STRIP (TEMPORARILY HIDDEN) ============
          Hidden until real arena photos arrive (photo shoot expected early August 2026).
          To re-enable: set SHOW_ARENA_GALLERY to true at the top of this file,
          then replace each PhotoPlaceholder with a real <Image> of the venue/sessions. */}
      {SHOW_ARENA_GALLERY && (
        <div className="container mx-auto px-4 md:px-6 py-20">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-10 text-center">Inside the Arena</h2>
          {/* PHOTO PLACEHOLDERS: replace each PhotoPlaceholder below with a real <Image> of the venue/sessions when photos are ready */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <PhotoPlaceholder label="Main Court" />
            <PhotoPlaceholder label="Training Session" />
            <PhotoPlaceholder label="Parent Viewing Area" />
            <PhotoPlaceholder label="Changing Rooms" />
            <PhotoPlaceholder label="Arena Entrance" />
            <PhotoPlaceholder label="Team Huddle" />
          </div>
        </div>
      )}

      {/* ============ CLOSING CTA ============ */}
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Come See It Yourself</h2>
          <p className="text-xl text-gray-400 max-w-xl mx-auto mb-10">
            Book a free trial session and experience the new home of Valencia Basket Academy UAE.
          </p>
          <Link
            href="/#book-trial"
            data-testid="button-facilities-cta"
            className="inline-block bg-primary text-white px-10 py-4 font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
          >
            Book a Free Trial
          </Link>
        </div>
      </div>
    </>
  );
}
