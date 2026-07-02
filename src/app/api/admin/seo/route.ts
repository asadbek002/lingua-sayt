import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateSeoTitle,
  generateSeoDescription,
  generateFaq,
  generateGoogleBusinessPost,
} from "@/lib/services/aiContentService";

function checkAdminAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
  if (!authHeader) return false;
  return authHeader === `Bearer ${ADMIN_PASSWORD}`;
}

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tasks = await prisma.seoTask.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, service, city, topic } = body;

  try {
    if (action === "generate-title") {
      const result = await generateSeoTitle(service, city);
      return NextResponse.json(result);
    }

    if (action === "generate-description") {
      const result = await generateSeoDescription(service, city);
      return NextResponse.json(result);
    }

    if (action === "generate-faq") {
      const result = await generateFaq(topic || service);
      return NextResponse.json(result);
    }

    if (action === "generate-post") {
      const result = await generateGoogleBusinessPost(topic, city);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[API/admin/seo] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
