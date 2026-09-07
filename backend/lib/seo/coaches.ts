import { getStructuredDataOverrides } from "./structuredDataResolve";

/** Names and roles mirror the live coach cards; they are deliberately locked. */
export const LIVE_COACHES = [
  ["maros-kovacik", "Coach Maros Kovacik", "Director & Head Coach"],
  ["saiid", "Coach Saiid", "General Manager"],
  ["rabih", "Rabih", "Operations Manager"],
  ["majil", "Coach Majil", "Coach"],
  ["ahmed", "Coach Ahmed", "Coach"],
  ["guillem", "Coach Guillem", "Technical Director"],
  ["andreu", "Coach Andreu", "Assistant Coordinator"],
  ["ruben", "Coach Ruben", "Coach"],
  ["carles", "Coach Carles", "Coach"],
] as const;

export async function getCoachStructuredEntries(includeDisabled = false) {
  const overrides = await getStructuredDataOverrides();
  return LIVE_COACHES.flatMap(([slug, name, jobTitle]) => {
    const key = `/__schema/person/${slug}`;
    if (!includeDisabled && overrides.get(key)?.enabled === false) return [];
    return [{ key, path: "/coaches", label: name, type: "Person", note: "Name and role follow the live coach card.", fields: [], lockedFields: ["name", "jobTitle", "worksFor"], enabled: overrides.get(key)?.enabled ?? true, override: null, lastModified: overrides.get(key)?.updatedAt?.toISOString() ?? null, json: { "@context": "https://schema.org", "@type": "Person", name, jobTitle, worksFor: { "@type": "SportsOrganization", name: "Valencia Basket Academy UAE" } } }];
  });
}