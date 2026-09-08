import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Check, Clock, User } from "lucide-react";
import type { Metadata } from "next";
import { buildPageMetadata, getAltResolver } from "@/lib/seo/resolve";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/programs/private-training");
}

export default async function PrivateTraining() {
  const alt = await getAltResolver();
  const benefits = [
    "Personalized correction of shooting mechanics",
    "Detailed video analysis feedback",
    "High-repetition skill drills",
    "Game situational reads and decision making",
    "Confidence building in a focused environment"
  ];


  return (
    <>
      <BreadcrumbJsonLd path="/programs/private-training" label="Private Training" />
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">Private Training</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Accelerate your development with focused, personalized instruction from our expert staff.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-center">
          <div>
            <span className="text-[#FF6C0E] font-bold uppercase tracking-widest text-sm mb-2 block">Why Private Training?</span>
            <h2 className="text-4xl font-black uppercase mb-6">The Fast Track to Mastery</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              While team practice teaches concepts and systems, private training builds the individual tools needed to execute them. 
              Our 1-on-1 and small group sessions are designed to isolate weaknesses and turn them into strengths through high-volume repetition and immediate feedback.
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 font-medium text-gray-800">
                  <div className="h-6 w-6 rounded-full bg-[#FF6C0E]/10 flex items-center justify-center text-[#FF6C0E]">
                    <Check className="h-4 w-4" />
                  </div>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="relative w-full aspect-[4/3]">
              <Image 
                src="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/1v1-a.jpg" 
                alt={alt("private-training.session")} 
                fill
                className="object-cover shadow-2xl rounded-sm"
              />
            </div>
          </div>
        </div>

        {/* ── Ratio / Format Cards ── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-[#FF6C0E] font-bold uppercase tracking-widest text-sm mb-2 block">
              Training Options
            </span>
            <h2 className="text-4xl font-black uppercase mb-4">Choose Your Format</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Every session is tailored to the player. Select the ratio that fits your goals and budget — all formats are available across our weekly slots.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                ratio: "1:1",
                label: "One-to-One",
                desc: "Fully personalised, undivided coaching. The fastest route to individual development.",
              },
              {
                ratio: "2:1",
                label: "Pairs",
                desc: "Train with a partner or friend. Shared focus with plenty of individual attention.",
              },
              {
                ratio: "3:1",
                label: "Small Group",
                desc: "A small group balancing personal coaching with competitive, game-like reps.",
              },
              {
                ratio: "4:1",
                label: "Group",
                desc: "Train alongside peers with focused coaching — great for skill work in a team-style setting.",
              },
            ].map(({ ratio, label, desc }) => (
              <div
                key={ratio}
                className="bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col group"
              >
                {/* Orange top accent bar */}
                <div className="h-[3px] w-8 bg-[#FF6C0E] mb-5 group-hover:w-full transition-all duration-500" aria-hidden="true" />

                {/* Ratio */}
                <div className="text-[42px] font-black leading-none tracking-tighter text-gray-900 group-hover:text-[#FF6C0E] transition-colors duration-300 mb-1">
                  {ratio}
                </div>

                {/* Label */}
                <div className="text-xs font-bold uppercase tracking-widest text-[#FF6C0E] mb-3">
                  {label}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mb-4" />

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed flex-1">
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Enquiry nudge */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Not sure which format suits you?{" "}
            <a href="/contact" className="text-[#FF6C0E] font-medium hover:underline">
              Get in touch
            </a>{" "}
            and we&apos;ll recommend the right option.
          </p>
        </div>

        <div className="bg-gray-100 p-8 md:p-12">
           <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1">
                 <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
                   <Clock className="h-8 w-8 text-[#FF6C0E]" /> Weekly Availability
                 </h2>
                 <p className="text-gray-600 mb-6">
                   Private training slots are limited and booked on a first-come, first-served basis. Regular weekly slots can be reserved for the term.
                 </p>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                       <span className="font-bold text-gray-900">Weekdays (Sun - Thu)</span>
                       <span className="text-gray-600">2:00 PM - 4:30 PM</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                       <span className="font-bold text-gray-900">Saturday</span>
                       <span className="text-gray-600">8:00 AM - 12:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                       <span className="font-bold text-gray-900">Friday</span>
                       <span className="text-gray-600 text-red-500 font-bold uppercase text-xs">Closed</span>
                    </div>
                 </div>
              </div>
              
              <div className="flex-1">
                 <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
                   <User className="h-8 w-8 text-[#FF6C0E]" /> Specialist Coaches
                 </h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 shadow-sm border border-gray-200">
                       <h4 className="font-black uppercase text-lg">Miguel Torres</h4>
                       <span className="text-xs text-[#FF6C0E] font-bold uppercase block mb-2">Shooting Specialist</span>
                       <p className="text-xs text-gray-500">Former ACB pro player with expert biomechanical knowledge.</p>
                    </div>
                    <div className="bg-white p-4 shadow-sm border border-gray-200">
                       <h4 className="font-black uppercase text-lg">Sarah Jenkins</h4>
                       <span className="text-xs text-[#FF6C0E] font-bold uppercase block mb-2">Skill &amp; Performance</span>
                       <p className="text-xs text-gray-500">Combines ball handling work with athletic movement.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </>
  );
}
