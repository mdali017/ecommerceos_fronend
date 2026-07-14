import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumb } from "@/components/product/Breadcrumb";
import { fetchCategoryBySlug } from "@/lib/api/categories.server";
import { fetchPublicProducts } from "@/lib/api/products.server";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizeHref } from "@/lib/i18n/locale-path";
import { getCategoryDisplayName } from "@/lib/i18n/product-display";
import { mapApiProductsToStorefront } from "@/lib/product-mapper";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) return { title: "Category" };

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const category = await fetchCategoryBySlug(slug);
  if (!category) return { title: dictionary.pages.categoryNotFound };

  const categoryName = getCategoryDisplayName(category, locale);
  return {
    title: `${categoryName} — Khaas Food`,
    description: `${categoryName} — Khaas Food`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const { sort = "newest", page = "1" } = await searchParams;

  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const category = await fetchCategoryBySlug(slug);

  if (!category) notFound();

  const sortOptions = [
    { value: "newest", label: dictionary.sort.newest },
    { value: "price_asc", label: dictionary.sort.priceAsc },
    { value: "price_desc", label: dictionary.sort.priceDesc },
    { value: "name", label: dictionary.sort.name },
  ] as const;

  const sortValue = sortOptions.some((option) => option.value === sort)
    ? (sort as (typeof sortOptions)[number]["value"])
    : "newest";
  const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);

  const { products, pagination } = await fetchPublicProducts({
    category: slug,
    sort: sortValue,
    page: pageNumber,
    limit: 24,
  });

  const storefrontProducts = mapApiProductsToStorefront(products);
  const categoryName = getCategoryDisplayName(category, locale);
  const basePath = localizeHref(`/category/${slug}`, locale);

  return (
    <>
      <Breadcrumb
        items={[
          { label: dictionary.pages.home, href: localizeHref("/", locale) },
          { label: categoryName },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            {category.icon && (
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-cream text-2xl">
                {category.icon}
              </span>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {categoryName}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {pagination.total} {dictionary.pages.products}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                href={`${basePath}?sort=${option.value}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  sortValue === option.value
                    ? "bg-brand-orange text-white"
                    : "bg-brand-gray text-gray-700 hover:bg-brand-cream"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        {storefrontProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {storefrontProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-xl border border-brand-border bg-brand-gray/40 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-gray-800">
              {dictionary.pages.noProductsInCategory}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {dictionary.pages.noProductsHint}
            </p>
            <Link
              href={localizeHref("/", locale)}
              className="mt-5 inline-block rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
            >
              {dictionary.pages.backHome}
            </Link>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            {pageNumber > 1 && (
              <Link
                href={`${basePath}?sort=${sortValue}&page=${pageNumber - 1}`}
                className="rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-gray"
              >
                {dictionary.pages.previous}
              </Link>
            )}
            <span className="text-sm text-gray-500">
              {dictionary.pages.page} {pagination.page} / {pagination.totalPages}
            </span>
            {pageNumber < pagination.totalPages && (
              <Link
                href={`${basePath}?sort=${sortValue}&page=${pageNumber + 1}`}
                className="rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-gray"
              >
                {dictionary.pages.next}
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  );
}
