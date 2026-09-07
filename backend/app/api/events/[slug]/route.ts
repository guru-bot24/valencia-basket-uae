import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/adminAuth";
import { insertEventSchema } from "@shared/schema";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const event = await storage.getEventBySlug(slug);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;
    const { slug } = await params;
    const event = await storage.getEventBySlug(slug);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    const body = await request.json();
    const parsed = insertEventSchema.partial().parse(body);
    const updated = await storage.updateEvent(event.id, parsed);
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);
    revalidatePath(`/events/${updated.slug}`);
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: "Invalid event data", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;
    const { slug } = await params;
    const event = await storage.getEventBySlug(slug);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    await storage.deleteEvent(event.id);
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
