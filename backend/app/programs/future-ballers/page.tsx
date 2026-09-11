// PLACEHOLDERS ON THIS PAGE:
// [PLACEHOLDER: session length — confirm] — e.g. "45 minutes"
// [PLACEHOLDER: coach-to-player ratio — confirm] — e.g. "1:8"
// [PLACEHOLDER: weekly frequency — confirm] — currently shown as Mon/Wed from /programs, verify if correct

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Heart, Zap, Users, Check } from "lucide-react";
import { buildPageMetadata, getAltResolver } from "@/lib/seo/resolve";
import { getStructuredData } from "@/lib/seo/structuredDataResolve";
import { StructuredData } from "@/components/seo/StructuredData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/programs/future-ballers");
}

const pillars = [
  {
    icon: Zap,
    title: "Movement & Coordination",
    points: ["Running & jumping drills", "Balance and body awareness", "Hand-eye coordination games", "Spatial awareness activities"],
  },
  {
    icon: Star,
    title: "Confidence Building",
    points: ["Celebrating every effort", "Low-pressure environment", "Positive reinforcement", "Personal-best targets"],
  },
  {
    icon: Heart,
    title: "Fun-First Approach",
    points: ["Games over repetitive drills", "Laughter-led sessions", "Excitement on arrival", "A love for the ball"],
  },
  {
    icon: Users,
    title: "Team & Social Play",
    points: ["Taking turns and sharing", "Listening to the coach", "Celebrating teammates", "Partner and group games"],
  },
];

const focusAreas = [
  { icon: Zap,   title: "Motor Skills",  desc: "Running, jumping, and throwing drills that develop fundamental physical coordination." },
  { icon: Heart, title: "Confidence",    desc: "Low-pressure, encouraging environment where every child succeeds and grows." },
  { icon: Star,  title: "Ball Feel",     desc: "First contact with a basketball, dribbling, rolling, catching at a pace that's just right." },
  { icon: Users, title: "Social Play",   desc: "Learning to share, take turns, and play alongside others. Teamwork begins here." },
];

