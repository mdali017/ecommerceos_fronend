import {
  fetchPublicProductBySlug,
  fetchPublicProducts,
} from "@/lib/api/products.server";
import { mapApiProductsToStorefront } from "@/lib/product-mapper";
import { mapApiProductToDetail } from "@/lib/product-detail-mapper";
import type { ProductDetail } from "@/lib/product-detail";
import { getProductBySlug as getMockProductBySlug } from "@/lib/product-detail";

export async function getProductDetailBySlug(slug: string): Promise<ProductDetail | null> {
  const apiProduct = await fetchPublicProductBySlug(slug);

  if (!apiProduct) {
    return getMockProductBySlug(slug) ?? null;
  }

  const { products: relatedApiProducts } = await fetchPublicProducts({ limit: 100 });
  const relatedProducts = mapApiProductsToStorefront(
    relatedApiProducts.filter(
      (product) =>
        product.slug !== apiProduct.slug &&
        (product.category === apiProduct.category ||
          product.subcategory === apiProduct.subcategory)
    )
  );

  return mapApiProductToDetail(apiProduct, relatedProducts);
}
