import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { buildPageMetadata, getAltResolver } from "@/lib/seo/resolve";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/programs");
}

export default async function Programs() {
  const alt = await getAltResolver();
  const programs = [
    {
      id: "future-ballers",
      title: "Future Ballers (Kids)",
      age: "4-6 Years",
      focus: "First Steps & Fun",
      desc: "The very first step into basketball. Playful, movement-rich sessions that build coordination, confidence, and a love for the ball.",
      schedule: "Mon/Wed 4:00 PM",
      features: ["Motor skill development", "Coordination & balance games", "First contact with the ball", "Fun-based drills"],
      image: "/images/mini-basket-team.jpg",
      imageKey: "programs.future-ballers",
      detailHref: "/programs/future-ballers",
    },
    {
      id: "mini",
      title: "Mini Basket",
      age: "7-10 Years",
      focus: "Fundamentals & Fun",
      desc: "The perfect introduction to structured basketball. We focus on coordination, basic ball handling, and falling in love with the game in a low-pressure environment.",
      schedule: "Mon/Wed 5:00 PM",
      features: ["Ball handling foundations", "Basic rules of the game", "Teamwork introduction", "Fun-based drills"],
      image: "/images/youth-team-small.jpg",
      imageKey: "programs.mini-basket",
      detailHref: "/programs/mini-basket",
    },
    {
      id: "youth",
      title: "Youth Academy",
      age: "11-18 Years",
      focus: "Skill, Tactics & Competition",
      desc: "Building the complete player. Technical mastery—shooting form, dribbling mechanics, defensive footwork—progressing into complex tactical concepts, physical conditioning, and competition preparation.",
      schedule: "Sun/Tue/Thu 5:00 PM",
      features: ["Shooting & ball handling mastery", "Advanced tactics", "Physical conditioning", "Competitive leagues"],
      image: "/images/youth-program.jpeg",
      imageKey: "programs.youth-academy",
      detailHref: "/programs/youth-academy",
    },
    {
      id: "elite",
      title: "Elite / Select",
      age: "Invitation Only",
      focus: "High Performance",
      desc: "For athletes with professional aspirations. Intensive training, personalized development plans, and exposure to international pathways.",
      schedule: "Daily Training",
      features: ["Individual Performance Plans", "Strength & Conditioning", "International Tournaments", "Scouting Exposure"],
      image: "/images/team-award.jpg",
      imageKey: "programs.elite",
      detailHref: "",
    }
  ];

  return (
    <>
      <BreadcrumbJsonLd path="/programs" label="Programs" />
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
            <span className="block">Basketball Programs</span>
            <span className="block">For Kids &amp; Youth</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From first dribbles to professional pathways. A structured journey for every stage of development.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20">
        <div className="space-y-20">
          {programs.map((program, idx) => (
            <div key={program.id} id={program.id} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center border-b border-gray-100 pb-20 last:border-0 last:pb-0">
              <div className={`order-2 ${idx % 2 === 1 ? "md:order-1" : "md:order-2"}`}>
                <div className="aspect-video w-full rounded-sm overflow-hidden relative group shadow-xl">
                   <Image
                     src={program.image}
                      alt={alt(program.imageKey)}
                     fill
                     className="object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                </div>
              </div>
              
              <div className={`order-1 ${idx % 2 === 1 ? "md:order-2" : "md:order-1"}`}>
                <div className="inline-block py-1 px-3 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                  {program.age}
                </div>
                <h2 className="text-4xl font-black uppercase mb-2">{program.title}</h2>
                <h3 className="text-lg font-bold text-gray-500 mb-6">{program.focus}</h3>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  {program.desc}
                </p>
                
                <div className="mb-8">
                  <h4 className="font-bold uppercase text-sm mb-4 border-b pb-2">Key Focus Areas</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {program.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Check className="h-4 w-4 text-primary" /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                   {program.detailHref ? (
                     <Link href={program.detailHref}>
                      <Button className="rounded-none uppercase font-bold tracking-wider h-auto py-3">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                     </Link>
                   ) : (
                     <Link href="/#book-trial">
                      <Button className="rounded-none uppercase font-bold tracking-wider h-auto py-3">
                        Book Trial <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                     </Link>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* PRIVATE TRAINING SECTION */}
      <section className="py-20 bg-gray-50 border-t-8 border-primary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block py-1 px-3 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                Personalized Development
              </div>
              <h2 className="text-5xl font-black uppercase mb-4">Private Training</h2>
              <h3 className="text-xl font-bold text-primary mb-6">1-on-1 &amp; Small Group Sessions</h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Accelerate your development with focused, personalized instruction from our expert staff. 
                Private training builds the individual tools needed to execute at the highest level through 
                high-volume repetition and immediate feedback.
              </p>
              
              <div className="mb-8">
                <h4 className="font-bold uppercase text-sm mb-4 border-b pb-2">Training Options</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Check className="h-4 w-4 text-primary" /> 1-on-1 Elite Sessions
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Check className="h-4 w-4 text-primary" /> 4-on-1 Small Group
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Check className="h-4 w-4 text-primary" /> Shooting Mechanics
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Check className="h-4 w-4 text-primary" /> Video Analysis
                  </li>
                </ul>
              </div>

              <Link href="/programs/private-training">
                <Button className="rounded-none uppercase font-bold tracking-wider h-auto py-4 px-8 text-lg">
                  View Training Options <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 border-2 border-primary/30 z-0 translate-x-4 translate-y-4" />
              <div className="relative z-10 w-full aspect-[4/3]">
                <Image 
                  src="/images/1v1-a.jpg" 
                  alt={alt("programs.private-training")} 
                  fill
                  className="object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 text-white text-center">
        <div className="container mx-auto px-4">
           <h2 className="text-4xl font-black uppercase mb-6">Not sure which level?</h2>
           <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">Book a free assessment session and our coaches will evaluate your skills and recommend the perfect program.</p>
           <Link href="/#book-trial">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary uppercase font-bold tracking-wider rounded-none px-10 h-14 text-lg">
                Book Assessment
              </Button>
           </Link>
        </div>
      </section>
    </>
  );
}
