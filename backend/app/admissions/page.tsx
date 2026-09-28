import type { Metadata } from "next";
import AdmissionsClient from "./AdmissionsClient";
import { buildPageMetadata } from "@/lib/seo/resolve";
import { getStructuredData } from "@/lib/seo/structuredDataResolve";
import { StructuredData } from "@/components/seo/StructuredData";
import { getContent } from "@/lib/content/pageContent";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/admissions");
}

export default async function AdmissionsPage() {
  const heroSubtext = await getContent("admissions.hero.subtext");
  const step1 = await getContent("admissions.step1.description");
  const step2 = await getContent("admissions.step2.description");
  const step3 = await getContent("admissions.step3.description");
  const step4 = await getContent("admissions.step4.description");
  const term1 = await getContent("admissions.term1.dates");
  const term2 = await getContent("admissions.term2.dates");
  const term3 = await getContent("admissions.term3.dates");
  return (
    <>
      <StructuredData data={await getStructuredData("/admissions", "Admissions")} />
      <AdmissionsClient
        heroSubtext={heroSubtext}
        step1={step1}
        step2={step2}
        step3={step3}
        step4={step4}
        term1={term1}
        term2={term2}
        term3={term3}
      />
    </>
  );
}
