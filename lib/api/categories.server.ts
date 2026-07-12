import { API_BASE_URL, cmsFetchInit } from "./config";
import type { ApiErrorResponse, ApiSuccessResponse } from "./types";

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  icon: string;
  parentId: string | null;
  sortOrder: number;
  keywords: string;
  isActive: boolean;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, cmsFetchInit);

    if (!response.ok) return [];

    const json = (await response.json()) as ApiSuccessResponse<Category[]> | ApiErrorResponse;
    if (!json.success) return [];

    return json.data;
  } catch {
    return [];
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${slug}`, cmsFetchInit);

    if (!response.ok) return null;

    const json = (await response.json()) as ApiSuccessResponse<Category> | ApiErrorResponse;
    if (!json.success) return null;

    return json.data;
  } catch {
    return null;
  }
}
