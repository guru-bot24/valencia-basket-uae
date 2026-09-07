import "server-only";
import { storage } from "@/lib/storage";
import { PAGE_SEO_DEFAULTS, type PageSeoDefaults } from "./registry";
import { eventPageDefaults, eventRegisterPageDefaults } from "./eventSeo";

/**
 * Every page the SEO Manager can edit: the static registry plus one entry per
 * event (detail + registration), whose defaults are computed from the event
 * record exactly as the page itself does.
 */
export async function getEditablePages(): Promise<PageSeoDefaults[]> {
  const events = await storage.getAllEvents();
  const eventPages = events.flatMap((event) => [
    eventPageDefaults(event),
    eventRegisterPageDefaults(event),
  ]);
  return [...PAGE_SEO_DEFAULTS, ...eventPages];
}

export async function getEditablePage(path: string): Promise<PageSeoDefaults | undefined> {
  const pages = await getEditablePages();
  return pages.find((page) => page.path === path);
}
