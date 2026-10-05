"use client";

import { createContext, useContext, useState, useEffect, useLayoutEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Locale, defaultLocale, locales } from "./config";
import { translations, TranslationSchema } from "./translations";
import { isLocalizedPage, splitLocalePath } from "./routes";

// useLayoutEffect fires synchronously before paint on the client, eliminating the
// flash of default-locale content. Falls back to useEffect on the server (no-op).
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationSchema;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: defaultLocale,
  setLocale: () => {},
  t: translations[defaultLocale],
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Locale>(defaultLocale);

  // The home page and the service pages have a URL per language (/, /uz, /en, ...):
  // there the URL decides the language, so the server renders it and a saved preference cannot override it.
  // Everywhere else (blog, ...) the visitor's saved choice applies.
  const { locale: urlLocale, path } = splitLocalePath(usePathname());
  const pinned = isLocalizedPage(path) ? urlLocale : null;
  const locale = pinned ?? saved;

  useIsomorphicLayoutEffect(() => {
    try {
      const stored = localStorage.getItem("lingua-locale") as Locale;
      if (stored && (locales as readonly string[]).includes(stored)) {
        setSaved(stored);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  // Keep <html lang> in step with the page language and remember it for pages without a locale in the URL.
  useEffect(() => {
    document.documentElement.lang = locale;
    if (pinned) {
      try {
        localStorage.setItem("lingua-locale", pinned);
      } catch {
        // localStorage not available
      }
    }
  }, [locale, pinned]);

  const setLocale = (l: Locale) => {
    setSaved(l);
    try {
      localStorage.setItem("lingua-locale", l);
    } catch {
      // localStorage not available
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
