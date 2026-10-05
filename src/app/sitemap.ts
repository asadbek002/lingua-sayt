import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { serviceSlugs } from "@/data/serviceSlugs";
import { localizedPath, pageAlternates } from "@/i18n/routes";
import { locales } from "@/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linguatranslation.uz";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages = [
    { path: "/", priority: 1.0 },
    ...serviceSlugs.map((slug) => ({ path: `/${slug}`, priority: 0.9 })),
    { path: "/blog", priority: 0.7, localized: false },
  ];

  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    // DB unavailable at build time — static pages only
  }

  return [
    // home + service pages exist in every language, each entry lists its hreflang alternates
    ...staticPages.flatMap((page) =>
      "localized" in page && page.localized === false
        ? [{ url: `${SITE_URL}${page.path}`, lastModified: now, changeFrequency: "weekly" as const, priority: page.priority }]
        : locales.map((locale) => ({
            url: `${SITE_URL}${localizedPath(page.path, locale)}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: locale === "ru" ? page.priority : Math.max(page.priority - 0.1, 0.5),
            alternates: { languages: pageAlternates(page.path, locale).languages },
          }))
    ),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
