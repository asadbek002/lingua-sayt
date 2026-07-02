import type { Metadata } from "next";
import { company } from "@/data/company";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linguatranslation.uz";

export function buildMetadata({
  title,
  description,
  slug = "",
  keywords = [],
}: {
  title: string;
  description: string;
  slug?: string;
  keywords?: string[];
}): Metadata {
  const url = `${SITE_URL}${slug}`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: company.legalName }],
    creator: company.legalName,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: company.name,
      locale: "ru_RU",
      type: "website",
      images: [{ url: `${SITE_URL}/images/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/images/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}
