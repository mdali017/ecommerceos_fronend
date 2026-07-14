"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/providers/LocaleProvider";
import { buildProductsPageHref } from "@/lib/products-page-query";

type CategoryItem = {
  slug: string;
  name: string;
};

export function ProductsFilters({
  categories,
  currentCategory = "",
  currentSearch = "",
  currentMinPrice = "",
  currentMaxPrice = "",
  currentSort = "newest",
}: {
  categories: CategoryItem[];
  currentCategory?: string;
  currentSearch?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
  currentSort?: string;
}) {
  const router = useRouter();
  const { dictionary, localizePath } = useLocale();
  const basePath = localizePath("/products");
  const labels = dictionary.productsPage;

  const [search, setSearch] = useState(currentSearch);
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  const baseQuery = {
    category: currentCategory || undefined,
    q: currentSearch || undefined,
    sort: currentSort,
    minPrice: currentMinPrice || undefined,
    maxPrice: currentMaxPrice || undefined,
  };

  const applySearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      buildProductsPageHref(basePath, baseQuery, {
        q: search.trim() || undefined,
        page: 1,
      })
    );
  };

  const applyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      buildProductsPageHref(basePath, baseQuery, {
        minPrice: minPrice.trim() || undefined,
        maxPrice: maxPrice.trim() || undefined,
        page: 1,
      })
    );
  };

  const hasActiveFilters =
    Boolean(currentCategory) ||
    Boolean(currentSearch) ||
    Boolean(currentMinPrice) ||
    Boolean(currentMaxPrice);

  const filterBody = (
    <div className="space-y-6">
      <form onSubmit={applySearch} className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          {labels.search}
        </label>
        <div className="flex gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-orange"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-brand-orange px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
          >
            {labels.apply}
          </button>
        </div>
      </form>

      <div>
        <p className="mb-2 text-sm font-semibold text-gray-900">
          {labels.categories}
        </p>
        <ul className="space-y-1">
          <li>
            <Link
              href={buildProductsPageHref(basePath, baseQuery, {
                category: undefined,
                page: 1,
              })}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                !currentCategory
                  ? "bg-brand-orange/10 font-semibold text-brand-orange"
                  : "text-gray-700 hover:bg-brand-gray"
              }`}
            >
              {labels.allCategories}
            </Link>
          </li>
          {categories.map((category) => {
            const active = currentCategory === category.slug;
            return (
              <li key={category.slug}>
                <Link
                  href={buildProductsPageHref(basePath, baseQuery, {
                    category: category.slug,
                    page: 1,
                  })}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-brand-orange/10 font-semibold text-brand-orange"
                      : "text-gray-700 hover:bg-brand-gray"
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <form onSubmit={applyPrice} className="space-y-2">
        <p className="text-sm font-semibold text-gray-900">{labels.priceRange}</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={labels.minPrice}
            className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-orange"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={labels.maxPrice}
            className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-orange"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-brand-gray"
        >
          {labels.applyPrice}
        </button>
      </form>

      {hasActiveFilters ? (
        <Link
          href={buildProductsPageHref(basePath, { sort: currentSort })}
          className="inline-block text-sm font-medium text-brand-orange transition-colors hover:text-brand-orange-dark"
        >
          {labels.clearFilters}
        </Link>
      ) : null}
    </div>
  );

  return (
    <aside className="lg:sticky lg:top-20 lg:z-10 lg:w-60 lg:shrink-0 xl:w-64">
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        className="flex w-full items-center justify-between rounded-lg border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-gray-900 lg:hidden"
      >
        {labels.filters}
        <span className="text-brand-orange">{mobileOpen ? "−" : "+"}</span>
      </button>

      <div
        className={`${
          mobileOpen ? "mt-3 block" : "hidden"
        } rounded-xl border border-brand-border bg-white p-4 lg:mt-0 lg:block`}
      >
        <h2 className="mb-4 hidden text-base font-bold text-gray-900 lg:block">
          {labels.filters}
        </h2>
        {filterBody}
      </div>
    </aside>
  );
}
