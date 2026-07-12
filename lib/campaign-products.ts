import { adminProducts } from "@/lib/admin-data";
import {
  flashSaleProducts,
  honeyProducts,
  mangoProducts,
  spiceProducts,
  topSellingProducts,
  type Product,
} from "@/lib/data";

export interface CampaignProduct {
  id: string;
  name: string;
  nameBn?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  weight?: string;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop";

const catalogProducts: Product[] = [
  ...topSellingProducts,
  ...mangoProducts,
  ...honeyProducts,
  ...spiceProducts,
  ...flashSaleProducts,
];

const adminProductCatalogMap: Record<string, string> = {
  p1: "gawa-ghee-1kg",
  p2: "ts1",
  p3: "ts6",
  p4: "m1",
  p5: "ts3",
};

function findCatalogProduct(adminId: string, adminName: string) {
  const mappedId = adminProductCatalogMap[adminId];
  if (mappedId) {
    const byId = catalogProducts.find(
      (product) => product.id === mappedId || product.slug === mappedId
    );
    if (byId) return byId;
  }

  const normalizedName = adminName.toLowerCase();
  return catalogProducts.find((product) => {
    const catalogName = product.name.toLowerCase();
    return (
      catalogName.includes(normalizedName.split(" ")[0]) ||
      normalizedName.includes(catalogName.split(" ")[0])
    );
  });
}

export const campaignProductOptions: CampaignProduct[] = adminProducts.map((product) => {
  const catalog = findCatalogProduct(product.id, product.name);

  return {
    id: product.id,
    name: product.name,
    nameBn: catalog?.nameBn,
    price: product.price,
    originalPrice: catalog?.originalPrice,
    image: catalog?.image ?? DEFAULT_IMAGE,
    category: product.category,
    weight: catalog?.weight,
  };
});

export function getCampaignProductById(productId: string) {
  return campaignProductOptions.find((product) => product.id === productId) ?? null;
}
