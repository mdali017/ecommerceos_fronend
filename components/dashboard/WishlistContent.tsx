"use client";

import Image from "next/image";
import Link from "next/link";
import { addToCart } from "@/app/redux/features/cart/cartSlice";
import {
  useListWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/app/redux/services/wishlistApi";
import { useAppDispatch } from "@/app/redux/hooks";
import Swal from "sweetalert2";

function formatPrice(price: number) {
  return `৳${price.toLocaleString("bn-BD")}`;
}

function resolvePrice(item: { sellingPrice: number; offerPrice: number }) {
  if (item.offerPrice > 0 && item.offerPrice < item.sellingPrice) return item.offerPrice;
  return item.sellingPrice;
}

export function WishlistContent() {
  const dispatch = useAppDispatch();
  const { data: items = [], isLoading, isError, refetch } = useListWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId).unwrap();
    } catch {
      await Swal.fire({ icon: "error", title: "Wishlist থেকে সরানো যায়নি" });
    }
  };

  const handleMoveToCart = async (item: (typeof items)[number]) => {
    dispatch(
      addToCart({
        id: item.slug,
        name: item.productName,
        nameBn: item.productName,
        price: resolvePrice(item),
        image: item.imageUrl,
        weight: item.packSize || item.unit,
        slug: item.slug,
      })
    );
    await removeFromWishlist(item.slug).unwrap();
    await Swal.fire({
      icon: "success",
      title: "কার্টে যোগ হয়েছে",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white p-8 text-center text-sm text-gray-500">
        Wishlist লোড হচ্ছে...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white p-8 text-center text-sm text-red-600">
        Wishlist লোড করা যায়নি।
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">আমার Wishlist</h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-semibold text-brand-green hover:text-brand-orange"
        >
          Refresh
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-white p-8 text-center">
          <p className="text-gray-500">Wishlist খালি। পছন্দের পণ্যে ❤️ চাপুন।</p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white"
          >
            কেনাকাটা শুরু করুন
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm"
            >
              <div className="flex gap-4">
                <Link
                  href={`/products/${item.slug}`}
                  className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-brand-gray"
                >
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl">📦</div>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="line-clamp-2 font-bold text-gray-900 hover:text-brand-orange"
                  >
                    {item.productName}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">{item.packSize || item.unit}</p>
                  <p className="mt-2 font-bold text-brand-orange">
                    {formatPrice(resolvePrice(item))}
                  </p>
                  {!item.inStock && (
                    <p className="mt-1 text-xs font-semibold text-red-500">Out of stock</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled={!item.inStock}
                  onClick={() => void handleMoveToCart(item)}
                  className="flex-1 rounded-lg bg-brand-orange py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  কার্টে যোগ করুন
                </button>
                <button
                  type="button"
                  onClick={() => void handleRemove(item.slug)}
                  className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600"
                >
                  সরান
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
