import { defaultLocale, locales, type Locale } from "./config";
import { serviceSlugs } from "@/data/serviceSlugs";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://linguatranslation.uz";

/** Locales that live under a URL prefix (/uz, /en). Russian is the unprefixed default. */
export const prefixedLocales = locales.filter((l) => l !== defaultLocale);

export function isPrefixedLocale(value: string): value is Locale {
  return (prefixedLocales as readonly string[]).includes(value);
}

export function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? "" : `/${locale}`;
}

/** "/apostil" + "uz" -> "/uz/apostil"; "/" + "uz" -> "/uz"; hash and query are kept. */
export function localizedPath(path: string, locale: Locale): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return localePrefix(locale) || "/";
  return `${localePrefix(locale)}${clean}`;
}

/** Splits "/uz/apostil" into { locale: "uz", path: "/apostil" }; unprefixed paths are Russian. */
export function splitLocalePath(pathname: string): { locale: Locale; path: string } {
  const [, first = "", ...rest] = pathname.split("/");
  if (isPrefixedLocale(first)) return { locale: first, path: `/${rest.join("/")}` };
  return { locale: defaultLocale, path: pathname || "/" };
}

/** Pages that exist in every language under their own URL (the home page and the service pages). */
export function isLocalizedPage(path: string): boolean {
  const clean = path.replace(/\/+$/, "") || "/";
  return clean === "/" || (serviceSlugs as readonly string[]).includes(clean.slice(1));
}

/** Canonical + hreflang alternates for a localized page. */
export function pageAlternates(path: string, locale: Locale) {
  return {
    canonical: `${SITE_URL}${localizedPath(path, locale)}`,
    languages: {
      ru: `${SITE_URL}${localizedPath(path, "ru")}`,
      uz: `${SITE_URL}${localizedPath(path, "uz")}`,
      en: `${SITE_URL}${localizedPath(path, "en")}`,
      "x-default": `${SITE_URL}${localizedPath(path, "ru")}`,
    },
  };
}
