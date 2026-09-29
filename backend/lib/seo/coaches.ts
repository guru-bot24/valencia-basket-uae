import { getStructuredDataOverrides } from "./structuredDataResolve";
import { getVisibleStaff, staffSameAs } from "@/lib/content/staffStore";

/** One Person per visible Staff page member; name and role follow their card. */
export async function getCoachStructuredEntries(includeDisabled = false) {
  const [overrides, staff] = await Promise.all([getStructuredDataOverrides(), getVisibleStaff()]);
  return staff.flatMap((member) => {
    const key = `/__schema/person/${member.slug}`;
    if (!includeDisabled && overrides.get(key)?.enabled === false) return [];
    const sameAs = staffSameAs(member);
    return [{ key, path: "/coaches", label: member.name, type: "Person", note: "Name and role follow the live coach card.", fields: [], lockedFields: ["name", "jobTitle", "worksFor"], enabled: overrides.get(key)?.enabled ?? true, override: null, lastModified: overrides.get(key)?.updatedAt?.toISOString() ?? null, json: { "@context": "https://schema.org", "@type": "Person", name: member.name, jobTitle: member.role, worksFor: { "@type": "SportsOrganization", name: "Valencia Basket Academy UAE" }, ...(sameAs ? { sameAs } : {}) } }];
  });
}
