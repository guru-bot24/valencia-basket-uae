import "server-only";
import { revalidatePath } from "next/cache";

/** Everything that shows staff data: the Staff page, author pages, bylines/schema and the sitemap. */
export function revalidateStaffPages() {
  revalidatePath("/coaches");
  revalidatePath("/blog");
  revalidatePath("/blog/author/[slug]", "page");
  revalidatePath("/sitemap.xml");
}
