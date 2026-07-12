import {
  fetchPublicProducts,
} from "@/lib/api/products.server";
import {
  filterByCategory,
  filterOnSale,
  mapApiProductsToStorefront,
} from "@/lib/product-mapper";
import type { Product } from "@/lib/data";
import {
  flashSaleProducts,
  honeyProducts,
  mangoProducts,
  spiceProducts,
  topSellingProducts,
} from "@/lib/data";

export interface HomepageProducts {
  topSelling: Product[];
  mango: Product[];
  honey: Product[];
  spice: Product[];
  flashSale: Product[];
}

function withFallback(primary: Product[], fallback: Product[], limit: number) {
  if (primary.length > 0) return primary.slice(0, limit);
  return fallback.slice(0, limit);
}

export async function getHomepageProducts(): Promise<HomepageProducts> {
  const { products: apiProducts } = await fetchPublicProducts({ limit: 100 });

  if (apiProducts.length === 0) {
    return {
      topSelling: topSellingProducts,
      mango: mangoProducts,
      honey: honeyProducts,
      spice: spiceProducts,
      flashSale: flashSaleProducts,
    };
  }

  const featured = apiProducts.filter((product) => product.featured);
  const topSellingSource = featured.length > 0 ? featured : apiProducts;

  return {
    topSelling: withFallback(
      mapApiProductsToStorefront(topSellingSource),
      topSellingProducts,
      6
    ),
    mango: withFallback(
      mapApiProductsToStorefront(filterByCategory(apiProducts, ["mango", "আম"])),
      mangoProducts,
      12
    ),
    honey: withFallback(
      mapApiProductsToStorefront(filterByCategory(apiProducts, ["honey", "মধু"])),
      honeyProducts,
      12
    ),
    spice: withFallback(
      mapApiProductsToStorefront(filterByCategory(apiProducts, ["spice", "মশলা"])),
      spiceProducts,
      12
    ),
    flashSale: withFallback(
      mapApiProductsToStorefront(filterOnSale(apiProducts)),
      flashSaleProducts,
      12
    ),
  };
}
