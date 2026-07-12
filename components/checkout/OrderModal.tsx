"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearCart, type CartItem } from "@/app/redux/features/cart/cartSlice";
import { completeOrder } from "@/app/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { useCreateOrderMutation } from "@/app/redux/services/orderApi";
import { showOrderSuccess, showValidationError } from "@/lib/swal";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  itemCount: number;
  items: CartItem[];
}

export function OrderModal({
  isOpen,
  onClose,
  total,
  itemCount,
  items,
}: OrderModalProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const customer = useAppSelector((state) => state.auth.customer);
  const [createOrder, { isLoading: submitting }] = useCreateOrderMutation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setName(customer?.name ?? "");
    setPhone(customer?.phone ?? "");
    setEmail(customer?.email ?? "");
    setAddress(customer?.address ?? "");
  }, [isOpen, customer]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      await showValidationError("সব তথ্য পূরণ করুন — নাম, ফোন, ইমেইল ও ঠিকানা।");
      return;
    }

    if (phone.trim().length < 11) {
      await showValidationError("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।");
      return;
    }

    try {
      const order = await createOrder({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        customerAddress: address.trim(),
        items: items.map((item) => ({
          productId: item.slug ?? item.id,
          productName: item.nameBn || item.name,
          productSlug: item.slug ?? item.id,
          productImage: item.image,
          unitPrice: item.price,
          quantity: item.quantity,
        })),
      }).unwrap();

      dispatch(
        completeOrder({
          customer: {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            address: address.trim(),
          },
          order: {
            orderId: order.orderNumber,
            total: order.total,
            itemCount: order.itemCount,
            date: order.createdAt,
          },
        })
      );

      dispatch(clearCart());

      await showOrderSuccess(order.orderNumber, order.total);
      router.push("/dashboard");
      onClose();
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
          ? (error.data.error as { message?: string; code?: string })
          : null;

      const message =
        apiError?.code === "ORDERS_TABLE_MISSING"
          ? "অর্ডার টেবিল সেটআপ হয়নি। Supabase SQL Editor-এ 010_orders.sql run করুন, তারপর আবার চেষ্টা করুন।"
          : apiError?.message ?? "অর্ডার সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।";
      await showValidationError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative max-h-[92vh] w-full max-w-3xl animate-[fadeIn_0.2s_ease-out] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="rounded-t-2xl bg-gradient-to-r from-brand-green to-brand-green-light px-6 py-5 text-white">
          <h2 className="text-xl font-bold">অর্ডার সম্পূর্ণ করুন</h2>
          <p className="mt-1 text-sm text-white/80">
            ডেলিভারির জন্য আপনার তথ্য দিন
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[calc(92vh-96px)] space-y-4 overflow-y-auto p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="order-name" className="mb-1.5 block text-sm font-semibold text-gray-700">
                নাম *
              </label>
              <input
                id="order-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার পূর্ণ নাম"
                className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <div>
              <label htmlFor="order-phone" className="mb-1.5 block text-sm font-semibold text-gray-700">
                ফোন *
              </label>
              <input
                id="order-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <div>
              <label htmlFor="order-email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                ইমেইল *
              </label>
              <input
                id="order-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <div>
              <label htmlFor="order-address" className="mb-1.5 block text-sm font-semibold text-gray-700">
                ঠিকানা *
              </label>
              <textarea
                id="order-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="বাড়ি/রোড, এলাকা, জেলা"
                rows={3}
                className="w-full resize-none rounded-xl border border-brand-border px-4 py-3 text-sm outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
          </div>

          <div className="rounded-xl bg-brand-cream px-4 py-3 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{itemCount} টি পণ্য</span>
            {" · "}
            <span className="font-semibold text-brand-orange">
              ৳{total.toLocaleString("bn-BD")}
            </span>
            {" · "}
            ক্যাশ অন ডেলিভারি
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-brand-border py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-brand-gray"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-brand-orange py-3 text-sm font-bold text-white transition-colors hover:bg-brand-orange-dark disabled:opacity-60"
            >
              {submitting ? "প্রক্রিয়াকরণ..." : "অর্ডার কনফার্ম করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
