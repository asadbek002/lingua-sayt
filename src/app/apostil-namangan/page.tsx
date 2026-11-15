import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";
import { serviceMetadata } from "@/lib/seo/localizedMetadata";

export const metadata: Metadata = serviceMetadata("apostil-namangan", "ru");

export default function Page() {
  return <ServicePage slug="apostil-namangan" lang="ru" />;
}
