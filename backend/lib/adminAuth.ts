import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const session = await storage.getSessionByToken(token);
  if (!session || new Date(session.expiresAt) < new Date()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
