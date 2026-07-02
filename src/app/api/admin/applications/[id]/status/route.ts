import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

function checkAdminAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
  if (!authHeader) return false;
  return authHeader === `Bearer ${ADMIN_PASSWORD}`;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  const validStatuses = Object.values(ApplicationStatus);
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const application = await prisma.application.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, application });
  } catch {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }
}
