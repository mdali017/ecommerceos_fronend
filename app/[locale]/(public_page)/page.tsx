import { HeroSection } from "@/components/home/HeroSection";
import { CategoryIcons } from "@/components/home/CategoryIcons";
import { TopSellingSection } from "@/components/home/TopSellingSection";
import { BrandStrip } from "@/components/home/BrandStrip";
import { ProductSection } from "@/components/home/ProductSection";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { PromoBanner } from "@/components/home/PromoBanner";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { fetchCategories } from "@/lib/api/categories.server";
import { getHomepageCmsContent } from "@/lib/homepage-cms.server";
import { getHomepageProducts } from "@/lib/homepage-products";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizeHref } from "@/lib/i18n/locale-path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return { title: "Khaas Food" };

  const dictionary = await getDictionary(localeParam as Locale);
  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  const [{ topSelling, mango, honey, spice, flashSale }, categories, cms] = await Promise.all([
    getHomepageProducts(),
    fetchCategories(),
    getHomepageCmsContent(locale, dictionary),
  ]);

  return (
    <>
      <HeroSection slides={cms.heroSlides} seasonal={cms.seasonalBanner} />
      <CategoryIcons categories={categories} locale={locale} />
      <TopSellingSection products={topSelling} title={dictionary.home.topSelling} />
      <BrandStrip title={dictionary.home.brands} brands={cms.brandStripItems} />
      {mango.length > 0 && (
        <ProductSection
          title={dictionary.home.freshMango}
          products={mango}
          viewAllHref={localizeHref("/category/am", locale)}
        />
      )}
      <FlashSaleSection products={flashSale} labels={dictionary.home} />
      {honey.length > 0 && (
        <ProductSection
          title={dictionary.home.pureHoney}
          products={honey}
          viewAllHref={localizeHref("/category/modhu", locale)}
        />
      )}
      <PromoBanner
        title={cms.promoBanner.title}
        subtitle={cms.promoBanner.subtitle}
        image={cms.promoBanner.image}
      />
      {spice.length > 0 && (
        <ProductSection
          title={dictionary.home.spiceCollection}
          products={spice}
          viewAllHref={localizeHref("/category/moshla", locale)}
        />
      )}
      <TestimonialsSection
        title={dictionary.home.testimonials}
        testimonials={cms.testimonials}
      />
    </>
  );
}
