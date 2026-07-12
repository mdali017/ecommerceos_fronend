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
    const response = NextResponse.redirect(new URL(cleanPath, request.url));
    setLocaleCookie(response, "bn");
    return response;
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const cleanPath = pathname.replace(/^\/en/, "") || "/";
    const response = NextResponse.redirect(new URL(cleanPath, request.url));
    setLocaleCookie(response, "en");
    return response;
  }

  const locale = parseLocaleCookie(request.cookies.get(LOCALE_COOKIE)?.value);

  const rewritePath = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  const response = NextResponse.rewrite(new URL(rewritePath, request.url));

  if (!request.cookies.get(LOCALE_COOKIE)?.value) {
    setLocaleCookie(response, defaultLocale);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
