import { apiRequest, apiUpload } from "./client";
import type { BulkProductApiRow } from "@/lib/product-bulk-upload";

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  productName: string;
  slug: string;
  genericName: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  unit: string;
  packSize: string;
  purchasePrice: number;
  costPrice: number;
  sellingPrice: number;
  offerPrice: number;
  taxPercent: number;
  discountPercent: number;
  stockQty: number;
  minStock: number;
  maxStock: number;
  batchNo: string;
  expiryDate: string | null;
  manufactureDate: string | null;
  supplier: string;
  manufacturer: string;
  weight: string;
  color: string;
  size: string;
  variant: string;
  imageUrl: string;
  status: "active" | "low_stock" | "out_of_stock" | "draft";
  featured: boolean;
  tags: string;
  notes: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BulkUploadResult {
  created: number;
  updated: number;
  failed: { sku: string; error: string }[];
  products: Product[];
}

export function listProducts(token: string) {
  return apiRequest<Product[]>("/products", { token });
}

export type ProductUpsertInput = {
  sku: string;
  productName: string;
  barcode?: string;
  genericName?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
  description?: string;
  unit?: string;
  packSize?: string;
  purchasePrice?: number | string;
  costPrice?: number | string;
  sellingPrice?: number | string;
  offerPrice?: number | string;
  taxPercent?: number | string;
  discountPercent?: number | string;
  stockQty?: number | string;
  minStock?: number | string;
  maxStock?: number | string;
  batchNo?: string;
  expiryDate?: string;
  manufactureDate?: string;
  supplier?: string;
  manufacturer?: string;
  weight?: string;
  color?: string;
  size?: string;
  variant?: string;
  imageUrl?: string;
  imageUrls?: string[];
  status?: string;
  featured?: string;
  tags?: string;
  notes?: string;
};

export function createProduct(input: ProductUpsertInput, token: string) {
  return apiRequest<Product>("/products", {
    method: "POST",
    token,
    body: input,
  });
}

export function updateProduct(id: string, input: Partial<ProductUpsertInput>, token: string) {
  return apiRequest<Product>(`/products/${id}`, {
    method: "PUT",
    token,
    body: input,
  });
}

export function deleteProduct(id: string, token: string) {
  return apiRequest<null>(`/products/${id}`, {
    method: "DELETE",
    token,
  });
}

export function bulkUploadProducts(products: BulkProductApiRow[], token: string) {
  return apiRequest<BulkUploadResult>("/products/bulk", {
    method: "POST",
    token,
    body: { products },
  });
}

export function uploadProductImages(files: File[], token: string) {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  return apiUpload<{ urls: string[] }>("/products/upload-images", formData, token);
}
