"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, CalendarDays } from "lucide-react";
import { WhatsAppIcon } from "@/components/shared/WhatsAppIcon";

const WHATSAPP_NUMBER = "971544386838";

function BasketballIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M4.9 4.9a14.2 14.2 0 0 1 0 14.2" />
      <path d="M19.1 4.9a14.2 14.2 0 0 0 0 14.2" />
      <path d="M2 12h20" />
      <path d="M12 2v20" />
    </svg>
  );
}

const steps = [
  {
    Icon: WhatsAppIcon,
    primary: "We message you to confirm",
    secondary: "Within 24 hours on WhatsApp",
  },
  {
    Icon: CalendarDays,
    primary: "Pick a slot that suits you",
    secondary: "Flexible timings across the week",
  },
  {
    Icon: BasketballIcon,
    primary: "Train and meet the coaches",
    secondary: "Experience the methodology first-hand",
  },
];

export default function ThankYouClient({
  source,
  logoAlt,
}: {
  /** Full URL of the originating page (e.g. "https://valenciabasket.ae/contact").
   *  Falls back to "direct" if absent.
   *  Ready for tracking: fire a conversion event here once analytics is wired up.
   *  Example:
   *    useEffect(() => { gtag("event", "trial_booking_complete", { source }); }, [source]);
   */
  source: string;
  logoAlt: string;
}) {
  const waMessage = encodeURIComponent("Hi, I just booked a free trial");

  return (
    <div
      className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 md:py-16"
      style={{ background: "#F5F4F2" }}
    >
      {/* ── Landscape card ── */}
      <div
        className="w-full max-w-5xl animate-fade-in-up overflow-hidden"
        style={{
          borderRadius: "16px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.13)",
        }}
      >
        {/* 4px orange bar — full width across the very top */}
        <div className="h-[4px] w-full" style={{ background: "#E8722C" }} aria-hidden="true" />

        {/* Two bands */}
        <div className="flex flex-col lg:flex-row">

          {/* ── Dark header band (left on desktop, top on mobile) ── */}
          <div
            className="flex flex-col items-center justify-center px-8 py-12 text-center lg:w-[42%] lg:px-12 lg:py-14"
            style={{ background: "#16130F" }}
          >
            {/* Brand lockup */}
            <div className="mb-9 flex items-center gap-2.5">
              <Image
                src="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/logo.png"
                alt={logoAlt}
                width={34}
                height={34}
                className="h-[34px] w-auto"
              />
              <span
                className="text-white text-[13px] font-medium"
                style={{ letterSpacing: "0.9px" }}
              >
                VALENCIA BASKET
              </span>
            </div>

            {/* Checkmark — solid orange ring → white inner ring → orange check */}
            <div
              className="mb-7 flex h-20 w-20 items-center justify-center rounded-full animate-in zoom-in-75 fade-in-0 duration-500"
              style={{
                background: "#E8722C",
                boxShadow: "0 0 0 8px rgba(232,114,44,0.18)",
              }}
              aria-hidden="true"
            >
              <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white">
                <Check className="h-7 w-7" strokeWidth={2.8} style={{ color: "#E8722C" }} />
              </div>
            </div>

            {/* Heading */}
            <h1
              className="mb-3 font-medium text-white"
              style={{ fontSize: "clamp(26px, 3.5vw, 34px)", letterSpacing: "-0.5px", lineHeight: 1.15 }}
            >
              You&apos;re all set
            </h1>

            {/* Sub-line */}
            <p
              className="max-w-[290px] text-[15px]"
              style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}
            >
              Thanks for booking your free trial. Our team will reach out on WhatsApp within 24 hours to confirm the details.
            </p>
          </div>

          {/* ── Light body band (right on desktop, bottom on mobile) ── */}
          <div
            className="flex flex-1 flex-col justify-between px-8 py-10 lg:px-10 lg:py-12"
            style={{ background: "#FBFAF8" }}
          >
            <div>
              {/* Eyebrow */}
              <p
                className="mb-5 text-center text-[11px] font-bold uppercase tracking-widest"
                style={{ color: "#E8722C" }}
              >
                What Happens Next
              </p>

              {/* Step cards */}
              <div className="mb-8 flex flex-col gap-3">
                {steps.map(({ Icon, primary, secondary }, i) => (
                  <div
                    key={primary}
                    className="flex items-center gap-4 px-4 py-3.5 animate-fade-in-up"
                    style={{
                      background: "white",
                      border: "0.5px solid #EAE7E0",
                      borderLeft: "3px solid #E8722C",
                      borderRadius: "11px",
                      animationDelay: `${i * 80}ms`,
                    }}
                  >
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ background: "#E8722C", color: "white" }}
                      aria-hidden="true"
                    >
                      <Icon size={18} width={18} height={18} className="h-[18px] w-[18px]" />
                    </div>
                    <div>
                      <div className="text-[13.5px] font-semibold" style={{ color: "#16130F" }}>
                        {primary}
                      </div>
                      <div className="text-[12px]" style={{ color: "#999" }}>
                        {secondary}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              {/* Primary — WhatsApp */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full min-h-[50px] items-center justify-center gap-2 rounded-none text-[14px] font-medium transition-colors"
                style={{ background: "#25D366", color: "#0A2416" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#20BD5A")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#25D366")}
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
                Message us on WhatsApp
              </a>

              {/* Secondary — Back to site */}
              <Link
                href="/"
                className="flex w-full min-h-[46px] items-center justify-center rounded-none bg-transparent text-[13.5px] font-medium transition-colors"
                style={{ border: "1px solid #E8722C", color: "#E8722C" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(232,114,44,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                Back to site
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
