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
    <article className="flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm transition-shadow hover:shadow-md">
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

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
          {product.productName}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          {product.sku}
          {product.packSize ? ` · ${product.packSize}` : ""}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">{product.category}</p>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-brand-orange">{formatPrice(price)}</span>
          {product.offerPrice > 0 && product.offerPrice < product.sellingPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.sellingPrice)}
            </span>
          )}
        </div>

        <p className="mt-1 text-xs text-gray-500">Stock: {product.stockQty}</p>

        <button
          type="button"
          disabled={outOfStock}
          onClick={() => onAddToCart(product)}
          className="mt-3 w-full rounded-xl bg-brand-orange py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
