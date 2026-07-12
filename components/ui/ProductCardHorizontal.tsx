"use client";

import Image from "next/image";
import Link from "next/link";
import { addToCart } from "@/app/redux/features/cart/cartSlice";
import { useAppDispatch } from "@/app/redux/hooks";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Product } from "@/lib/data";

const badgeStyles: Record<string, string> = {
  new: "bg-green-600 text-white",
  sale: "bg-red-600 text-white",
  bestseller: "bg-red-600 text-white",
  stock: "bg-blue-600 text-white",
};

export function ProductCardHorizontal({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const { dictionary, localizePath, getProductName, formatPrice } = useLocale();
  const detailsHref = localizePath(`/products/${product.slug ?? product.id}`);
  const displayName = getProductName(product);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.slug ?? product.id,
        name: product.name,
        nameBn: product.nameBn,
        price: product.price,
        image: product.image,
        weight: product.weight,
        slug: product.slug ?? product.id,
      })
    );
  };

  return (
    <div className="group flex min-w-0 overflow-hidden rounded-lg border border-brand-border bg-white transition-shadow hover:shadow-md">
      <Link
        href={detailsHref}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-brand-gray sm:h-28 sm:w-28 lg:h-[100px] lg:w-[100px]"
      >
        {product.badge && (
          <span
            className={`absolute left-1.5 top-1.5 z-10 rounded px-1.5 py-0.5 text-[10px] font-medium ${badgeStyles[product.badge]}`}
          >
            {dictionary.badges[product.badge]}
          </span>
        )}
        {product.discount && (
          <span className="absolute right-1.5 top-1.5 z-10 rounded bg-brand-orange px-1.5 py-0.5 text-[10px] font-bold text-white">
            -{product.discount}%
          </span>
        )}
        <Image
          src={product.image}
          alt={displayName}
          fill
          className="object-cover"
          sizes="128px"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-center p-2.5 sm:p-3 lg:p-3">
        <Link
          href={detailsHref}
          className="line-clamp-2 text-sm font-semibold leading-snug text-gray-800 hover:text-brand-orange"
        >
          {displayName}
        </Link>
        {product.weight && (
          <p className="mt-0.5 text-xs text-gray-500">{product.weight}</p>
        )}
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-base font-bold text-brand-orange lg:text-lg">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through sm:text-sm">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-1.5 w-full rounded bg-brand-orange px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-orange-dark sm:w-fit sm:px-4"
        >
          {dictionary.common.addToCart}
        </button>
      </div>
    </div>
  );
}
