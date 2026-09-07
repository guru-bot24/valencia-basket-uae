export function StructuredData({ data }: { data: unknown[] }) {
  return <>{data.map((json, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }} />)}</>;
}
import { getStructuredData } from "@/lib/seo/structuredDataResolve";
export async function BreadcrumbJsonLd({ path, label }: { path: string; label: string }) {
  return <StructuredData data={await getStructuredData(path, label)} />;
}