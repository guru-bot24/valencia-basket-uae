import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isPastEvent(endDate: string | null | undefined): boolean {
  if (!endDate) return false;
  // "Today" in UAE time (UTC+4, no DST) so events flip to past at midnight local time
  const today = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return endDate < today;
}
