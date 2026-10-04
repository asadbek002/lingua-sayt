import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import { listAccounts } from "@/lib/services/googleBusinessService";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const result = await listAccounts();
  return NextResponse.json(result);
}
