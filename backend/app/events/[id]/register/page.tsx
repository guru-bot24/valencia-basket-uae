import type { Metadata } from "next";
import { storage } from "@/lib/storage";
import RegisterClient from "./RegisterClient";
import { buildDynamicMetadata } from "@/lib/seo/resolve";
import { eventRegisterPageDefaults } from "@/lib/seo/eventSeo";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await storage.getEventBySlug(id);
  if (!event) {
    return { title: "Event Not Found" };
  }
  return buildDynamicMetadata(eventRegisterPageDefaults(event));
}

export default function EventRegistrationPage() {
  return <RegisterClient />;
}
