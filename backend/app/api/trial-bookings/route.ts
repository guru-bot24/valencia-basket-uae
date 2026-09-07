import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/adminAuth";
import { trialBookingFormSchema } from "@shared/schema";
import { sendTrialBookingNotification } from "@/lib/email";
import { appendTrialBookingToSheet } from "@/lib/sheets";

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;
    const bookings = await storage.getAllTrialBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching trial bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot: hidden field must be empty
    if (typeof body.website === "string" && body.website.length > 0) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    // Bot timing: require a start timestamp and reject forms completed in under 3 seconds
    if (typeof body.formStartedAt !== "number" || Date.now() - body.formStartedAt < 3000) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    const parsed = trialBookingFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid booking data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { website, formStartedAt, ...data } = parsed.data;
    const booking = await storage.createTrialBooking(data);

    sendTrialBookingNotification(booking).catch((err) =>
      console.error("Email notification failed for trial booking:", err)
    );

    appendTrialBookingToSheet(booking).catch((err) =>
      console.error("Sheets sync failed for trial booking:", err)
    );

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating trial booking:", error);
    return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
  }
}
