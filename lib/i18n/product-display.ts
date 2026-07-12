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
