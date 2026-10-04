import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linguatranslation.uz";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages = [
    { url: `${SITE_URL}/`, priority: 1.0 },
    { url: `${SITE_URL}/notarial-tarjima`, priority: 0.9 },
    { url: `${SITE_URL}/apostil`, priority: 0.9 },
    { url: `${SITE_URL}/diplom-tarjimasi`, priority: 0.9 },
    { url: `${SITE_URL}/metrka-tarjimasi`, priority: 0.8 },
    { url: `${SITE_URL}/nikoh-guvohnomasi-tarjimasi`, priority: 0.8 },
    { url: `${SITE_URL}/tibbiy-hujjatlar-tarjimasi`, priority: 0.8 },
    { url: `${SITE_URL}/tarjima-namangan`, priority: 0.9 },
    { url: `${SITE_URL}/tarjima-tashkent`, priority: 0.9 },
    { url: `${SITE_URL}/ingliz-tiliga-tarjima`, priority: 0.8 },
    { url: `${SITE_URL}/koreys-tiliga-tarjima`, priority: 0.8 },
    { url: `${SITE_URL}/rus-tiliga-tarjima`, priority: 0.8 },
    { url: `${SITE_URL}/blog`, priority: 0.7 },
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
    ...staticPages.map((page) => ({
      url: page.url,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: page.priority,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
