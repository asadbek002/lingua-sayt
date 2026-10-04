import { NextRequest, NextResponse } from "next/server";
import { ApplicationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const page = Math.max(parseInt(searchParams.get("page") || "1") || 1, 1);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20") || 20, 1), 100);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim();

  const where: Prisma.ApplicationWhereInput = {};
  if (status && (Object.values(ApplicationStatus) as string[]).includes(status)) {
    where.status = status as ApplicationStatus;
  }
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }

  try {
    const [applications, total, grouped] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.application.count({ where }),
      prisma.application.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);

    const counts: Record<string, number> = {};
    for (const g of grouped) counts[g.status] = g._count._all;

    return NextResponse.json({ applications, total, page, limit, counts });
  } catch (err) {
    console.error("[API/admin/applications] DB error:", err);
    return NextResponse.json(
      { error: "Database error. Check DATABASE_URL and run `prisma migrate deploy`." },
      { status: 500 }
    );
  }
}
