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

export function ProductCard({ product }: { product: Product }) {
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
    <div className="group flex min-w-[160px] max-w-[200px] flex-shrink-0 flex-col overflow-hidden rounded-lg border border-brand-border bg-white transition-shadow hover:shadow-md sm:min-w-[180px]">
      <Link
        href={detailsHref}
        className="relative block aspect-square overflow-hidden bg-brand-gray"
      >
        {product.badge && (
          <span
            className={`absolute left-2 top-2 z-10 rounded px-1.5 py-0.5 text-[10px] font-medium sm:text-xs ${badgeStyles[product.badge]}`}
          >
            {dictionary.badges[product.badge]}
          </span>
        )}
        {product.discount && (
          <span className="absolute right-2 top-2 z-10 rounded bg-brand-orange px-1.5 py-0.5 text-[10px] font-bold text-white sm:text-xs">
            -{product.discount}%
          </span>
        )}
        <Image
          src={product.image}
          alt={displayName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="200px"
        />
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link
          href={detailsHref}
          className="line-clamp-2 text-sm font-medium leading-snug text-gray-800 hover:text-brand-orange"
        >
          {displayName}
        </Link>
        {product.weight && (
          <p className="mt-0.5 text-xs text-gray-500">{product.weight}</p>
        )}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-brand-orange">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-auto w-full rounded bg-brand-orange py-2 pt-3 text-xs font-semibold text-white transition-colors hover:bg-brand-orange-dark sm:text-sm"
        >
          {dictionary.common.addToCart}
        </button>
      </div>
    </div>
  );
}
