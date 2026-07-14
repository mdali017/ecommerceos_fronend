export type ProductsPageQuery = {
  category?: string;
  q?: string;
  sort?: string;
  page?: number | string;
  minPrice?: string | number;
  maxPrice?: string | number;
};

export function buildProductsPageHref(
  basePath: string,
  query: ProductsPageQuery,
  overrides: ProductsPageQuery = {}
): string {
  const merged: ProductsPageQuery = { ...query, ...overrides };
  const params = new URLSearchParams();

  if (merged.category) params.set("category", merged.category);
  if (merged.q?.trim()) params.set("q", merged.q.trim());
  if (merged.sort && merged.sort !== "newest") params.set("sort", merged.sort);

  const minPrice =
    merged.minPrice !== undefined && merged.minPrice !== ""
      ? String(merged.minPrice)
      : undefined;
  const maxPrice =
    merged.maxPrice !== undefined && merged.maxPrice !== ""
      ? String(merged.maxPrice)
      : undefined;

  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);

  const page =
    merged.page !== undefined ? Number(merged.page) : undefined;
  if (page && page > 1) params.set("page", String(page));

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
