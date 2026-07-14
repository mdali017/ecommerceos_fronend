import { HeroSection } from "@/components/home/HeroSection";
import { CategoryIcons } from "@/components/home/CategoryIcons";
import { BrandStrip } from "@/components/home/BrandStrip";
import { PromoBanner } from "@/components/home/PromoBanner";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { HomeProductSectionRenderer } from "@/components/home/HomeProductSectionRenderer";
import { fetchCategories } from "@/lib/api/categories.server";
import { getHomepageCmsContent } from "@/lib/homepage-cms.server";
import {
  getHomepageProductSections,
  groupHomepageProductSections,
} from "@/lib/homepage-products";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return { title: "Ecommerce OS" };

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

  const [productSections, categories, cms] = await Promise.all([
    getHomepageProductSections(locale, dictionary),
    fetchCategories(),
    getHomepageCmsContent(locale, dictionary),
  ]);

  const { beforeBrand, beforePromo, afterPromo } =
    groupHomepageProductSections(productSections);

  return (
    <>
      <HeroSection slides={cms.heroSlides} seasonal={cms.seasonalBanner} />
      <CategoryIcons categories={categories} locale={locale} />

      {beforeBrand.map((section) => (
        <HomeProductSectionRenderer
          key={section.id}
          section={section}
          locale={locale}
          dictionary={dictionary}
        />
      ))}

      <BrandStrip title={dictionary.home.brands} brands={cms.brandStripItems} />

      {beforePromo.map((section) => (
        <HomeProductSectionRenderer
          key={section.id}
          section={section}
          locale={locale}
          dictionary={dictionary}
        />
      ))}

      <PromoBanner
        title={cms.promoBanner.title}
        subtitle={cms.promoBanner.subtitle}
        image={cms.promoBanner.image}
      />

      {afterPromo.map((section) => (
        <HomeProductSectionRenderer
          key={section.id}
          section={section}
          locale={locale}
          dictionary={dictionary}
        />
      ))}

      <TestimonialsSection
        title={dictionary.home.testimonials}
        testimonials={cms.testimonials}
      />
    </>
  );
}
