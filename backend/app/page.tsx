import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/shared/TrustBar";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProgramCard } from "@/components/shared/ProgramCard";
import { BookTrialForm } from "@/components/home/BookTrialForm";
import { EventStrip } from "@/components/home/EventStrip";
import { SpainConnection } from "@/components/home/SpainConnection";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Zap, Crosshair, Target, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Reveal } from "@/components/shared/Reveal";
import { buildPageMetadata, getAltResolver } from "@/lib/seo/resolve";
import { getStructuredData } from "@/lib/seo/structuredDataResolve";
import { StructuredData } from "@/components/seo/StructuredData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/");
}

export default async function Home() {
  const alt = await getAltResolver();
  const schema = await getStructuredData("/");
  const pillars = [
    { icon: Zap, title: "Play Fast", desc: "High tempo in running, passing, and 1v1. Modern basketball demands speed and free-flowing play." },
    { icon: Crosshair, title: "Master Spacing", desc: "Understanding where space is, why it exists, and how off-ball movement creates advantages." },
    { icon: Target, title: "Long-Range Shooting", desc: "Shoot when open and confident. Attack the offensive rebound with full commitment." },
    { icon: Clock, title: "Long-Term Development", desc: "No shortcuts. Technical skills first, tactical concepts progressively. Respect the process." },
  ];

  const testimonials = [
    { text: "The discipline and structure at Valencia Basket UAE is unlike anything else in Dubai. My son has improved drastically.", author: "Sarah M.", role: "Parent of U12 Player" },
    { text: "Professional coaching that actually cares about long-term development, not just winning weekend games.", author: "James D.", role: "Parent of U16 Player" },
    { text: "Bringing the Spanish methodology here was a game changer. The attention to detail is world-class.", author: "Ahmed K.", role: "Elite Player" },
  ];

  return (
    <>
      <StructuredData data={schema} />
      <Hero imageAlt={alt("home.hero")} />

      <Reveal><TrustBar /></Reveal>

      {/* PROGRAMS SECTION */}
      <Reveal>
        <section id="programs" className="py-20 md:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeader 
              title="Player Pathway" 
              subtitle="Our Programs" 
              description="A comprehensive development structure for every stage of an athlete&apos;s journey."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProgramCard 
                title="Future Ballers (Kids)" 
                age="4-6 Years" 
                description="Playful first steps into basketball, building coordination, confidence, and fun."
                image="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/mini-basket-team.jpg"
                imageAlt={alt("home.future-ballers")}
                href="/programs/future-ballers"
              />
              <ProgramCard 
                title="Mini Basket" 
                age="7-10 Years" 
                description="Fun, fundamentals, and coordination. The perfect start to structured basketball."
                image="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/youth-team-small.jpg"
                imageAlt={alt("home.mini-basket")}
                href="/programs/mini-basket"
              />
              <ProgramCard 
                title="Youth Academy" 
                age="11-18 Years" 
                description="Technical mastery, tactical understanding, and competition preparation."
                image="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/youth-program.jpeg"
                imageAlt={alt("home.youth-academy")}
                href="/programs/youth-academy"
              />
              <ProgramCard 
                title="Elite / Select" 
                age="Invitation Only" 
                description="High-performance training for top-tier talent aiming for professional pathways."
                image="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/team-award.jpg" 
                imageAlt={alt("home.elite")}
                href="/programs#elite"
              />
              <ProgramCard 
                title="Private Training" 
                age="1-on-1" 
                description="Personalized attention to correct mechanics and accelerate growth."
                image="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/1v1-a.jpg"
                imageAlt={alt("home.private-training")}
                href="/programs/private-training"
              />
            </div>
          </div>
        </section>
      </Reveal>

      {/* METHODOLOGY SECTION */}
      <Reveal>
        <section className="py-20 md:py-32 bg-neutral-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 skew-x-12 transform translate-x-20" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionHeader 
                  title="The Valencia Methodology" 
                  subtitle="Why Us" 
                  description="A proven system developed in Valencia, Spain, helping players reach the professional level through a mix of training methods that connect all elements of the game."
                  dark
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
                  {pillars.map((pillar, idx) => (
                    <div key={idx} className="flex flex-col gap-3">
                      <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-sm text-primary">
                        <pillar.icon className="h-6 w-6" />
                      </div>
                      <h4 className="font-bold uppercase tracking-wide text-lg">{pillar.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{pillar.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10">
                  <Link href="/methodology">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black uppercase font-bold tracking-wider rounded-none px-8 h-12">
                      Explore Our Philosophy
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 border-2 border-primary/30 z-0 translate-x-4 translate-y-4" />
                <div className="relative z-10 w-full aspect-[4/3]">
                  <Image 
                    src="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/methodology.jpeg" 
                    alt={alt("home.methodology")} 
                    fill
                    className="object-cover transition-all duration-700 shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* MID-PAGE CTA */}
      <Reveal>
        <section className="py-14 bg-black">
          <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Ready to get started?</p>
              <h3 className="text-2xl md:text-3xl font-black uppercase text-white leading-tight">
                Book a free trial session
              </h3>
            </div>
            <Link href="#book-trial" className="shrink-0">
              <Button className="bg-primary hover:bg-orange-600 text-white uppercase font-bold tracking-wider rounded-none px-10 h-12 text-sm transition-colors">
                Book a Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </Reveal>

      {/* FACILITIES PREVIEW */}
      <Reveal>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <SectionHeader 
                title="World Class Facilities" 
                subtitle="Where We Train" 
                className="mb-0"
              />
              <Link href="/facilities">
                <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm hover:text-primary cursor-pointer transition-colors mb-2">
                  Explore Our Home Venue <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </div>
            <div className="relative w-full h-[500px] overflow-hidden group">
              <Image 
                src="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/allsports-arena-render.jpg" 
                alt={alt("home.arena")} 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
                <h3 className="text-3xl md:text-5xl font-black uppercase mb-4">AllSports Arena</h3>
                <p className="max-w-md text-lg text-gray-200 mb-6">
                  Our dedicated home in Al Quoz from August 2026, with FIBA-standard indoor courts, professional hoops, and a climate-controlled environment for optimal performance.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">FIBA Approved</span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">Air Conditioned</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* SPAIN CONNECTION — has its own scroll animation; no Reveal wrapper */}
      <SpainConnection />

      {/* TESTIMONIALS */}
      <Reveal>
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeader title="Community Stories" centered />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {testimonials.map((t, idx) => (
                <div key={idx} className="bg-gray-50 p-8 relative">
                  <div className="text-primary text-6xl font-serif absolute top-4 left-6 opacity-20">&quot;</div>
                  <p className="relative z-10 text-gray-700 italic text-lg mb-6 leading-relaxed">
                    {t.text}
                  </p>
                  <div>
                    <h5 className="font-bold uppercase text-sm">{t.author}</h5>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal><EventStrip /></Reveal>

      {/* BOOK TRIAL SECTION */}
      <Reveal>
        <section id="book-trial" className="py-20 md:py-32 bg-primary relative">
          <div className="absolute inset-0 bg-[url('https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/team-spirit.jpg')] bg-cover bg-center mix-blend-multiply opacity-20" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                  Start Your Journey Today
                </h2>
                <p className="text-xl md:text-2xl font-light opacity-90 mb-8 max-w-lg">
                  Book a free assessment session. Let our coaches evaluate your potential and place you in the right program.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    "Free skill assessment", 
                    "Meet the coaching staff", 
                    "Experience the methodology",
                    "No commitment required"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-lg font-medium">
                      <CheckCircle2 className="h-6 w-6 text-black" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <BookTrialForm />
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
