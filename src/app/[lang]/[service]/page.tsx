import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePage from "@/components/ServicePage";
import { serviceMetadata } from "@/lib/seo/localizedMetadata";
import { getServiceDef, serviceSlugs } from "@/data/servicePages";
import { isPrefixedLocale, prefixedLocales } from "@/i18n/routes";

export const dynamicParams = false;

type Params = Promise<{ lang: string; service: string }>;

export function generateStaticParams() {
  return prefixedLocales.flatMap((lang) => serviceSlugs.map((service) => ({ lang, service })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, service } = await params;
  return isPrefixedLocale(lang) && getServiceDef(service) ? serviceMetadata(service, lang) : {};
}

export default async function LocalizedServicePage({ params }: { params: Params }) {
  const { lang, service } = await params;
  if (!isPrefixedLocale(lang) || !getServiceDef(service)) notFound();
  return <ServicePage slug={service} lang={lang} />;
}
