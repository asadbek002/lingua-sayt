import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Public blog pages are cached (ISR); refresh them as soon as a post changes
function refreshPublicPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const id = new URL(req.url).searchParams.get("id");
  if (id) {
    const post = await prisma.blogPost.findUnique({ where: { id } }).catch(() => null);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json({ post });
  }

  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("[API/admin/blog] GET error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

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

    refreshPublicPages(post.slug);
    return NextResponse.json({ success: true, post });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error("[API/admin/blog] POST error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

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
  if (status === "published") {
    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true } });
    if (!existing?.publishedAt) updateData.publishedAt = new Date();
  }

  try {
    const post = await prisma.blogPost.update({ where: { id }, data: updateData });
    refreshPublicPages(post.slug);
    return NextResponse.json({ success: true, post });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") return NextResponse.json({ error: "Post not found" }, { status: 404 });
      if (err.code === "P2002") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error("[API/admin/blog] PATCH error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  try {
    const post = await prisma.blogPost.delete({ where: { id } });
    refreshPublicPages(post.slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
