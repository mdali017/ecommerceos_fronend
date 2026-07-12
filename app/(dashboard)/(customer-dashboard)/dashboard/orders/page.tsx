"use client";

import Link from "next/link";
import { useAppSelector } from "@/app/redux/hooks";
import { useListMyOrdersQuery } from "@/app/redux/services/orderApi";
import { statusLabels } from "@/lib/admin-data";

function formatPrice(price: number) {
  return `৳${price.toLocaleString("bn-BD")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function OrdersPage() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const lastOrder = useAppSelector((state) => state.auth.lastOrder);
  const { data: orders = [], isLoading, isError } = useListMyOrdersQuery(undefined, {
    skip: !accessToken,
  });

  const hasApiOrders = accessToken && !isError && orders.length > 0;

  if (accessToken && isLoading) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">অর্ডার লোড হচ্ছে...</p>
      </div>
    );
  }

  if (hasApiOrders) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">আমার অর্ডার</h2>
        {orders.map((order) => {
          const status = statusLabels[order.status] ?? statusLabels.pending;
          return (
            <div
              key={order.id}
              className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">অর্ডার আইডি</p>
                  <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 border-t border-brand-border pt-5 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">তারিখ</p>
                  <p className="font-semibold">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">পণ্য</p>
                  <p className="font-semibold">{order.itemCount} টি</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">মোট</p>
                  <p className="font-bold text-brand-orange">{formatPrice(order.total)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (!lastOrder) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">কোনো অর্ডার পাওয়া যায়নি।</p>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-brand-orange">
          কেনাকাটা করুন →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">আমার অর্ডার</h2>
      <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">অর্ডার আইডি</p>
            <p className="text-lg font-bold text-gray-900">{lastOrder.orderId}</p>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-brand-orange">
            প্রসেসিং
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-brand-border pt-5 sm:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">তারিখ</p>
            <p className="font-semibold">{formatDate(lastOrder.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">পণ্য</p>
            <p className="font-semibold">{lastOrder.itemCount} টি</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">মোট</p>
            <p className="font-bold text-brand-orange">{formatPrice(lastOrder.total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
