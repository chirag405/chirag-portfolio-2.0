import { defineRouting } from "next-intl/routing";

export const locales = ["en", "hi", "es", "fr", "ja"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  es: "Español",
  fr: "Français",
  ja: "日本語",
};

/** Short codes for the compact hero switcher — full names still show as a title/tooltip. */
export const localeCodes: Record<Locale, string> = {
  en: "EN",
  hi: "HI",
  es: "ES",
  fr: "FR",
  ja: "JA",
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});
