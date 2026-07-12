export const locales = ["bn", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "bn";

export const localeLabels: Record<Locale, string> = {
  bn: "বাং",
  en: "EN",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
