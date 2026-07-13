"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useCreateOrderMutation } from "@/app/redux/services/orderApi";
import { useListShippingZonesQuery } from "@/app/redux/services/shippingApi";
import { calculateCheckoutTotals } from "@/components/checkout/CouponInput";
import { listProducts, type Product } from "@/lib/api/products";
import { showAdminValidationError, showPosOrderSuccess } from "@/lib/admin-swal";
import { useAdminToken } from "@/lib/hooks/useAdminToken";
import { showValidationError } from "@/lib/swal";
import {
  AdminPosProductCard,
  getPosDisplayPrice,
  isPosSellable,
  matchesPosSearch,
} from "./AdminPosProductCard";

interface PosCartItem {
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

export function AdminPosContent() {
  const { getValidAccessToken } = useAdminToken();
  const [createOrder, { isLoading: submitting }] = useCreateOrderMutation();
  const { data: shippingZones = [] } = useListShippingZonesQuery();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");

  const loadProducts = useCallback(async () => {
    const token = await getValidAccessToken();
    if (!token) return;

    setLoadingProducts(true);
    try {
      const products = await listProducts(token);
      setAllProducts(products.filter(isPosSellable));
    } catch {
      setAllProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [getValidAccessToken]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (!selectedZoneId && shippingZones[0]) {
      setSelectedZoneId(shippingZones[0].id);
    }
  }, [shippingZones, selectedZoneId]);

  const categories = useMemo(() => {
    const unique = new Set(
      allProducts.map((product) => product.category).filter(Boolean)
    );
    return Array.from(unique).sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (categoryFilter && product.category !== categoryFilter) return false;
      return matchesPosSearch(product, search);
    });
  }, [allProducts, categoryFilter, search]);

  const activeZone = shippingZones.find((zone) => zone.id === selectedZoneId) ?? shippingZones[0];

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const { deliveryCharge, total } = calculateCheckoutTotals(
    subtotal,
    itemCount,
    null,
    activeZone
      ? {
          deliveryFee: activeZone.deliveryFee,
          freeDeliveryThreshold: activeZone.freeDeliveryThreshold,
        }
      : undefined
  );

  const handleAddToCart = (product: Product) => {
    if (!isPosSellable(product) || product.stockQty <= 0) return;

    const price = getPosDisplayPrice(product);
    const image = product.imageUrl || product.images[0] || "";

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stockQty) return prev;
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.productName,
          image,
          slug: product.slug,
          price,
          quantity: 1,
          stockQty: product.stockQty,
        },
      ];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.productId !== productId);
      }

      return prev.map((item) => {
        if (item.productId !== productId) return item;
        return { ...item, quantity: Math.min(quantity, item.stockQty) };
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const resetCheckoutForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setCustomerAddress("");
    setNotes("");
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      await showAdminValidationError("Add at least one product to the cart.");
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim() || !customerAddress.trim()) {
      await showAdminValidationError("Please fill in customer name, phone, email, and address.");
      return;
    }

    if (customerPhone.trim().length < 11) {
      await showAdminValidationError("Enter a valid 11-digit phone number.");
      return;
    }

    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        customerAddress: customerAddress.trim(),
        notes: notes.trim() || "POS order",
        shippingZoneId: activeZone?.id,
        items: cart.map((item) => ({
          productId: item.slug || item.productId,
          productName: item.name,
          productSlug: item.slug,
          productImage: item.image,
          unitPrice: item.price,
          quantity: item.quantity,
        })),
      }).unwrap();

      clearCart();
      resetCheckoutForm();
      void loadProducts();

      await showPosOrderSuccess(order.orderNumber, order.total);
    } catch (error) {
      const apiError =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "error" in error.data &&
        error.data.error &&
        typeof error.data.error === "object"
          ? (error.data.error as { message?: string })
          : null;

      await showValidationError(apiError?.message ?? "Could not place order. Please try again.");
    }
  };

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <section className="flex min-h-0 flex-1 flex-col border-b border-brand-border lg:border-b-0 lg:border-r">
        <div className="border-b border-brand-border bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, SKU, barcode, category..."
                className="w-full rounded-xl border border-brand-border py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-brand-border bg-white px-4 py-3 text-sm outline-none focus:border-brand-orange"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            {loadingProducts
              ? "Loading products..."
              : `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"} found`}
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {loadingProducts ? (
            <div className="flex h-40 items-center justify-center text-sm text-gray-500">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-white text-center">
              <p className="text-3xl">📦</p>
              <p className="mt-2 text-sm font-medium text-gray-700">No products found</p>
              <p className="mt-1 text-xs text-gray-500">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <AdminPosProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <aside className="flex w-full flex-shrink-0 flex-col bg-white lg:w-[400px] xl:w-[420px]">
        <div className="border-b border-brand-border px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Checkout</h2>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold text-red-500 hover:text-red-600"
              >
                Clear cart
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {itemCount} item{itemCount === 1 ? "" : "s"} in cart
          </p>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
          {cart.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand-border bg-brand-gray/40 px-4 py-10 text-center">
              <p className="text-2xl">🛒</p>
              <p className="mt-2 text-sm font-medium text-gray-700">Cart is empty</p>
              <p className="mt-1 text-xs text-gray-500">Search and add products from the left</p>
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
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-gray-600 hover:bg-brand-gray"
                        >
                          −
                        </button>
                        <span className="flex h-8 w-8 items-center justify-center border-x border-brand-border text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stockQty}
                          className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-gray-600 hover:bg-brand-gray disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
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
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name *"
              className="w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone (01XXXXXXXXX) *"
              className="w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="Email *"
              className="w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
            <textarea
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Delivery address *"
              rows={2}
              className="w-full resize-none rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Order notes (optional)"
              rows={2}
              className="w-full resize-none rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange"
            />

            {shippingZones.length > 0 && (
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
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

        <div className="border-t border-brand-border bg-white p-4 sm:p-5">
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
            onClick={() => void handlePlaceOrder()}
            className="mt-4 w-full rounded-xl bg-brand-orange py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Placing order..." : "Place Order"}
          </button>

          <p className="mt-2 text-center text-[11px] text-gray-500">
            Order will be created as <span className="font-semibold">Pending</span>
          </p>
        </div>
      </aside>
    </div>
  );
}
