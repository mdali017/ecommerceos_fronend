import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale } from "@/lib/i18n/config";
import { LOCALE_COOKIE, parseLocaleCookie } from "@/lib/i18n/locale-cookie";

const LOCALE_FREE_PREFIXES = ["/login", "/admin", "/dashboard", "/campaign"];

function isLocaleFreePath(pathname: string) {
  return LOCALE_FREE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function setLocaleCookie(response: NextResponse, locale: string) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isLocaleFreePath(pathname)) {
    return NextResponse.next();
  }

  // Legacy prefixed URLs → clean URL + set locale cookie
  if (pathname === "/bn" || pathname.startsWith("/bn/")) {
    const cleanPath = pathname.replace(/^\/bn/, "") || "/";
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = cleanPath;
    const response = NextResponse.redirect(redirectUrl);
    setLocaleCookie(response, "bn");
    return response;
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const cleanPath = pathname.replace(/^\/en/, "") || "/";
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = cleanPath;
    const response = NextResponse.redirect(redirectUrl);
    setLocaleCookie(response, "en");
    return response;
  }

  const locale = parseLocaleCookie(request.cookies.get(LOCALE_COOKIE)?.value);

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  // Keep search params (q, category, sort, page, etc.) — new URL(path, base) drops them
  const response = NextResponse.rewrite(rewriteUrl);

  if (!request.cookies.get(LOCALE_COOKIE)?.value) {
    setLocaleCookie(response, defaultLocale);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
