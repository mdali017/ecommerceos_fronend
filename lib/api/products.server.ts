import { API_BASE_URL } from "./config";
import type { ApiErrorResponse, ApiSuccessResponse } from "./types";
import type { Product } from "./products";

export interface PublicProductsQuery {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "name";
  search?: string;
}

export interface PaginatedProducts {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function buildQueryString(query: PublicProductsQuery = {}): string {
  const params = new URLSearchParams();

  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.category) params.set("category", query.category);
  if (query.subcategory) params.set("subcategory", query.subcategory);
  if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
  if (query.sort) params.set("sort", query.sort);
  if (query.search) params.set("search", query.search);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchPublicProducts(
  query: PublicProductsQuery = {}
): Promise<PaginatedProducts> {
  const empty: PaginatedProducts = {
    products: [],
    pagination: { page: 1, limit: query.limit ?? 20, total: 0, totalPages: 0 },
  };

  try {
    const response = await fetch(
      `${API_BASE_URL}/products/public${buildQueryString(query)}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) return empty;

    const json = (await response.json()) as
      | ApiSuccessResponse<PaginatedProducts>
      | ApiErrorResponse;
    if (!json.success) return empty;

    return json.data;
  } catch {
    return empty;
  }
}

export async function fetchPublicProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/public/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return null;

    const json = (await response.json()) as ApiSuccessResponse<Product> | ApiErrorResponse;
    if (!json.success) return null;

    return json.data;
  } catch {
    return null;
  }
}
