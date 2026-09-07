import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { requireAdmin } from "@/lib/adminAuth";
import { seoRedirectSchema } from "@shared/schema";
import { RESERVED_REDIRECT_PREFIXES, RESERVED_REDIRECT_SOURCES } from "@/lib/seo/registry";
import { invalidateRedirectCache } from "@/lib/seo/redirects";

export const dynamic = "force-dynamic";

/**
 * Redirects are applied by middleware *before* routing, so a rule whose source
 * is a live page would make that page unreachable. Domain-level rules stay in
 * next.config.ts and must not be duplicated here.
 */
export function validateSource(source: string): string | null {
  if (source === "/") return "The homepage cannot be redirected";
  if (RESERVED_REDIRECT_SOURCES.has(source)) {
    return `"${source}" is an existing page or is already handled in next.config.ts`;
  }
  if (RESERVED_REDIRECT_PREFIXES.some((prefix) => source === prefix || source.startsWith(`${prefix}/`))) {
    return `"${source}" is inside a reserved path and cannot be redirected`;
  }
  return null;
}

/**
 * A redirect may point at another redirect, so a new rule has to be checked
 * against the whole chain — otherwise two rules can point at each other and
 * trap the visitor in a loop.
 */
export async function validateLoop(
  source: string,
  destination: string,
  ignoreId?: string
): Promise<string | null> {
  if (source === destination) return "Source and destination must differ";

  const existing = (await storage.getAllSeoRedirects()).filter((row) => row.id !== ignoreId);
  const chain = new Map(existing.map((row) => [row.source, row.destination]));
  chain.set(source, destination);

  const seen = new Set([source]);
  let current = destination;
  while (chain.has(current)) {
    if (seen.has(current)) return "That would create a redirect loop";
    seen.add(current);
    current = chain.get(current)!;
  }
  return null;
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    return NextResponse.json(await storage.getAllSeoRedirects());
  } catch (error) {
    console.error("[seo] failed to list redirects:", error);
    return NextResponse.json({ error: "Failed to load redirects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const data = seoRedirectSchema.parse(await request.json());
    const problem =
      validateSource(data.source) ?? (await validateLoop(data.source, data.destination));
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    const existing = await storage.getSeoRedirectBySource(data.source);
    if (existing) {
      return NextResponse.json({ error: "A redirect for that source already exists" }, { status: 409 });
    }

    const created = await storage.createSeoRedirect(data);
    invalidateRedirectCache();
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: "Invalid redirect", details: error.errors }, { status: 400 });
    }
    console.error("[seo] failed to create redirect:", error);
    return NextResponse.json({ error: "Failed to create redirect" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    if (typeof body?.id !== "string") {
      return NextResponse.json({ error: "A redirect id is required" }, { status: 400 });
    }
    const data = seoRedirectSchema.parse(body);
    const problem =
      validateSource(data.source) ?? (await validateLoop(data.source, data.destination, body.id));
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    const current = await storage.getSeoRedirectById(body.id);
    if (!current) {
      return NextResponse.json({ error: "Redirect not found" }, { status: 404 });
    }
    const clash = await storage.getSeoRedirectBySource(data.source);
    if (clash && clash.id !== body.id) {
      return NextResponse.json({ error: "A redirect for that source already exists" }, { status: 409 });
    }

    const updated = await storage.updateSeoRedirect(body.id, data);
    invalidateRedirectCache();
    return NextResponse.json(updated);
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: "Invalid redirect", details: error.errors }, { status: 400 });
    }
    console.error("[seo] failed to update redirect:", error);
    return NextResponse.json({ error: "Failed to update redirect" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await request.json();
    if (typeof id !== "string") {
      return NextResponse.json({ error: "A redirect id is required" }, { status: 400 });
    }
    await storage.deleteSeoRedirect(id);
    invalidateRedirectCache();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[seo] failed to delete redirect:", error);
    return NextResponse.json({ error: "Failed to delete redirect" }, { status: 500 });
  }
}
