import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function checkAdminAuth(req: NextRequest): boolean {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) return false;
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return false;
  return authHeader === `Bearer ${ADMIN_PASSWORD}`;
}

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, description, content, faq, status } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        description,
        content,
        faq,
        status: status || "draft",
        publishedAt: status === "published" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, title, slug, description, content, faq, status } = body;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (slug !== undefined) updateData.slug = slug;
  if (description !== undefined) updateData.description = description;
  if (content !== undefined) updateData.content = content;
  if (faq !== undefined) updateData.faq = faq;
  if (status !== undefined) updateData.status = status;
  updateData.publishedAt = status === "published" ? new Date() : undefined;

  const post = await prisma.blogPost.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ success: true, post });
}
