import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import bcrypt from "bcryptjs";

async function requireAuth(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  const session = await storage.getSessionByToken(token);
  if (!session) return null;
  const users = await storage.getAllAdminUsers();
  return users.find((u) => u.id === session.userId) || null;
}

export async function GET(request: NextRequest) {
  const currentUser = await requireAuth(request);
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await storage.getAllAdminUsers();
  return NextResponse.json(
    users.map((u) => ({ id: u.id, username: u.username, role: u.role, createdAt: u.createdAt }))
  );
}

export async function POST(request: NextRequest) {
  const currentUser = await requireAuth(request);
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, password, role } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await storage.getAdminByUsername(username);
    if (existing) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await storage.createAdminUser(username, hash, role || "admin");

    return NextResponse.json(
      { id: user.id, username: user.username, role: user.role },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const currentUser = await requireAuth(request);
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    if (id === currentUser.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    await storage.deleteAdminUser(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting admin user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
