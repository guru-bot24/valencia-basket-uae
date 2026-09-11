// PLACEHOLDERS ON THIS PAGE:
// [PLACEHOLDER: session length — confirm] — e.g. "60 minutes"
// [PLACEHOLDER: coach-to-player ratio — confirm] — e.g. "1:10"
// [PLACEHOLDER: weekly frequency — confirm] — currently shown as Mon/Wed from /programs, verify if correct

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Target, Users, Shield, Check } from "lucide-react";
import { buildPageMetadata, getAltResolver } from "@/lib/seo/resolve";
import { getStructuredData } from "@/lib/seo/structuredDataResolve";
import { StructuredData } from "@/components/seo/StructuredData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/programs/mini-basket");
}

const pillars = [
  {
    icon: Zap,
    title: "Ball Handling",
    points: ["Basic dribbling mechanics", "Stationary ball control", "Simple crossover introduction", "Dribble-and-move drills"],
  },
  {
    icon: Target,
    title: "Shooting Basics",
    points: ["Form shooting close-range", "Proper hand placement", "Arc and follow-through", "Free throw introduction"],
  },
  {
    icon: Users,
    title: "Passing & Teamwork",
    points: ["Chest & bounce pass technique", "Two-hand receiving", "Partner passing drills", "3v3 game formats"],
  },
  {
    icon: Shield,
    title: "Rules & Game IQ",
    points: ["Basic court awareness", "Scoring system", "Out-of-bounds rules", "Reading the play"],
  },
];

const focusAreas = [
  { icon: Zap,    title: "Ball Handling", desc: "Dribbling, catching, and passing drills that build the foundational mechanics every basketball player needs." },
  { icon: Target, title: "Shooting Intro", desc: "Form shooting close-range before extending the range as confidence and technique grow." },
  { icon: Users,  title: "Teamwork",       desc: "Small-sided games teach sharing the ball, communication, and the joy of playing together as a unit." },
  { icon: Shield, title: "Game Rules",     desc: "Learning the basics, including court awareness, scoring, and what it means to play within the rules." },
];

export default async function MiniBasket() {
  const alt = await getAltResolver();
  const schema = await getStructuredData("/programs/mini-basket", "Mini Basket");
  return (
    <>
      <StructuredData data={schema} />
      {/* ── HERO — Lever 2: smaller, more subtle circles ── */}
      <div className="bg-black text-white py-24 relative overflow-hidden">
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-primary/8 pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-primary/5 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <span className="inline-block rounded-full bg-primary text-white px-4 py-1.5 font-bold uppercase text-xs tracking-widest mb-6">
            Ages 7–10 Years
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            Mini <span className="text-primary">Basket</span> Program
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            A structured basketball program for kids ages 7 to 10 in Dubai. Real skills, real drills, and a real love for the game, in a low-pressure, high-energy environment.
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

      {/* ── CONTENT LEFT / IMAGE RIGHT — Lever 1: flipped from Future Ballers ── */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* content LEFT — mobile: stacks second; desktop: left */}
            <div className="order-2 lg:order-1">
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">About the Program</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                Where Skills <span className="text-primary">Begin.</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                Mini Basket bridges the gap between pure play and structured training. Players aged 7 to 10 are ready to absorb real technique, and this program delivers it in a way that keeps them coming back for more. Coaches use small-group formats so every child gets individual correction and feedback, not just group instruction.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                Coaches introduce ball handling, passing, shooting, and the basics of basketball rules through engaging drills and short-sided games. Players progress through skills at their own pace, building from close-range form shooting to full 3v3 game situations as confidence grows. The goal: leave every session better than you arrived.
              </p>
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
            {/* image RIGHT — mobile: stacks first */}
            <div className="order-1 lg:order-2 relative">
              <div className="absolute -inset-4 border-2 border-primary/30 z-0 translate-x-4 translate-y-4" />
              <div className="relative z-10 aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/youth-team-small.jpg"
                  alt={alt("mini-basket.hero")}
                  fill
                  className="object-cover shadow-2xl"
                  priority
                />
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

      {/* ── FOCUS AREAS — standard gray-50, standard p-8 / w-14 icons ── */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <span className="inline-block rounded-full bg-primary text-white px-4 py-1.5 font-bold uppercase text-xs tracking-widest mb-4">
              What They Learn
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Focus Areas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {focusAreas.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-200 p-8 flex flex-col items-center text-center gap-4 hover:border-primary transition-colors">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-black uppercase text-lg tracking-tight">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SESSION — image RIGHT / steps LEFT (Lever 1: mirrors intro's content-left/image-right flip) ── */}
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
                  { step: "01", title: "Dynamic Warm-Up",   desc: "Ball-handling and movement drills that raise energy and set the tone for a focused, productive session." },
                  { step: "02", title: "Skill Block",        desc: "Each session targets one technical skill, such as dribbling, passing, footwork, or shooting, with coached repetition." },
                  { step: "03", title: "Small-Sided Games",  desc: "3v3 and 4v4 formats where the session's skill is tested in real game situations with coach guidance." },
                  { step: "04", title: "Team Review",        desc: "Coaches highlight positive moments, reinforce the session's learning, and build team identity before closing." },
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
              <Image src="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/youth-team-small.jpg" alt={alt("mini-basket.session")} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary py-20 text-white text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Start Their Journey
          </h2>
          <p className="text-xl mb-10 max-w-xl mx-auto opacity-90">
            One free trial session. No strings attached. See exactly how we coach and why kids love it.
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
