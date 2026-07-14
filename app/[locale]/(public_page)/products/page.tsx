import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/ui/ProductCard";
import { Breadcrumb } from "@/components/product/Breadcrumb";
import { ProductsFilters } from "@/components/products/ProductsFilters";
import { fetchCategories } from "@/lib/api/categories.server";
import { fetchPublicProducts } from "@/lib/api/products.server";
import { fallbackCategories } from "@/lib/data";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizeHref } from "@/lib/i18n/locale-path";
import { getCategoryDisplayName } from "@/lib/i18n/product-display";
import { mapApiProductsToStorefront } from "@/lib/product-mapper";
import { buildProductsPageHref } from "@/lib/products-page-query";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const { category, q } = await searchParams;
  if (!isLocale(localeParam)) return { title: "All Products" };

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  if (q?.trim()) {
    return {
      title: `${q.trim()} — ${dictionary.productsPage.title} — Khaas Food`,
    };
  }

  if (category) {
    const categories = await fetchCategories();
    const match = categories.find((item) => item.slug === category);
    if (match) {
      return {
        title: `${getCategoryDisplayName(match, locale)} — ${dictionary.productsPage.title} — Khaas Food`,
      };
    }
  }

  return {
    title: `${dictionary.productsPage.title} — Khaas Food`,
    description: dictionary.productsPage.subtitle,
  };
}

export default async function AllProductsPage({ params, searchParams }: PageProps) {
  const { locale: localeParam } = await params;
  const {
    category = "",
    q = "",
    sort = "newest",
    page = "1",
    minPrice = "",
    maxPrice = "",
  } = await searchParams;

  if (!isLocale(localeParam)) notFound();

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const labels = dictionary.productsPage;

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
  const searchQuery = q.trim();
  const parsedMinPrice = minPrice ? Number(minPrice) : undefined;
  const parsedMaxPrice = maxPrice ? Number(maxPrice) : undefined;

  const categories = await fetchCategories();
  const categorySource =
    categories.length > 0 ? categories : fallbackCategories;

  const categoryItems = categorySource.map((item) => ({
    slug: item.slug,
    name: getCategoryDisplayName(item, locale),
  }));

  const selectedCategory = category
    ? categoryItems.find((item) => item.slug === category)
    : undefined;

  const { products, pagination } = await fetchPublicProducts({
    category: category || undefined,
    search: searchQuery || undefined,
    sort: sortValue,
    page: pageNumber,
    limit: 24,
    minPrice:
      parsedMinPrice !== undefined && !Number.isNaN(parsedMinPrice)
        ? parsedMinPrice
        : undefined,
    maxPrice:
      parsedMaxPrice !== undefined && !Number.isNaN(parsedMaxPrice)
        ? parsedMaxPrice
        : undefined,
  });

  const storefrontProducts = mapApiProductsToStorefront(products);
  const basePath = localizeHref("/products", locale);
  const queryState = {
    category: category || undefined,
    q: searchQuery || undefined,
    sort: sortValue,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
  };

  const heading = selectedCategory
    ? selectedCategory.name
    : searchQuery
      ? `${labels.searchResultsFor} “${searchQuery}”`
      : labels.title;

  return (
    <>
      <Breadcrumb
        items={[
          { label: dictionary.pages.home, href: localizeHref("/", locale) },
          {
            label: labels.title,
            href: selectedCategory || searchQuery ? basePath : undefined,
          },
          ...(selectedCategory ? [{ label: selectedCategory.name }] : []),
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6 xl:gap-8">
          <ProductsFilters
            categories={categoryItems}
            currentCategory={category}
            currentSearch={searchQuery}
            currentMinPrice={minPrice}
            currentMaxPrice={maxPrice}
            currentSort={sortValue}
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                  {heading}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {pagination.total} {dictionary.pages.products}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <Link
                    key={option.value}
                    href={buildProductsPageHref(basePath, queryState, {
                      sort: option.value,
                      page: 1,
                    })}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
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
              <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
                {storefrontProducts.map((product) => (
                  <ProductCard key={product.id} product={product} fill />
                ))}
              </div>
            ) : (
              <div className="mt-10 rounded-xl border border-brand-border bg-brand-gray/40 px-6 py-12 text-center">
                <p className="text-lg font-semibold text-gray-800">
                  {labels.noProducts}
                </p>
                <p className="mt-2 text-sm text-gray-500">{labels.noProductsHint}</p>
                <Link
                  href={basePath}
                  className="mt-5 inline-block rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
                >
                  {labels.clearFilters}
                </Link>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                {pageNumber > 1 && (
                  <Link
                    href={buildProductsPageHref(basePath, queryState, {
                      page: pageNumber - 1,
                    })}
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
                    href={buildProductsPageHref(basePath, queryState, {
                      page: pageNumber + 1,
                    })}
                    className="rounded-lg border border-brand-border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-brand-gray"
                  >
                    {dictionary.pages.next}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
