import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/adminAuth";
import { insertEventSchema } from "@shared/schema";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const allEvents = await storage.getAllEvents();
    return NextResponse.json(allEvents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;
    const body = await request.json();
    const parsed = insertEventSchema.parse(body);
    const event = await storage.createEvent(parsed);
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);
    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: "Invalid event data", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
