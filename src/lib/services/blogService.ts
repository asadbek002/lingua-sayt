import { prisma } from "@/lib/prisma";
import { parseFaq, type BlogContent, type PublicPost, type TranslatedLocale } from "@/lib/blogLocale";

type PostRow = {
  slug: string;
  title: string;
  description: string | null;
  content: string;
  faq: unknown;
  publishedAt: Date | null;
  updatedAt: Date;
  id: string;
};

type TranslationRow = {
  postId: string;
  locale: string;
  title: string;
  description: string | null;
  content: string;
  faq: unknown;
};

function toContent(r: { title: string; description: string | null; content: string; faq: unknown }): BlogContent {
  return { title: r.title, description: r.description ?? "", content: r.content, faq: parseFaq(r.faq) };
}

/** Translations are read in a separate query so the blog keeps working even before the migration is applied. */
async function loadTranslations(postIds: string[]): Promise<TranslationRow[]> {
  if (postIds.length === 0) return [];
  try {
    return await prisma.blogPostTranslation.findMany({ where: { postId: { in: postIds } } });
  } catch (err) {
    console.error("[BlogService] translations unavailable (run `prisma migrate deploy`):", err);
    return [];
  }
}

function assemble(rows: PostRow[], translations: TranslationRow[]): PublicPost[] {
  return rows.map((r) => {
    const mine: PublicPost["translations"] = {};
    for (const t of translations.filter((t) => t.postId === r.id)) {
      if (t.locale === "uz" || t.locale === "en") mine[t.locale as TranslatedLocale] = toContent(t);
    }
    return {
      slug: r.slug,
      publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
      updatedAt: r.updatedAt.toISOString(),
      base: toContent(r),
      translations: mine,
    };
  });
}

export async function getPublishedPosts(limit?: number): Promise<PublicPost[]> {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
    return assemble(rows, await loadTranslations(rows.map((r) => r.id)));
  } catch {
    return [];
  }
}

export async function getPublishedPost(slug: string): Promise<PublicPost | null> {
  try {
    const row = await prisma.blogPost.findUnique({ where: { slug, status: "published" } });
    if (!row) return null;
    return assemble([row], await loadTranslations([row.id]))[0];
  } catch {
    return null;
  }
}
