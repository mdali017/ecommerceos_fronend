import type { Locale } from "./config";

const LOCALE_FREE_PREFIXES = ["/login", "/admin", "/dashboard", "/campaign"];

export function stripLocale(pathname: string): string {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  }

  if (pathname === "/bn" || pathname.startsWith("/bn/")) {
    return pathname.replace(/^\/bn(?=\/|$)/, "") || "/";
  }

  return pathname || "/";
}

/** Locale is stored in a cookie — URLs never include /bn or /en. */
export function localizeHref(href: string, _locale?: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) {
    return href;
  }

  if (LOCALE_FREE_PREFIXES.some((prefix) => href.startsWith(prefix))) {
    return href;
  }

  return stripLocale(href);
}

export function switchLocalePath(pathname: string, _nextLocale: Locale): string {
  return stripLocale(pathname);
}
