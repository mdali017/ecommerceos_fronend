"use client";

import Image from "next/image";
import type { ShippingZone } from "@/app/redux/services/shippingApi";

export interface PosCartItem {
  productId: string;
  name: string;
  image: string;
  slug: string;
  price: number;
  quantity: number;
  stockQty: number;
}

function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-US")}`;
}

interface AdminPosCheckoutPanelProps {
  cart: PosCartItem[];
  itemCount: number;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  submitting: boolean;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  notes: string;
  shippingZones: ShippingZone[];
  selectedZoneId: string;
  onCustomerNameChange: (value: string) => void;
  onCustomerPhoneChange: (value: string) => void;
  onCustomerEmailChange: (value: string) => void;
  onCustomerAddressChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onZoneChange: (value: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: () => void;
}

export function AdminPosCheckoutPanel({
  cart,
  itemCount,
  subtotal,
  deliveryCharge,
  total,
  submitting,
  customerName,
  customerPhone,
  customerEmail,
  customerAddress,
  notes,
  shippingZones,
  selectedZoneId,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onCustomerEmailChange,
  onCustomerAddressChange,
  onNotesChange,
  onZoneChange,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}: AdminPosCheckoutPanelProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="border-b border-brand-border px-3 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-gray-900 sm:text-lg">Checkout</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              {itemCount} item{itemCount === 1 ? "" : "s"} in cart
            </p>
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="flex-shrink-0 text-xs font-semibold text-red-500 hover:text-red-600"
            >
              Clear cart
            </button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
        {cart.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-border bg-brand-gray/40 px-4 py-8 text-center sm:py-10">
            <p className="text-2xl">🛒</p>
            <p className="mt-2 text-sm font-medium text-gray-700">Cart is empty</p>
            <p className="mt-1 text-xs text-gray-500">Search and add products to cart</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <article
                key={item.productId}
                className="flex gap-3 rounded-xl border border-brand-border p-3"
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-brand-gray">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-lg">📦</div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs font-bold text-brand-orange">
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center rounded-lg border border-brand-border">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-gray-600 hover:bg-brand-gray"
                      >
                        −
                      </button>
                      <span className="flex h-8 w-8 items-center justify-center border-x border-brand-border text-xs font-bold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stockQty}
                        className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-gray-600 hover:bg-brand-gray disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.productId)}
                      className="text-xs font-semibold text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="space-y-3 rounded-2xl border border-brand-border bg-brand-cream/40 p-4">
          <h3 className="text-sm font-bold text-gray-900">Customer Details</h3>

          <input
            type="text"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            placeholder="Customer name *"
            className="w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => onCustomerPhoneChange(e.target.value)}
            placeholder="Phone (01XXXXXXXXX) *"
            className="w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => onCustomerEmailChange(e.target.value)}
            placeholder="Email *"
            className="w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
          <textarea
            value={customerAddress}
            onChange={(e) => onCustomerAddressChange(e.target.value)}
            placeholder="Delivery address *"
            rows={2}
            className="w-full resize-none rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Order notes (optional)"
            rows={2}
            className="w-full resize-none rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
          />

          {shippingZones.length > 0 && (
            <select
              value={selectedZoneId}
              onChange={(e) => onZoneChange(e.target.value)}
              className="w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            >
              {shippingZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} — {formatPrice(zone.deliveryFee)} delivery
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-brand-border bg-white p-3 sm:p-5">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <dt>Subtotal</dt>
            <dd className="font-semibold">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-gray-600">
            <dt>Delivery</dt>
            <dd className="font-semibold">{formatPrice(deliveryCharge)}</dd>
          </div>
          <div className="flex justify-between border-t border-brand-border pt-2 text-base font-bold text-gray-900">
            <dt>Total</dt>
            <dd className="text-brand-orange">{formatPrice(total)}</dd>
          </div>
        </dl>

        <button
          type="button"
          disabled={submitting || cart.length === 0}
          onClick={onPlaceOrder}
          className="mt-3 w-full rounded-xl bg-brand-orange py-3 text-sm font-bold text-white transition-colors hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-60 sm:mt-4 sm:py-3.5"
        >
          {submitting ? "Placing order..." : "Place Order"}
        </button>

        <p className="mt-2 text-center text-[11px] text-gray-500">
          Order will be created as <span className="font-semibold">Pending</span>
        </p>
      </div>
    </div>
  );
}
