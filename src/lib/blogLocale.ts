import type { Locale } from "@/i18n/config";

// The Russian version lives in the BlogPost row itself; uz/en are translations.
export const BLOG_LOCALES = ["ru", "uz", "en"] as const;
export const TRANSLATED_LOCALES = ["uz", "en"] as const;
export type TranslatedLocale = (typeof TRANSLATED_LOCALES)[number];

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogContent {
  title: string;
  description: string;
  content: string;
  faq: BlogFaq[] | null;
}

/** Plain, serializable post data handed from server components to the client views. */
export interface PublicPost {
  slug: string;
  publishedAt: string | null;
  updatedAt: string;
  base: BlogContent; // Russian
  translations: Partial<Record<TranslatedLocale, BlogContent>>;
}

export function parseFaq(value: unknown): BlogFaq[] | null {
  if (!Array.isArray(value)) return null;
  const items = value
    .filter((f): f is BlogFaq => !!f && typeof f.question === "string" && typeof f.answer === "string")
    .map((f) => ({ question: f.question, answer: f.answer }));
  return items.length ? items : null;
}

/** Picks the version for the visitor's language, falling back to Russian when it is not translated yet. */
export function pickContent(post: Pick<PublicPost, "base" | "translations">, locale: Locale): BlogContent {
  if (locale === "ru") return post.base;
  const tr = post.translations[locale as TranslatedLocale];
  return tr && tr.title && tr.content ? tr : post.base;
}

export function hasTranslation(post: Pick<PublicPost, "translations">, locale: Locale): boolean {
  return locale === "ru" || !!post.translations[locale as TranslatedLocale]?.content;
}
