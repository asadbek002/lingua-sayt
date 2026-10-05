import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { pageAlternates, SITE_URL } from "@/i18n/routes";
import { getServiceDef } from "@/data/servicePages";
import { homeMeta } from "@/data/homeMeta";

const OG_LOCALE: Record<Locale, string> = { ru: "ru_RU", uz: "uz_UZ", en: "en_US" };

function build(path: string, locale: Locale, title: string, description: string, keywords?: string, absolute = false): Metadata {
  const alternates = pageAlternates(path, locale);
  const image = `${SITE_URL}/images/og-image.jpg`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: "Lingua Translation",
      locale: OG_LOCALE[locale],
      alternateLocale: Object.values(OG_LOCALE).filter((l) => l !== OG_LOCALE[locale]),
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function homeMetadata(locale: Locale): Metadata {
  const m = homeMeta[locale];
  return build("/", locale, m.title, m.description, m.keywords, true);
}

export function serviceMetadata(slug: string, locale: Locale): Metadata {
  const copy = getServiceDef(slug)?.copy[locale];
  if (!copy) return {};
  return build(`/${slug}`, locale, copy.metaTitle, copy.metaDescription);
}
