import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { serviceMetadata } from "@/lib/seo/localizedMetadata";

export const metadata: Metadata = serviceMetadata("rus-tiliga-tarjima", "ru");

export default function Page() {
  return <ServicePage slug="rus-tiliga-tarjima" lang="ru" />;
}
