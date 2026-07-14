import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductSection } from "@/components/home/ProductSection";
import { Breadcrumb } from "@/components/product/Breadcrumb";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { FrequentlyBought } from "@/components/product/FrequentlyBought";
import { ProductTabs } from "@/components/product/ProductTabs";
import { FloatingWidgets } from "@/components/product/FloatingWidgets";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizeHref } from "@/lib/i18n/locale-path";
import { getProductDetailBySlug } from "@/lib/product-detail.server";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) return { title: "Product" };

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const product = await getProductDetailBySlug(slug);
  if (!product) return { title: dictionary.pages.productNotFound };

  const title = locale === "en" ? product.name : product.nameBn;
  return {
    title: `${title} — Ecommerce OS`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const product = await getProductDetailBySlug(slug);

  if (!product) notFound();

  const productTitle = locale === "en" ? product.name : product.nameBn;
  const categoryTitle = locale === "en" ? product.category : product.categoryBn;

  return (
    <>
      <Breadcrumb
        items={[
          { label: dictionary.pages.home, href: localizeHref("/", locale) },
          { label: categoryTitle, href: "#" },
          { label: productTitle },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} />
          <ProductInfo product={product} />
        </div>
      </section>

      <FrequentlyBought
        products={product.frequentlyBoughtTogether}
        mainPrice={product.price}
      />

      <ProductTabs product={product} />

      <ProductSection
        title={dictionary.pages.relatedProducts}
        products={product.relatedProducts}
      />

      <ProductSection
        title={dictionary.pages.seeMore}
        products={product.crossSellProducts}
      />

      <FloatingWidgets />
    </>
  );
}
