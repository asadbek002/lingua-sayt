import { NextRequest, NextResponse } from "next/server";
import { listAccounts } from "@/lib/services/googleBusinessService";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const password = auth.replace("Bearer ", "");
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await listAccounts();
  return NextResponse.json(result);
}
