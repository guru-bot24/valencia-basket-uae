import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admissions",
  description: "Join Valencia Basket UAE. Learn about our admissions process, term dates, pricing, and frequently asked questions for parents.",
  alternates: {
    canonical: "/admissions",
  },
  openGraph: {
    title: "Admissions",
    description: "Join Valencia Basket UAE. Learn about our admissions process, term dates, pricing, and frequently asked questions for parents.",
  },
};

export default function AdmissionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
