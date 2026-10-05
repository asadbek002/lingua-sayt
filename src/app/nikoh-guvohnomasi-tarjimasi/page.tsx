import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { serviceMetadata } from "@/lib/seo/localizedMetadata";

export const metadata: Metadata = serviceMetadata("nikoh-guvohnomasi-tarjimasi", "ru");

export default function Page() {
  return <ServicePage slug="nikoh-guvohnomasi-tarjimasi" lang="ru" />;
}
