import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for could not be found. Return to the Valencia Basket UAE homepage.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 bg-gray-50">
      <AlertTriangle className="h-16 w-16 text-primary mb-6" />
      <h1 className="text-4xl md:text-6xl font-black uppercase mb-4 text-gray-900">
        404 Page Not Found
      </h1>
      <p className="text-xl text-gray-500 mb-8 max-w-md">
        The play you&apos;re looking for doesn&apos;t exist in our playbook.
      </p>
      <Link href="/">
        <Button size="lg" className="uppercase font-bold tracking-wider bg-black hover:bg-primary text-white rounded-none px-8">
          Return to Court
        </Button>
      </Link>
    </div>
  );
}
