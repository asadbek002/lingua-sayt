import { NextRequest, NextResponse } from "next/server";
import { listLocations } from "@/lib/services/googleBusinessService";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const password = auth.replace("Bearer ", "");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId") || undefined;

  const result = await listLocations(accountId);
  return NextResponse.json(result);
}
