import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(req);
  if (denied) return denied;

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
