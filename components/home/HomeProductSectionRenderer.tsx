import { TopSellingSection } from "@/components/home/TopSellingSection";
import { ProductSection } from "@/components/home/ProductSection";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import type { ResolvedHomepageProductSection } from "@/lib/homepage-products";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { localizeHref } from "@/lib/i18n/locale-path";

export function HomeProductSectionRenderer({
  section,
  locale,
  dictionary,
}: {
  section: ResolvedHomepageProductSection;
  locale: Locale;
  dictionary: Dictionary;
}) {
  if (section.products.length === 0) return null;

  if (section.sectionType === "grid") {
    return (
      <TopSellingSection
        products={section.products}
        title={section.title}
        viewAllHref={
          section.viewAllHref
            ? localizeHref(section.viewAllHref, locale)
            : localizeHref("/products", locale)
        }
      />
    );
  }

  if (section.sectionType === "flash_sale") {
    return (
      <FlashSaleSection
        products={section.products}
        labels={dictionary.home}
        title={section.title}
      />
    );
  }

  return (
    <ProductSection
      title={section.title}
      products={section.products}
      viewAllHref={
        section.viewAllHref
          ? localizeHref(section.viewAllHref, locale)
          : undefined
      }
    />
  );
}
