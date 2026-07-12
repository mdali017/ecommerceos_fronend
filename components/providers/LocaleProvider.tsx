"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/locale-path";
import {
  formatProductPrice,
  getCategoryDisplayName,
  getProductDisplayName,
} from "@/lib/i18n/product-display";
import type { Dictionary } from "@/lib/i18n/types";
import type { Product } from "@/lib/data";

interface LocaleContextValue {
  locale: Locale;
  dictionary: Dictionary;
  localizePath: (href: string) => string;
  getProductName: (product: Product) => string;
  formatPrice: (price: number) => string;
  getCategoryName: (category: { nameBn: string; name?: string }) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dictionary,
      localizePath: (href: string) => localizeHref(href, locale),
      getProductName: (product: Product) => getProductDisplayName(product, locale),
      formatPrice: (price: number) => formatProductPrice(price, locale),
      getCategoryName: (category) => getCategoryDisplayName(category, locale),
    }),
    [dictionary, locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
