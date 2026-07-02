export const locales = ["ru", "uz", "en"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  ru: "RU",
  uz: "UZ",
  en: "EN",
};

export const localeLongLabels: Record<Locale, string> = {
  ru: "Русский",
  uz: "O'zbek",
  en: "English",
};

export const defaultLocale: Locale = "ru";
