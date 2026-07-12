"use client";

import { useState } from "react";
import { addToCart } from "@/app/redux/features/cart/cartSlice";
import { useAppDispatch } from "@/app/redux/hooks";
import type { ProductDetail } from "@/lib/product-detail";

function formatPrice(price: number) {
  return `৳${price.toLocaleString("bn-BD")}`;
}

export function ProductInfo({ product }: { product: ProductDetail }) {
  const [qty, setQty] = useState(1);
  const dispatch = useAppDispatch();

  const decrement = () => setQty((q) => Math.max(1, q - 1));
  const increment = () => setQty((q) => q + 1);
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.slug,
        name: product.name,
        nameBn: product.nameBn,
        price: product.price,
        image: product.images[0]?.url ?? "",
        weight: product.weight,
        slug: product.slug,
        quantity: qty,
      })
    );
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
        {product.nameBn}
      </h1>
      <p className="mt-1 text-sm text-gray-500">{product.weight}</p>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-2xl font-bold text-brand-orange sm:text-3xl">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <span className="text-lg text-gray-400 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>

      {product.inStock ? (
        <p className="mt-2 text-sm font-medium text-green-600">✓ স্টকে আছে</p>
      ) : (
        <p className="mt-2 text-sm font-medium text-red-500">স্টক শেষ</p>
      )}

      {/* Quantity */}
      <div className="mt-5 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">পরিমাণ:</span>
        <div className="flex items-center rounded-lg border border-brand-border">
          <button
            type="button"
            onClick={decrement}
            className="flex h-10 w-10 items-center justify-center text-lg font-medium text-gray-600 transition-colors hover:bg-brand-gray"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="flex h-10 w-12 items-center justify-center border-x border-brand-border text-sm font-semibold">
            {qty}
          </span>
          <button
            type="button"
            onClick={increment}
            className="flex h-10 w-10 items-center justify-center text-lg font-medium text-gray-600 transition-colors hover:bg-brand-gray"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Primary CTAs */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="rounded-lg bg-brand-orange py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-orange-dark sm:text-base"
        >
          কার্টে যোগ করুন
        </button>
        <button
          type="button"
          className="rounded-lg bg-[#1a3a4a] py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#142e3a] sm:text-base"
        >
          এখনই কিনুন
        </button>
      </div>

      {/* Secondary CTAs */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1fb855]"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.528 5.867L0 24l6.335-1.662A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82a9.82 9.82 0 01-5.014-1.378l-.361-.214-3.742.982 1-3.648-.235-.374A9.817 9.817 0 012.18 12c0-5.422 4.398-9.82 9.82-9.82 5.422 0 9.82 4.398 9.82 9.82 0 5.422-4.398 9.82-9.82 9.82z" />
          </svg>
          WhatsApp এ অর্ডার
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#162d4a]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          কল করে অর্ডার
        </button>
      </div>

      {/* Brand */}
      <div className="mt-6 border-t border-brand-border pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          ব্র্যান্ড
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green">
            <span className="text-lg">🌿</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {product.brand}
          </span>
        </div>
      </div>
    </div>
  );
}