export default async function FutureBallers() {
  const alt = await getAltResolver();
  const schema = await getStructuredData("/programs/future-ballers", "Future Ballers");
  return (
    <>
      <StructuredData data={schema} />
      {/* ── HERO — Lever 2: large orange circles, most playful/airy ── */}
      <div className="bg-black text-white py-24 relative overflow-hidden">
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/15 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-primary/5 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <span className="inline-block rounded-full bg-primary text-white px-4 py-1.5 font-bold uppercase text-xs tracking-widest mb-6">
            Ages 4–6 Years
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            Future <span className="text-primary">Ballers</span> Program
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            The perfect first basketball program for kids, ages 4 to 6, in Dubai. Where tiny hands meet big dreams, through movement, laughter, and play.
          </p>
          <div className="flex justify-center">
            <Link href="/#book-trial">
              <Button size="lg" className="uppercase font-bold tracking-wider rounded-none h-14 px-10 text-base">
                Book a Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── IMAGE LEFT / CONTENT RIGHT — Lever 1 ── */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* image LEFT — mobile: stacks first */}
            <div className="relative order-1">
              <div className="absolute -inset-4 border-2 border-primary/30 z-0 translate-x-4 translate-y-4" />
              <div className="relative z-10 aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/mini-basket-team.jpg"
                  alt={alt("future-ballers.hero")}
                  fill
                  className="object-cover shadow-2xl"
                  priority
                />
              </div>
            </div>
            {/* content RIGHT — mobile: stacks second */}
            <div className="order-2">
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">About the Program</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                First Steps. <span className="text-primary">Big Fun.</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Future Ballers is our entry-level program built entirely around the 4 to 6 age group. Sessions are playful, movement-rich, and structured around what young children actually enjoy, games, challenges, and celebrating small wins. Coaches keep group sizes small so every child gets hands-on attention and plenty of encouragement, not just instructions from the sideline.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                No prior experience needed. No pressure. Just a great first introduction to basketball and a sport they&apos;ll want to come back to every week, with each session designed to build a little more confidence and coordination than the last.
              </p>
              {/* Lever 2: more padding, orange borders */}
              <div className="grid grid-cols-2 gap-4">                <div className="bg-gray-50 border-l-4 border-primary px-4 py-3">
                  <span className="block text-xs font-bold uppercase text-gray-400 mb-1">Session Length</span>
                  <span className="font-bold text-gray-900">90 mins</span>
                </div>
                
                {/* HIDDEN — un-hide and replace value once coach-to-player ratio is confirmed */}
                {false && (
                  <div className="bg-gray-50 border-l-4 border-primary px-4 py-3">
                    <span className="block text-xs font-bold uppercase text-gray-400 mb-1">Coach : Player Ratio</span>
                    <span className="font-bold text-gray-900">[PLACEHOLDER: coach-to-player ratio — confirm]</span>
                  </div>
                )}
                <div className="bg-gray-50 border-l-4 border-primary px-4 py-3">
                  <span className="block text-xs font-bold uppercase text-gray-400 mb-1">Venue</span>
                  <span className="font-bold text-gray-900">AllSports Arena, Al Quoz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW WE DEVELOP PLAYERS ── */}
      <section className="bg-neutral-900 text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="inline-block rounded-full bg-primary text-white px-4 py-1.5 font-bold uppercase text-xs tracking-widest mb-4">
              Training Pillars
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              How We Develop Players
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map(({ icon: Icon, title, points }) => (
              <div key={title} className="bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-all duration-300">
                <div className="w-12 h-12 bg-primary/15 flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-black uppercase tracking-tight text-base mb-4">{title}</h3>
                <ul className="space-y-2">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-gray-400 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOCUS AREAS — Lever 2: bigger cards (p-10, w-16 icons), more airy ── */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-primary text-white px-4 py-1.5 font-bold uppercase text-xs tracking-widest mb-4">
              What They Learn
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Focus Areas</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Every session is built around what kids aged 4 to 6 actually enjoy, so they leave wanting to come back.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {focusAreas.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-primary/20 p-10 flex flex-col items-center text-center gap-5 hover:border-primary transition-colors shadow-sm">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-black uppercase text-lg tracking-tight">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SESSION — steps LEFT / image RIGHT (Lever 1: internal flip for variety) ── */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* steps LEFT — mobile: stacks first */}
            <div className="order-1">
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Session Structure</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
                What a Session Looks Like
              </h2>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Warm-Up Games",           desc: "Active movement games to get hearts pumping and muscles ready, every child arrives excited." },
                  { step: "02", title: "Skill Circuit",            desc: "Short, focused stations introducing one concept at a time: dribbling, passing, or shooting basics." },
                  { step: "03", title: "Coached Play",             desc: "Small-sided games where coaches apply the skill in a fun, guided context." },
                  { step: "04", title: "Cool-Down & Celebration",  desc: "A calm close with a fun team ritual, every child leaves feeling proud and energised." },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-5">
                    <span className="text-primary font-black text-2xl leading-none shrink-0 w-8">{step}</span>
                    <div>
                      <h4 className="font-bold uppercase tracking-wide mb-1">{title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* image RIGHT — mobile: stacks second */}
            <div className="order-2 aspect-[3/4] w-full relative">
              <Image src="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/mini-basket-team.jpg" alt={alt("future-ballers.session")} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — Lever 2: most spacious (py-24) ── */}
      <section className="bg-primary py-24 text-white text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Ready to See Them Smile?
          </h2>
          <p className="text-xl mb-10 max-w-xl mx-auto opacity-90">
            Book a free trial session, no commitment, just a brilliant first experience of basketball.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#book-trial">
              <Button size="lg" className="bg-black text-white hover:bg-white hover:text-primary uppercase font-bold tracking-wider rounded-none h-14 px-10 text-base border-0">
                Book a Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary uppercase font-bold tracking-wider rounded-none h-14 px-10 text-base">
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
