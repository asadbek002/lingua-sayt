import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";
import { homeMetadata } from "@/lib/seo/localizedMetadata";

// Google reviews are fetched on the server; refresh them hourly
export const revalidate = 3600;

export const metadata: Metadata = homeMetadata("ru");

export default function HomePage() {
  return <HomeContent />;
}
