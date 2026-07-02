"use client";

import { createContext, useContext, useState, useEffect, useLayoutEffect, ReactNode } from "react";
import { Locale, defaultLocale, locales } from "./config";
import { translations, TranslationSchema } from "./translations";

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
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useIsomorphicLayoutEffect(() => {
    try {
      const saved = localStorage.getItem("lingua-locale") as Locale;
      if (saved && (locales as readonly string[]).includes(saved)) {
        setLocaleState(saved);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
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
