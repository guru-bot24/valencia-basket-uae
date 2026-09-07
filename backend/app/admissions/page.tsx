import type { Metadata } from "next";
import AdmissionsClient from "./AdmissionsClient";
import { buildPageMetadata } from "@/lib/seo/resolve";
import { getStructuredData } from "@/lib/seo/structuredDataResolve";
import { StructuredData } from "@/components/seo/StructuredData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/admissions");
}

export default async function AdmissionsPage() {
  return <><StructuredData data={await getStructuredData("/admissions", "Admissions")} /><AdmissionsClient /></>;
}
