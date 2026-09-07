"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Hero({ imageAlt = "Valencia Basket UAE Action" }: { imageAlt?: string }) {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black" style={{ marginTop: "calc(var(--navbar-height, 72px) * -1)", paddingTop: "var(--navbar-height, 72px)" }}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />
        <Image 
          src="/images/hero-players-2.jpg" 
          alt={imageAlt}
          fill
          priority
          className="object-cover opacity-80 object-top"
        />
      </div>

      <div className="relative z-20 container mx-auto px-4 md:px-6 text-center text-white">
        <div className="flex flex-col items-center animate-fade-in-up">
          <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            Official Partner of Valencia Basket Spain
          </span>
          
          <h1 className="text-2xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none mb-6">
            <span className="block">
              <span className="text-[#FFFFFF]">Valencia</span>{" "}
              <span className="text-[#FF6C0E]">Basketball</span>
            </span>
            <span className="block">
              <span className="text-[#FF6C0E]">Academy</span>{" "}
              <span className="text-[#FFFFFF]">UAE</span>
            </span>
          </h1>
          
          <p className="max-w-xl mx-auto text-lg md:text-xl text-gray-200 mb-10 font-light leading-relaxed">
            Join the elite player development pathway inspired by L&apos;Alqueria del Basket. 
            Excellence, culture, and high performance for Dubai&apos;s youth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/#book-trial">
              <Button size="lg" className="h-14 px-10 text-lg uppercase font-bold tracking-wider rounded-none bg-primary hover:bg-primary/90 text-white border-0">
                Book a Free Trial
              </Button>
            </Link>
            <Link href="/programs">
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg uppercase font-bold tracking-wider rounded-none bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-colors">
                View Programs
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-fade-in-delayed">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
