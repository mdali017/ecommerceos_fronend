import type { Product } from "@/lib/data";
import type { Locale } from "./config";

export function getProductDisplayName(product: Product, locale: Locale): string {
  return locale === "en" ? product.name : product.nameBn;
}

export function formatProductPrice(price: number, locale: Locale): string {
  const formatted =
    locale === "en"
      ? price.toLocaleString("en-US")
      : price.toLocaleString("bn-BD");

  return `৳${formatted}`;
}

export function getCategoryDisplayName(
  category: { nameBn: string; name?: string },
  locale: Locale
): string {
  if (locale === "en") {
    return category.name?.trim() || category.nameBn;
  }
  return category.nameBn;
}

export function formatDashboardDate(iso: string, locale: Locale): string {
  const dateLocale = locale === "en" ? "en-US" : "bn-BD";
  return new Date(iso).toLocaleDateString(dateLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDashboardDateTime(iso: string, locale: Locale): string {
  const dateLocale = locale === "en" ? "en-US" : "bn-BD";
  return new Date(iso).toLocaleString(dateLocale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
