import { defaultLocale, isLocale, type Locale } from "./config";

export const LOCALE_COOKIE = "locale";

export function parseLocaleCookie(value: string | undefined | null): Locale {
  if (value && isLocale(value)) return value;
  return defaultLocale;
}
