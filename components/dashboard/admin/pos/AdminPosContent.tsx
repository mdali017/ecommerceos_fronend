"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { AdminPosCheckoutDrawer } from "./AdminPosCheckoutDrawer";
import { AdminPosCheckoutPanel, type PosCartItem } from "./AdminPosCheckoutPanel";

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
  const [checkoutDrawerOpen, setCheckoutDrawerOpen] = useState(false);

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

  useEffect(() => {
    if (cart.length === 0) {
      setCheckoutDrawerOpen(false);
    }
  }, [cart.length]);

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
      setCheckoutDrawerOpen(false);
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

  const checkoutPanelProps = {
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
    onCustomerNameChange: setCustomerName,
    onCustomerPhoneChange: setCustomerPhone,
    onCustomerEmailChange: setCustomerEmail,
    onCustomerAddressChange: setCustomerAddress,
    onNotesChange: setNotes,
    onZoneChange: setSelectedZoneId,
    onUpdateQuantity: updateCartQuantity,
    onRemoveItem: removeFromCart,
    onClearCart: clearCart,
    onPlaceOrder: () => void handlePlaceOrder(),
  };

  return (
    <div className={`flex min-h-full flex-col lg:h-full lg:flex-row lg:overflow-hidden ${cart.length > 0 && !checkoutDrawerOpen ? "pb-20 lg:pb-0" : ""}`}>
      <section className="flex flex-col lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:border-r lg:border-brand-border">
        <div className="sticky top-0 z-10 border-b border-brand-border bg-card p-3 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                🔍
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border border-brand-border py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 sm:py-3"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-xl border border-brand-border bg-card px-3 py-2.5 text-sm outline-none focus:border-brand-orange sm:w-auto sm:min-w-[160px] sm:px-4 sm:py-3"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <p className="mt-2 text-xs text-muted">
            {loadingProducts
              ? "Loading products..."
              : `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"} found`}
          </p>
        </div>

        <div className="p-3 sm:p-5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          {loadingProducts ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted sm:h-40">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-card text-center sm:h-40">
              <p className="text-3xl">📦</p>
              <p className="mt-2 text-sm font-medium text-foreground">No products found</p>
              <p className="mt-1 text-xs text-muted">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
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

      <aside className="hidden w-full flex-shrink-0 flex-col border-t border-brand-border bg-card lg:flex lg:h-full lg:w-[400px] lg:overflow-hidden lg:border-t-0 xl:w-[420px]">
        <AdminPosCheckoutPanel {...checkoutPanelProps} />
      </aside>

      <AdminPosCheckoutDrawer
        open={checkoutDrawerOpen}
        onClose={() => setCheckoutDrawerOpen(false)}
      >
        <AdminPosCheckoutPanel {...checkoutPanelProps} />
      </AdminPosCheckoutDrawer>

      {cart.length > 0 && !checkoutDrawerOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 p-3 lg:hidden">
          <button
            type="button"
            onClick={() => setCheckoutDrawerOpen(true)}
            className="mx-auto flex w-full max-w-md items-center justify-between rounded-2xl bg-brand-green px-4 py-3 text-white shadow-lg"
          >
            <span className="text-sm font-semibold">
              {itemCount} item{itemCount === 1 ? "" : "s"} · Checkout
            </span>
            <span className="text-sm font-bold">{formatPrice(total)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
