import { apiRequest, apiUpload } from "./client";
import type { Category } from "./categories.server";

export type { Category };

export interface CategoryInput {
  slug: string;
  name: string;
  nameBn: string;
  icon: string;
  sortOrder?: number;
  keywords?: string;
  isActive?: boolean;
  parentId?: string | null;
}

export function listAllCategories(token: string) {
  return apiRequest<Category[]>("/categories/admin/all", { token });
}

export function createCategory(input: CategoryInput, token: string) {
  return apiRequest<Category>("/categories", {
    method: "POST",
    token,
    body: input,
  });
}

export function updateCategory(id: string, input: Partial<CategoryInput>, token: string) {
  return apiRequest<Category>(`/categories/${id}`, {
    method: "PUT",
    token,
    body: input,
  });
}

export function deleteCategory(id: string, token: string) {
  return apiRequest<{ id: string }>(`/categories/${id}`, {
    method: "DELETE",
    token,
  });
}

export function uploadCategoryIcon(file: File, token: string) {
  const formData = new FormData();
  formData.append("icon", file);
  return apiUpload<{ url: string }>("/categories/upload-icon", formData, token);
}
