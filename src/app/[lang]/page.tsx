import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeContent from "@/components/HomeContent";
import { homeMetadata } from "@/lib/seo/localizedMetadata";
import { isPrefixedLocale, prefixedLocales } from "@/i18n/routes";

// Google reviews are fetched on the server; refresh them hourly
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return isPrefixedLocale(lang) ? homeMetadata(lang) : {};
}

export default async function LocalizedHomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isPrefixedLocale(lang)) notFound();
  return <HomeContent />;
}
