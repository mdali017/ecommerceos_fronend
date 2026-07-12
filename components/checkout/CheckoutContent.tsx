"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
  type CartItem,
} from "@/app/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { OrderModal } from "@/components/checkout/OrderModal";

function formatPrice(price: number) {
  return `৳${price.toLocaleString("bn-BD")}`;
}

export function CheckoutContent() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items as CartItem[]);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const subtotal = items.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );
  const deliveryCharge = items.length === 0 || subtotal >= 2000 ? 0 : 80;
  const discount = subtotal >= 3000 ? 150 : 0;
  const total = Math.max(0, subtotal + deliveryCharge - discount);
  const itemCount = items.reduce(
    (count: number, item: CartItem) => count + item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-brand-border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-cream text-3xl">
            🛒
          </div>
          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            আপনার কার্ট খালি
          </h1>
          <p className="mt-2 text-gray-500">
            পছন্দের পণ্য cart-এ যোগ করলে এখানে দেখা যাবে।
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg bg-brand-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
          >
            কেনাকাটা শুরু করুন
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brand-gray/60 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand-orange">Checkout</p>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              আপনার কার্ট
            </h1>
          </div>
          <button
            type="button"
            onClick={() => dispatch(clearCart())}
            className="w-fit text-sm font-semibold text-red-500 transition-colors hover:text-red-600"
          >
            কার্ট খালি করুন
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex gap-4">
                  <Link
                    href={`/products/${item.slug ?? item.id}`}
                    className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-brand-gray sm:h-28 sm:w-28"
                  >
                    <Image
                      src={item.image}
                      alt={item.nameBn}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                      <div>
                        <Link
                          href={`/products/${item.slug ?? item.id}`}
                          className="line-clamp-2 text-base font-bold text-gray-900 transition-colors hover:text-brand-orange"
                        >
                          {item.nameBn}
                        </Link>
                        {item.weight && (
                          <p className="mt-1 text-sm text-gray-500">
                            {item.weight}
                          </p>
                        )}
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-gray-500">প্রতি পিস</p>
                        <p className="font-bold text-brand-orange">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center rounded-lg border border-brand-border">
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-gray-600 transition-colors hover:bg-brand-gray"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="flex h-10 w-12 items-center justify-center border-x border-brand-border text-sm font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-gray-600 transition-colors hover:bg-brand-gray"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">মোট</p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
                        >
                          বাদ দিন
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-brand-border bg-white p-5 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-lg font-bold text-gray-900">অর্ডার সামারি</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery charge</span>
                <span className="font-semibold text-gray-900">
                  {deliveryCharge === 0 ? "Free" : formatPrice(deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span className="font-semibold text-green-600">
                  -{formatPrice(discount)}
                </span>
              </div>
            </div>

            <div className="my-5 border-t border-dashed border-brand-border" />

            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">
                সর্বমোট
              </span>
              <span className="text-2xl font-bold text-brand-orange">
                {formatPrice(total)}
              </span>
            </div>

            <div className="mt-5 rounded-xl bg-brand-cream p-4 text-sm text-gray-600">
              {subtotal >= 2000
                ? "আপনি free delivery পাচ্ছেন।"
                : `${formatPrice(2000 - subtotal)} আরও কিনলে free delivery পাবেন।`}
            </div>

            <button
              type="button"
              onClick={() => setOrderModalOpen(true)}
              className="mt-5 w-full rounded-xl bg-brand-orange py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-orange-dark"
            >
              Checkout করুন
            </button>
            <Link
              href="/"
              className="mt-3 block text-center text-sm font-semibold text-brand-green transition-colors hover:text-brand-orange"
            >
              আরও কেনাকাটা করুন
            </Link>
          </aside>
        </div>
      </div>

      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        total={total}
        itemCount={itemCount}
        items={items}
      />
    </section>
  );
}
