import type { Product as ApiProduct } from "@/lib/api/products";
import type { Product as StorefrontProduct } from "@/lib/data";
import type { ProductDetail } from "@/lib/product-detail";
import { mapApiProductToStorefront } from "@/lib/product-mapper";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop";

const DEFAULT_FEATURES = [
  "ভালো মানের কাঁচামাল থেকে প্রস্তুত",
  "পরিষ্কার ও স্বাস্থ্যসম্মত প্যাকেজিং",
  "দ্রুত ডেলিভারি সুবিধা",
];

const DEFAULT_STORAGE = [
  "ঠান্ডা ও শুকনো স্থানে সংরক্ষণ করুন",
  "সরাসরি সূর্যের আলো থেকে দূরে রাখুন",
];

function getProductImages(product: ApiProduct): string[] {
  const images = product.images.filter(Boolean);
  if (images.length > 0) return images;
  if (product.imageUrl) return [product.imageUrl];
  return [PLACEHOLDER_IMAGE];
}

function getKeyFeatures(product: ApiProduct): string[] {
  const fromTags = product.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return fromTags.length > 0 ? fromTags : DEFAULT_FEATURES;
}

function getUsageAndStorage(product: ApiProduct): string[] {
  const notes = product.notes.trim();
  return notes ? [notes, ...DEFAULT_STORAGE] : DEFAULT_STORAGE;
}

export function mapApiProductToDetail(
  product: ApiProduct,
  relatedProducts: StorefrontProduct[] = []
): ProductDetail {
  const storefront = mapApiProductToStorefront(product);
  const imageUrls = getProductImages(product);
  const related = relatedProducts.filter((item) => item.slug !== product.slug);

  return {
    slug: product.slug,
    name: product.productName,
    nameBn: storefront.nameBn,
    price: storefront.price,
    originalPrice: storefront.originalPrice,
    category: product.category || "Grocery",
    categoryBn: product.category || product.subcategory || "গ্রোসারি",
    brand: product.brand || "Khaas Food",
    weight: storefront.weight ?? "১ প্যাকেট",
    inStock: product.status !== "out_of_stock" && product.stockQty > 0,
    images: imageUrls.map((url, index) => ({
      id: String(index + 1),
      url,
      alt: storefront.nameBn,
    })),
    description:
      product.description.trim() ||
      `${storefront.nameBn} — Khaas Food-এর বাছাই করা মানসম্মত পণ্য।`,
    keyFeatures: getKeyFeatures(product),
    usageAndStorage: getUsageAndStorage(product),
    reviews: [],
    frequentlyBoughtTogether: related.slice(0, 3),
    relatedProducts: related.slice(0, 5),
    crossSellProducts: related.slice(5, 10),
  };
}
