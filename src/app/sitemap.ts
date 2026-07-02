import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linguatranslation.uz";

export default function sitemap(): MetadataRoute.Sitemap {
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
    { url: `${SITE_URL}/landing/notarial-tarjima`, priority: 0.7 },
    { url: `${SITE_URL}/landing/apostil`, priority: 0.7 },
    { url: `${SITE_URL}/landing/diplom-tarjimasi`, priority: 0.7 },
    { url: `${SITE_URL}/landing/tarjima-namangan`, priority: 0.7 },
    { url: `${SITE_URL}/landing/tarjima-tashkent`, priority: 0.7 },
  ];

  return staticPages.map((page) => ({
    url: page.url,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: page.priority,
  }));
}
