import {
  fetchHomepageProductSections,
  mapHomepageProductSectionsForLocale,
  type HomepageProductSectionConfig,
} from "@/lib/api/homepage-product-sections.server";
import { cmsFetchInit } from "@/lib/api/config";
import { fetchAllPublicProducts } from "@/lib/api/products.server";
import type { Product as ApiProduct } from "@/lib/api/products";
import {
  filterByCategory,
  filterOnSale,
  mapApiProductsToStorefront,
} from "@/lib/product-mapper";
import type { Product } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import {
  flashSaleProducts,
  honeyProducts,
  mangoProducts,
  spiceProducts,
  topSellingProducts,
} from "@/lib/data";

export interface ResolvedHomepageProductSection {
  id: string;
  title: string;
  sectionType: HomepageProductSectionConfig["sectionType"];
  viewAllHref?: string;
  products: Product[];
  sortOrder: number;
}

const BRAND_STRIP_SORT_ORDER = 20;
const PROMO_BANNER_SORT_ORDER = 60;

export const HOMEPAGE_BRAND_SORT_ORDER = BRAND_STRIP_SORT_ORDER;
export const HOMEPAGE_PROMO_SORT_ORDER = PROMO_BANNER_SORT_ORDER;

const FALLBACK_SECTIONS: HomepageProductSectionConfig[] = [
  {
    id: "fallback-top-selling",
    title: "",
    sectionType: "grid",
    productSource: "manual",
    categorySlug: "",
    categoryKeywords: [],
    productSkus: ["KF-001", "KF-002", "KF-003", "KF-004", "KF-005", "KF-006"],
    maxProducts: 6,
    sortOrder: 10,
  },
  {
    id: "fallback-mango",
    title: "",
    sectionType: "carousel",
    productSource: "manual",
    categorySlug: "am",
    categoryKeywords: ["mango", "আম"],
    productSkus: ["KF-007", "KF-008", "KF-009", "KF-010", "KF-011"],
    maxProducts: 12,
    sortOrder: 30,
  },
  {
    id: "fallback-flash-sale",
    title: "",
    sectionType: "flash_sale",
    productSource: "manual",
    categorySlug: "",
    categoryKeywords: [],
    productSkus: ["KF-021", "KF-022", "KF-023", "KF-024", "KF-025"],
    maxProducts: 12,
    sortOrder: 40,
  },
  {
    id: "fallback-honey",
    title: "",
    sectionType: "carousel",
    productSource: "manual",
    categorySlug: "modhu",
    categoryKeywords: ["honey", "মধু"],
    productSkus: ["KF-012", "KF-013", "KF-014", "KF-015", "KF-016"],
    maxProducts: 12,
    sortOrder: 50,
  },
  {
    id: "fallback-spice",
    title: "",
    sectionType: "carousel",
    productSource: "manual",
    categorySlug: "moshla",
    categoryKeywords: ["spice", "মশলা"],
    productSkus: ["KF-006", "KF-017", "KF-018", "KF-019", "KF-020"],
    maxProducts: 12,
    sortOrder: 70,
  },
];

const FALLBACK_PRODUCTS_BY_SECTION: Record<string, Product[]> = {
  "fallback-top-selling": topSellingProducts,
  "fallback-mango": mangoProducts,
  "fallback-flash-sale": flashSaleProducts,
  "fallback-honey": honeyProducts,
  "fallback-spice": spiceProducts,
};

const FALLBACK_TITLES: Record<string, keyof Dictionary["home"]> = {
  "fallback-top-selling": "topSelling",
  "fallback-mango": "freshMango",
  "fallback-flash-sale": "flashSale",
  "fallback-honey": "pureHoney",
  "fallback-spice": "spiceCollection",
};

function pickProductsBySku(products: ApiProduct[], skus: string[]) {
  const bySku = new Map(products.map((product) => [product.sku, product]));
  return skus
    .map((sku) => bySku.get(sku))
    .filter((product): product is ApiProduct => Boolean(product));
}

function resolveProductsForSection(
  section: HomepageProductSectionConfig,
  apiProducts: ApiProduct[]
): Product[] {
  if (section.productSkus.length > 0) {
    const skuProducts = pickProductsBySku(apiProducts, section.productSkus);
    if (skuProducts.length > 0) {
      return mapApiProductsToStorefront(skuProducts).slice(0, section.maxProducts);
    }
  }

  let sourceProducts: ApiProduct[] = [];

  switch (section.productSource) {
    case "manual":
      sourceProducts = pickProductsBySku(apiProducts, section.productSkus);
      break;
    case "featured":
      sourceProducts = apiProducts.filter((product) => product.featured);
      break;
    case "on_sale":
      sourceProducts = filterOnSale(apiProducts);
      break;
    case "category":
      sourceProducts =
        section.categoryKeywords.length > 0
          ? filterByCategory(apiProducts, section.categoryKeywords)
          : [];
      break;
  }

  const mapped = mapApiProductsToStorefront(sourceProducts).slice(0, section.maxProducts);
  if (mapped.length > 0) return mapped;

  return (FALLBACK_PRODUCTS_BY_SECTION[section.id] ?? []).slice(0, section.maxProducts);
}

function resolveTitle(
  section: HomepageProductSectionConfig,
  dictionary: Dictionary
): string {
  if (section.title) return section.title;

  const fallbackKey = FALLBACK_TITLES[section.id];
  return fallbackKey ? dictionary.home[fallbackKey] : section.title;
}

export async function getHomepageProductSections(
  locale: Locale,
  dictionary: Dictionary
): Promise<ResolvedHomepageProductSection[]> {
  const sectionRecords = await fetchHomepageProductSections();
  const sectionConfigs =
    sectionRecords.length > 0
      ? mapHomepageProductSectionsForLocale(sectionRecords, locale)
      : FALLBACK_SECTIONS.map((section) => ({
          ...section,
          title: resolveTitle(section, dictionary),
        }));

  const apiProducts = await fetchAllPublicProducts(cmsFetchInit);

  return sectionConfigs
    .map((section) => ({
      id: section.id,
      title: resolveTitle(section, dictionary),
      sectionType: section.sectionType,
      viewAllHref: section.categorySlug
        ? `/products?category=${section.categorySlug}`
        : "/products",
      products: resolveProductsForSection(section, apiProducts),
      sortOrder: section.sortOrder,
    }))
    .filter((section) => section.products.length > 0);
}

export function groupHomepageProductSections(sections: ResolvedHomepageProductSection[]) {
  return {
    beforeBrand: sections.filter((section) => section.sortOrder < BRAND_STRIP_SORT_ORDER),
    beforePromo: sections.filter(
      (section) =>
        section.sortOrder >= BRAND_STRIP_SORT_ORDER &&
        section.sortOrder < PROMO_BANNER_SORT_ORDER
    ),
    afterPromo: sections.filter((section) => section.sortOrder >= PROMO_BANNER_SORT_ORDER),
  };
}
