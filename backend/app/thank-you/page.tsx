import type { Metadata } from "next";
import ThankYouClient from "./ThankYouClient";
import { buildPageMetadata, getAltResolver } from "@/lib/seo/resolve";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/thank-you");
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const params = await searchParams;
  const alt = await getAltResolver();
  return <ThankYouClient source={params.source || "direct"} logoAlt={alt("thank-you.logo")} />;
}
