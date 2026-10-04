import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/serverAuth";
import { slugify } from "@/lib/utils/slug";
import { TRANSLATED_LOCALES, type TranslatedLocale } from "@/lib/blogLocale";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Public blog pages are cached (ISR); refresh them as soon as a post changes
function refreshPublicPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
    revalidatePath(`/blog/${encodeURIComponent(slug)}`);
  }
}

const MIGRATION_HINT =
  "Таблица переводов не найдена. Выполните на сервере: npx prisma migrate deploy (затем перезапустите сайт).";

function isMissingTable(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && (err.code === "P2021" || err.code === "P2022");
}

type TranslationInput = { title?: string; description?: string; content?: string };
type TranslationOp = { locale: TranslatedLocale; data: { title: string; description: string | null; content: string } | null };

/** Validates `translations` from the editor: both title and text → save; all empty → remove; half-filled → error. */
function parseTranslations(raw: unknown): { ops: TranslationOp[] } | { error: string } {
  if (raw === undefined || raw === null) return { ops: [] };
  if (typeof raw !== "object") return { error: "Invalid translations" };

  const ops: TranslationOp[] = [];
  for (const locale of TRANSLATED_LOCALES) {
    const t = (raw as Record<string, TranslationInput | undefined>)[locale];
    if (t === undefined) continue;
    const title = (t.title ?? "").trim();
    const content = (t.content ?? "").trim();
    const description = (t.description ?? "").trim();
    if (!title && !content && !description) {
      ops.push({ locale, data: null });
    } else if (!title || !content) {
      return { error: `Перевод ${locale.toUpperCase()}: заполните и заголовок, и текст (или очистите все поля)` };
    } else {
      ops.push({ locale, data: { title, description: description || null, content } });
    }
  }
  return { ops };
}

async function applyTranslations(postId: string, ops: TranslationOp[]) {
  for (const op of ops) {
    if (op.data) {
      await prisma.blogPostTranslation.upsert({
        where: { postId_locale: { postId, locale: op.locale } },
        create: { postId, locale: op.locale, ...op.data },
        update: op.data,
      });
    } else {
      await prisma.blogPostTranslation.deleteMany({ where: { postId, locale: op.locale } });
    }
  }
}

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const id = new URL(req.url).searchParams.get("id");
  if (id) {
    const post = await prisma.blogPost.findUnique({ where: { id } }).catch(() => null);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    const translations = await prisma.blogPostTranslation.findMany({ where: { postId: id } }).catch(() => []);
    return NextResponse.json({ post, translations });
  }

  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    // translated locales per post (the list shows them as badges); tolerate a missing table
    const translated = await prisma.blogPostTranslation
      .findMany({ select: { postId: true, locale: true } })
      .catch(() => [] as { postId: string; locale: string }[]);
    return NextResponse.json({
      posts: posts.map((p) => ({ ...p, locales: translated.filter((t) => t.postId === p.id).map((t) => t.locale) })),
    });
  } catch (err) {
    console.error("[API/admin/blog] GET error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json();
  const { title, description, content, faq, status } = body;
  const slug = slugify(body.slug || title || "");

  if (!title || !slug || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const parsed = parseTranslations(body.translations);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

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
    await applyTranslations(post.id, parsed.ops);

    refreshPublicPages(post.slug);
    return NextResponse.json({ success: true, post });
  } catch (err) {
    if (isMissingTable(err)) return NextResponse.json({ error: MIGRATION_HINT }, { status: 500 });
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

  const parsed = parseTranslations(body.translations);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (slug !== undefined) {
    const clean = slugify(String(slug));
    if (!clean) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    updateData.slug = clean;
  }
  if (description !== undefined) updateData.description = description;
  if (content !== undefined) updateData.content = content;
  if (faq !== undefined) updateData.faq = faq;
  if (status !== undefined) updateData.status = status;

  try {
    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { publishedAt: true, slug: true } });
    if (!existing) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (status === "published" && !existing.publishedAt) updateData.publishedAt = new Date();

    const post = await prisma.blogPost.update({ where: { id }, data: updateData });
    await applyTranslations(post.id, parsed.ops);

    refreshPublicPages(post.slug);
    if (existing.slug !== post.slug) refreshPublicPages(existing.slug);
    return NextResponse.json({ success: true, post });
  } catch (err) {
    if (isMissingTable(err)) return NextResponse.json({ error: MIGRATION_HINT }, { status: 500 });
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
    const post = await prisma.blogPost.delete({ where: { id } }); // translations are removed by ON DELETE CASCADE
    refreshPublicPages(post.slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
}
