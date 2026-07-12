import { API_BASE_URL, cmsFetchInit } from "./config";
import type { ApiErrorResponse, ApiSuccessResponse } from "./types";
import type { Locale } from "@/lib/i18n/config";

export type HomepageSectionType = "grid" | "carousel" | "flash_sale";
export type HomepageProductSource = "featured" | "on_sale" | "category" | "manual";

export interface HomepageProductSectionRecord {
  id: string;
  titleBn: string;
  titleEn: string;
  sectionType: HomepageSectionType;
  productSource: HomepageProductSource;
  categorySlug: string;
  categoryKeywords: string;
  productSkus: string;
  maxProducts: number;
  sortOrder: number;
  isActive: boolean;
}

export interface HomepageProductSectionConfig {
  id: string;
  title: string;
  sectionType: HomepageSectionType;
  productSource: HomepageProductSource;
  categorySlug: string;
  categoryKeywords: string[];
  productSkus: string[];
  maxProducts: number;
  sortOrder: number;
}

export async function fetchHomepageProductSections(): Promise<HomepageProductSectionRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/homepage-product-sections`, cmsFetchInit);

    if (!response.ok) return [];

    const json = (await response.json()) as
      | ApiSuccessResponse<HomepageProductSectionRecord[]>
      | ApiErrorResponse;
    if (!json.success) return [];

    return json.data;
  } catch {
    return [];
  }
}

export function mapHomepageProductSectionsForLocale(
  sections: HomepageProductSectionRecord[],
  locale: Locale
): HomepageProductSectionConfig[] {
  return sections
    .filter((section) => section.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section) => ({
      id: section.id,
      title:
        locale === "bn"
          ? section.titleBn
          : section.titleEn.trim() || section.titleBn,
      sectionType: section.sectionType,
      productSource: section.productSource,
      categorySlug: section.categorySlug.trim(),
      categoryKeywords: section.categoryKeywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
      productSkus: section.productSkus
        .split(",")
        .map((sku) => sku.trim())
        .filter(Boolean),
      maxProducts: section.maxProducts,
      sortOrder: section.sortOrder,
    }));
}
