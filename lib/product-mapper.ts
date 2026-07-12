import type { Product as ApiProduct } from "@/lib/api/products";
import type { Product as StorefrontProduct } from "@/lib/data";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop";

export function mapApiProductToStorefront(product: ApiProduct): StorefrontProduct {
  const hasOffer = product.offerPrice > 0 && product.offerPrice < product.sellingPrice;
  const price = hasOffer ? product.offerPrice : product.sellingPrice;
  const originalPrice = hasOffer ? product.sellingPrice : undefined;
  const discount =
    product.discountPercent > 0
      ? Math.round(product.discountPercent)
      : originalPrice && price < originalPrice
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : undefined;

  let badge: StorefrontProduct["badge"];
  if (product.featured) badge = "bestseller";
  else if (discount && discount > 0) badge = "sale";
  else if (product.status === "low_stock") badge = "stock";

  const image = product.imageUrl || product.images[0] || PLACEHOLDER_IMAGE;
  const weight = product.weight || product.packSize || undefined;

  return {
    id: product.id,
    slug: product.slug,
    name: product.productName,
    nameBn: product.genericName?.trim() || product.productName,
    price,
    originalPrice,
    image,
    weight,
    badge,
    discount,
  };
}

export function filterByCategory(products: ApiProduct[], keywords: string[]) {
  const normalized = keywords.map((k) => k.toLowerCase());
  return products.filter((product) => {
    const category = product.category.toLowerCase();
    const subcategory = product.subcategory.toLowerCase();
    const tags = product.tags.toLowerCase();
    return normalized.some(
      (keyword) =>
        category.includes(keyword) ||
        subcategory.includes(keyword) ||
        tags.includes(keyword)
    );
  });
}

export function filterOnSale(products: ApiProduct[]) {
  return products.filter((product) => {
    const hasOffer =
      product.offerPrice > 0 && product.offerPrice < product.sellingPrice;
    return hasOffer || product.discountPercent > 0;
  });
}

export function mapApiProductsToStorefront(products: ApiProduct[]): StorefrontProduct[] {
  return products.map(mapApiProductToStorefront);
}
