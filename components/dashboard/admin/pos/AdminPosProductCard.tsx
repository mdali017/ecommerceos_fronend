"use client";

import Image from "next/image";
import type { Product } from "@/lib/api/products";

function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-US")}`;
}

export function getPosDisplayPrice(product: Product) {
  const hasOffer =
    product.offerPrice > 0 && product.offerPrice < product.sellingPrice;
  return hasOffer ? product.offerPrice : product.sellingPrice;
}

export function isPosSellable(product: Product) {
  return product.status === "active" || product.status === "low_stock";
}

export function matchesPosSearch(product: Product, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const fields = [
    product.productName,
    product.sku,
    product.barcode,
    product.category,
    product.subcategory,
    product.genericName,
    product.brand,
    product.tags,
  ];

  return fields.some((field) => field?.toLowerCase().includes(q));
}

export function AdminPosProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
}) {
  const price = getPosDisplayPrice(product);
  const image = product.imageUrl || product.images[0] || "";
  const outOfStock = product.status === "out_of_stock" || product.stockQty <= 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm transition-shadow hover:shadow-md sm:rounded-2xl">
      <div className="relative aspect-square overflow-hidden bg-brand-gray">
        {image ? (
          <Image
            src={image}
            alt={product.productName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 200px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl text-gray-300">
            📦
          </div>
        )}
        {product.status === "low_stock" && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
            Low Stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <h3 className="line-clamp-2 text-xs font-semibold text-gray-900 sm:text-sm">
          {product.productName}
        </h3>
        <p className="mt-0.5 truncate text-[10px] text-gray-500 sm:mt-1 sm:text-xs">
          {product.sku}
          {product.packSize ? ` · ${product.packSize}` : ""}
        </p>
        <p className="hidden text-xs text-gray-400 sm:block">{product.category}</p>

        <div className="mt-1.5 flex items-baseline gap-1.5 sm:mt-2 sm:gap-2">
          <span className="text-sm font-bold text-brand-orange sm:text-base">{formatPrice(price)}</span>
          {product.offerPrice > 0 && product.offerPrice < product.sellingPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.sellingPrice)}
            </span>
          )}
        </div>

        <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">Stock: {product.stockQty}</p>

        <button
          type="button"
          disabled={outOfStock}
          onClick={() => onAddToCart(product)}
          className="mt-2 w-full rounded-lg bg-brand-orange py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-50 sm:mt-3 sm:rounded-xl sm:py-2.5 sm:text-sm"
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
