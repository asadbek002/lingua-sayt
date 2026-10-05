import type { Locale } from "@/i18n/config";

export interface ServiceCopy {
  /** Short name: breadcrumbs and "other services" links */
  label: string;
  /** <title> without the brand (the root layout template appends it) */
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  serviceName: string;
  benefits: string[];
  sections: { heading: string; paragraphs: string[] }[];
  faqs: { question: string; answer: string }[];
}

export interface ServiceDef {
  /** URL segment, identical in every language: /apostil, /uz/apostil, /en/apostil */
  slug: string;
  /** slugs of related services */
  related: string[];
  copy: Record<Locale, ServiceCopy>;
}
