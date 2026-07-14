"use client";

import { usePathname, useRouter } from "next/navigation";
import { localeLabels, locales, type Locale } from "@/lib/i18n/config";
import { LOCALE_COOKIE } from "@/lib/i18n/locale-cookie";
import { stripLocale } from "@/lib/i18n/locale-path";

function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSwitch = (locale: Locale) => {
    if (locale === currentLocale) return;
    setLocaleCookie(locale);
    router.push(stripLocale(pathname));
    router.refresh();
  };

  return (
    <div className="flex items-center rounded-full border border-brand-border bg-brand-gray p-0.5 text-xs font-semibold">
      {locales.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => handleSwitch(locale)}
            className={`rounded-full px-2.5 py-1 transition-colors sm:px-3 ${
              isActive
                ? "bg-brand-orange text-white"
                : "text-muted hover:text-brand-orange"
            }`}
            aria-current={isActive ? "true" : undefined}
          >
            {localeLabels[locale]}
          </button>
        );
      })}
    </div>
  );
}
