import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { serviceMetadata } from "@/lib/seo/localizedMetadata";

export const metadata: Metadata = serviceMetadata("ingliz-tiliga-tarjima", "ru");

export default function Page() {
  return <ServicePage slug="ingliz-tiliga-tarjima" lang="ru" />;
}
