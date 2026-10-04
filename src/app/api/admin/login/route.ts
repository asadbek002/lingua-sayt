import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";

// Lightweight credential check that does not touch the database.
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  return NextResponse.json({ ok: true });
}
