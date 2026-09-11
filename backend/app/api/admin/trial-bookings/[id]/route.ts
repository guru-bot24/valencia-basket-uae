import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { storage } from "@/lib/storage";
import { leadStatusSchema } from "@shared/schema";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  const { id } = await params;

  try {
    const body = await request.json();
    const status = leadStatusSchema.parse(body.status);
    const updated = await storage.updateTrialBookingStatus(id, status);
    if (!updated) return NextResponse.json({ error: "Trial booking not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }
    console.error("Error updating trial booking status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  const { id } = await params;

  try {
    const deleted = await storage.deleteTrialBooking(id);
    if (!deleted) return NextResponse.json({ error: "Trial booking not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting trial booking:", error);
    return NextResponse.json({ error: "Failed to delete trial booking" }, { status: 500 });
  }
}
