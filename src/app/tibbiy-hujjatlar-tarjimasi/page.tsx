import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { serviceMetadata } from "@/lib/seo/localizedMetadata";

export const metadata: Metadata = serviceMetadata("tibbiy-hujjatlar-tarjimasi", "ru");

export default function Page() {
  return <ServicePage slug="tibbiy-hujjatlar-tarjimasi" lang="ru" />;
}
