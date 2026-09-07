import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/adminAuth";
import { insertEventRegistrationSchema } from "@shared/schema";
import { sendEventRegistrationNotification } from "@/lib/email";
import { isPastEvent } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;
    const registrations = await storage.getAllEventRegistrations();
    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const registrationData = insertEventRegistrationSchema.parse(body);

    if (registrationData.eventId) {
      const event = await storage.getEventById(registrationData.eventId);
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      if (isPastEvent(event.endDate)) {
        return NextResponse.json({ error: "Registration is closed: this event has already ended" }, { status: 400 });
      }
    }

    const registration = await storage.createEventRegistration(registrationData);

    sendEventRegistrationNotification({
      eventTitle: registration.eventTitle,
      parentName: registration.parentName,
      email: registration.email,
      phone: registration.phone,
      playerName: registration.playerName,
      playerAge: registration.playerAge,
    }).catch((err) => console.error("Email notification failed for event registration:", err));

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("Error creating event registration:", error);
    return NextResponse.json({ error: "Invalid registration data" }, { status: 400 });
  }
}
