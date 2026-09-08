"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── ADD MORE IMAGES HERE ──────────────────────────────────────────────────
// Drop the image file into /publichttps://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/ and add a { key, src, alt } entry below.
// No other code changes needed — the carousel handles any number of slides.
// `key` must match an entry in lib/seo/images.ts for the alt text to be
// editable from the admin SEO Manager; without one the hard-coded alt is used.
const SLIDES = [
  {
    key: "facilities.arena-render",
    src: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/allsports-arena-render.jpg",
    alt: "AllSports Arena — facility overview render",
  },
  {
    key: "facilities.arena-courts",
    src: "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/All-sports-arena.jpg",
    alt: "AllSports Arena — multi-court indoor facility",
  },
] as const;

const INTERVAL_MS = 4500; // milliseconds between auto-advances

export default function ArenaCarousel({
  altOverrides = {},
}: {
  altOverrides?: Record<string, string>;
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  // Read reduced-motion preference once on mount (avoids SSR mismatch)
  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length),
    []
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % SLIDES.length),
    []
  );

  // Auto-advance: disabled while paused or when reduced motion is preferred
  useEffect(() => {
    if (paused || reducedMotion.current) return;
    const id = setInterval(next, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <div
      className="relative w-full aspect-[16/9] md:aspect-[16/7] overflow-hidden rounded-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      data-testid="img-arena-showcase"
    >
      {/* ── Slides (crossfade) ── */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.src}
            alt={altOverrides[slide.key] ?? slide.alt}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="(min-width: 1280px) 1200px, 100vw"
          />
        </div>
      ))}

      {/* ── Caption ── */}
      <span className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-black/60 backdrop-blur px-3 py-1.5 text-[11px] md:text-xs font-medium text-white rounded z-10">
        Multi-court indoor facility · AllSports Arena, Al Quoz
      </span>

      {/* ── Left arrow ── */}
      <button
        onClick={prev}
        aria-label="Previous image"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary text-white p-2.5 md:p-3 rounded-full transition-colors"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
      </button>

      {/* ── Right arrow ── */}
      <button
        onClick={next}
        aria-label="Next image"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-primary text-white p-2.5 md:p-3 rounded-full transition-colors"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
      </button>

      {/* ── Dot indicators ── */}
      <div
        className="absolute bottom-3 right-3 md:bottom-4 md:right-14 z-10 flex gap-1.5 items-center"
        role="tablist"
        aria-label="Slide indicators"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 bg-primary"
                : "w-2 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
