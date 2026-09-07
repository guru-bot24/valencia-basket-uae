import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata, getAltResolver } from "@/lib/seo/resolve";
import { getStructuredData } from "@/lib/seo/structuredDataResolve";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCoachStructuredEntries } from "@/lib/seo/coaches";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/coaches");
}

const director = {
  name: "Coach Maros Kovacik",
  role: "Director & Head Coach",
  bio: "Maros Kovacik leads Valencia Basket Academy UAE as Director and Head Coach. A EuroLeague Coach of the Year (2013) and a 15-time champion, he brings elite coaching experience from across Europe and Asia, splitting his work between Valencia and Dubai.",
  image: "/images/coach-maros.jpg",
  imageKey: "coaches.maros-kovacik",
};

const managementTeam = [
  {
    name: "Coach Saiid",
    role: "General Manager",
    bio: "FIBA-certified coach with solid experience in the basketball environment of Dubai and Lebanon. Coach Saiid brings strong international knowledge and leadership to the academy.",
    image: "/images/coach_new/saiid.jpeg",
    imageKey: "coaches.saiid",
  },
  {
    name: "Rabih",
    role: "Operations Manager",
    bio: "Rabih is an experienced manager of basketball academies and brings his empathy, dedication to Valencia.",
    image: "/images/coach_new/rabih.jpeg",
    imageKey: "coaches.rabih",
  },
];

const coachingTeam = [
  {
    name: "Coach Majil",
    role: "Coach",
    bio: "Coach with extensive experience in Dubai, working with both individual skill development and team programs.",
    image: "/images/coach_new/majil.jpeg",
    imageKey: "coaches.majil",
  },
  {
    name: "Coach Ahmed",
    role: "Coach",
    bio: "Coach with experience in Dubai, specialized in individual and team development programs.",
    image: "/images/coach_new/doksal.jpeg",
    imageKey: "coaches.ahmed",
  },
];

const alumniTeam = [
  {
    name: "Coach Guillem",
    role: "Technical Director",
    bio: "Level 3 coach certified in Spain, with experience in the EuroLeague Adidas Next Generation Tournament and as a U18 and U16 coach at Valencia Basket. He oversees the technical and developmental direction of the academy.",
    image: "/images/coach-guillem.jpg",
    imageKey: "coaches.guillem",
  },
  {
    name: "Coach Andreu",
    role: "Assistant Coordinator",
    bio: "Coach with experience in Valencia Basket's Elite Program, holding official Spanish coaching licenses. Actively involved in player development and program coordination.",
    image: "/images/coach-andreu.jpg",
    imageKey: "coaches.andreu",
  },
  {
    name: "Coach Ruben",
    role: "Coach",
    bio: "Coach with experience in Valencia Basket's Elite youth programs, focused on long-term player development in formative categories.",
    image: "/images/coach-ruben.jpg",
    imageKey: "coaches.ruben",
  },
  {
    name: "Coach Carles",
    role: "Coach",
    bio: "Coach with experience in elite development programs, working mainly in youth and formative categories.",
    image: "/images/coach-carles.jpg",
    imageKey: "coaches.carles",
  },
];

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  imageKey: string;
}

function DirectorCard({
  person,
  imageAlt,
}: {
  person: TeamMember;
  imageAlt: string;
}) {
  return (
    <div className="group flex flex-col md:flex-row gap-0 overflow-hidden bg-gray-50 border border-gray-100">
      {/* Photo */}
      <div className="relative w-full md:w-64 lg:w-72 shrink-0 aspect-[3/4] md:aspect-auto md:h-80 bg-gray-200">
        <Image
          src={person.image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 288px"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          priority
        />
      </div>
      {/* Content */}
      <div className="flex flex-col justify-center px-8 py-8 md:py-10">
        <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">Leadership</span>
        <h3 className="text-3xl md:text-4xl font-black uppercase leading-none mb-2">{person.name}</h3>
        <p className="text-primary font-bold uppercase text-xs tracking-widest mb-5">{person.role}</p>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-xl">{person.bio}</p>
      </div>
    </div>
  );
}

function CoachCard({
  person,
  isAlumni,
  imageAlt,
}: {
  person: TeamMember;
  isAlumni: boolean;
  imageAlt: string;
}) {
  return (
    <div className="group cursor-pointer">
      <div className="overflow-hidden mb-4 relative bg-gray-100 aspect-[3/4]">
        <Image
          src={person.image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className={
            isAlumni
              ? "object-cover transition-all duration-500 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
              : "object-cover transition-transform duration-500 group-hover:scale-105"
          }
        />
        {/* Desktop hover overlay — hidden on mobile */}
        <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end p-6">
          <p className="text-white text-sm leading-relaxed">{person.bio}</p>
        </div>
      </div>
      <h3 className="text-xl md:text-2xl font-black uppercase leading-none mb-1">{person.name}</h3>
      <p className="text-primary font-bold uppercase text-xs tracking-widest mb-2">{person.role}</p>
      {/* Bio always visible on mobile */}
      <p className="md:hidden text-sm text-gray-600 leading-relaxed">{person.bio}</p>
    </div>
  );
}

export default async function Coaches() {
  const alt = await getAltResolver();
  const schema = [
    ...(await getStructuredData("/coaches", "Coaches")),
    ...(await getCoachStructuredEntries()).map((entry) => entry.json),
  ];
  return (
    <>
      <StructuredData data={schema} />
      <div className="bg-black text-white py-20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">The People Behind the Program</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">Our Team</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            FIBA-certified and Spanish-licensed coaches with experience at the highest levels of European basketball, dedicated to your child&apos;s growth.
          </p>
        </div>
      </div>

      {/* Director */}
      <div className="container mx-auto px-4 md:px-6 pt-20 pb-12">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-8">Leadership</h2>
        <DirectorCard person={director} imageAlt={alt(director.imageKey)} />
      </div>

      {/* Management & Operations */}
      <div className="container mx-auto px-4 md:px-6 pb-16">
        <div className="border-t border-gray-200 pt-16">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-10">Management &amp; Operations</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {managementTeam.map((person) => (
              <CoachCard
                key={person.imageKey}
                person={person}
                isAlumni={false}
                imageAlt={alt(person.imageKey)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Coaching Staff */}
      <div className="container mx-auto px-4 md:px-6 pb-16">
        <div className="border-t border-gray-200 pt-16">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-10">Coaching Staff</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {coachingTeam.map((person) => (
              <CoachCard
                key={person.imageKey}
                person={person}
                isAlumni={false}
                imageAlt={alt(person.imageKey)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Alumni Coaches */}
      <div className="container mx-auto px-4 md:px-6 pb-20">
        <div className="border-t border-gray-200 pt-16">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">Alumni Coaches</h2>
          <p className="text-gray-500 text-sm mb-10">Former coaches who contributed to the academy&apos;s foundation and growth.</p>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {alumniTeam.map((person) => (
              <CoachCard
                key={person.imageKey}
                person={person}
                isAlumni
                imageAlt={alt(person.imageKey)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-primary py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black uppercase mb-6 text-white">Join the Team</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            We are always looking for passionate, qualified professionals to join our expanding academy.
          </p>
          <Link href="mailto:info@valenciabasket.ae">
            <Button variant="outline" className="uppercase font-bold tracking-wider rounded-none border-white text-white hover:bg-white hover:text-primary">
              Get in Touch
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
