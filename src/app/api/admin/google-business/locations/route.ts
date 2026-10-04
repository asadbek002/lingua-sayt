import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import { listLocations } from "@/lib/services/googleBusinessService";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId") || undefined;

  const result = await listLocations(accountId);
  return NextResponse.json(result);
}
