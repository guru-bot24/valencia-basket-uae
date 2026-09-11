import { SectionHeader } from "@/components/shared/SectionHeader";
import { Zap, Target, Users, ArrowRight, Shield, Clock, Crosshair, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { buildPageMetadata, getAltResolver } from "@/lib/seo/resolve";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/methodology");
}

export default async function Methodology() {
  const alt = await getAltResolver();
  const trainingMethods = [
    {
      number: "01",
      title: "0v0 Learning",
      desc: "No defender, so players focus entirely on technique and execution. Players build confidence and mechanical precision without pressure.",
    },
    {
      number: "02",
      title: "Conditioned Drills",
      desc: "Defenders or attackers operate with specific handicaps depending on the objective, creating targeted learning environments.",
    },
    {
      number: "03",
      title: "Real 1v1 Situations",
      desc: "Full-speed game situations where improvement and learning can be clearly applied and observed in a competitive context.",
    },
  ];

  const tacticalPrinciples = [
    {
      icon: Zap,
      title: "Play Fast",
      desc: "High pace in running, passing, penetration, and 1v1 situations. Modern professional basketball, including the EuroLeague and NBA, is becoming faster and more free-flowing. Playing at high tempo is fundamental to our identity.",
    },
    {
      icon: Crosshair,
      title: "Master Spacing",
      desc: "Knowing where the space is, why it exists, and how to move without the ball to help the ball-handler gain advantages. We work extensively with 2v2 and 3v3 situations to improve understanding of space and off-ball movement.",
    },
    {
      icon: Target,
      title: "Long-Range Shooting",
      desc: "We encourage players to shoot when open and confident. When a shot is taken, we attack the offensive rebound with full commitment, giving ourselves as many chances as possible to score.",
    },
    {
      icon: TrendingUp,
      title: "Offensive Rebounding",
      desc: "Our final tactical rule is to always look for extra opportunities to attack the basket. Full commitment on every shot attempt to generate second chances.",
    },
  ];

  const developmentPrinciples = [
    {
      icon: Clock,
      title: "Technical Before Tactical",
      desc: "Younger players focus more on technical skills, while older players progressively work on tactical concepts. There is no sense in rushing tactical learning if players haven&apos;t developed ball-handling, shooting, finishing, or passing skills.",
    },
    {
      icon: Target,
      title: "Spacing Before Complexity",
      desc: "In tactical learning, spacing always comes first, teaching players how to cut and move without the ball. Only later do we introduce screens, hand-offs, and more complex actions. There is no perfect age; there is a process that must be respected.",
    },
    {
      icon: Users,
      title: "Team First, Always",
      desc: "Basketball is a team sport, so players must act like a team both on and off the court. Sharing the ball, competing together, and encouraging players to take actions and make decisions are key parts of our environment.",
    },
    {
      icon: Shield,
      title: "Compete With Purpose",
      desc: "Being competitive and giving maximum energy is non-negotiable. Winning is the result of good work, not the only objective. We compete, but never at the cost of player development or by rushing processes that may be harmful long-term.",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd path="/methodology" label="Methodology" />
      <div className="bg-black text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 -skew-x-12 translate-x-1/4" />
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">The Valencia Way</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">Our Methodology</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A proven system developed in Valencia, Spain, built on strong, non-negotiable human values that run through every stage of basketball learning and development.
          </p>
        </div>
      </div>

      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader
                title="Basketball Methodology"
                subtitle="How We Train"
                description="Our methodology is based on not rushing any part of a player&apos;s journey, whether technical or tactical. We fully respect individual learning rhythms, making sure that progress is real, solid, and long-lasting."
              />
              <p className="text-gray-600 leading-relaxed mt-6">
                Our approach is a mix of different training methods, designed to create a global and complete learning experience that connects all elements of the game. We don&apos;t just teach offensive or defensive techniques; we help players understand how and when to use them in real game situations, and most importantly, why.
              </p>
            </div>

            <div className="space-y-6">
              {trainingMethods.map((method) => (
                <div key={method.number} className="flex gap-6 group p-6 bg-gray-50 hover:bg-primary/5 border-l-4 border-transparent hover:border-primary transition-all duration-300">
                  <div className="font-black text-5xl text-gray-200 group-hover:text-primary transition-colors shrink-0">
                    {method.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase mb-2">{method.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{method.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-neutral-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeader
            title="Tactical Learning"
            subtitle="Our Philosophy"
            description="Our tactical philosophy is built around key principles that reflect how modern professional basketball is played at the highest level."
            centered
            dark
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {tacticalPrinciples.map((principle, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-8 hover:border-primary/50 transition-all duration-300 group">
                <div className="h-14 w-14 bg-primary/10 flex items-center justify-center rounded-sm text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <principle.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black uppercase mb-4">{principle.title}</h3>
                <p className="text-gray-400 leading-relaxed">{principle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/methodology.jpeg"
                  alt={alt("methodology.spain")}
                  fill
                  className="object-cover transition-all duration-700 shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-white px-6 py-3 font-black uppercase text-sm tracking-wider z-10">
                  Long-Term Vision
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <SectionHeader
                title="Long-Term Development"
                subtitle="No Shortcuts"
                description="Our methodology avoids accelerating development in an artificial or rushed way. We believe in a process that must be respected at every stage."
              />

              <div className="space-y-8 mt-8">
                {developmentPrinciples.map((principle, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="h-10 w-10 bg-primary/10 flex items-center justify-center rounded-sm text-primary shrink-0 mt-1">
                      <principle.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold uppercase text-lg mb-1">{principle.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{principle.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-4">Experience the Methodology</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
            Book a free trial session and see our proven development system in action.
          </p>
          <Link href="/#book-trial">
            <Button size="lg" className="uppercase font-bold tracking-wider rounded-none bg-black text-white hover:bg-white hover:text-primary border-0 h-14 px-10">
              Book a Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
