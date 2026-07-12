"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAppSelector } from "@/app/redux/hooks";
import {
  useGetOrderQuery,
  useListMyOrdersQuery,
  type OrderSummary,
} from "@/app/redux/services/orderApi";
import {
  useCreateReturnRequestMutation,
  useListMyReturnsQuery,
} from "@/app/redux/services/returnApi";
import Swal from "sweetalert2";
import { paymentStatusLabelsBn, statusLabelsBn } from "@/lib/order-status";

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

function ReturnRequestButton({ orderId, orderStatus }: { orderId: string; orderStatus: string }) {
  const [createReturn, { isLoading }] = useCreateReturnRequestMutation();
  const { data: myReturns = [] } = useListMyReturnsQuery();
  const existing = myReturns.find((item) => item.orderId === orderId);

  if (!["delivered", "completed", "shipped"].includes(orderStatus)) return null;
  if (existing) {
    return (
      <p className="mt-3 text-xs font-semibold text-brand-orange">
        Return request: {existing.status}
      </p>
    );
  }

  const handleReturn = async () => {
    const result = await Swal.fire({
      title: "Return request",
      input: "textarea",
      inputLabel: "Reason",
      inputPlaceholder: "Why do you want to return?",
      showCancelButton: true,
      confirmButtonColor: "#f58220",
    });
    if (!result.isConfirmed || !result.value?.trim()) return;

    try {
      await createReturn({ orderId, reason: result.value.trim() }).unwrap();
      await Swal.fire({ icon: "success", title: "Return request submitted", timer: 1500, showConfirmButton: false });
    } catch {
      await Swal.fire({ icon: "error", title: "Return request failed" });
    }
  };

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={() => void handleReturn()}
      className="mt-3 rounded-lg border border-brand-orange px-3 py-1.5 text-xs font-semibold text-brand-orange hover:bg-orange-50"
    >
      Return request
    </button>
  );
}

function OrderDetail({ orderId }: { orderId: string }) {
  const { data: order, isLoading, isError } = useGetOrderQuery(orderId);

  if (isLoading) {
    return (
      <div className="border-t border-brand-border pt-5 text-sm text-gray-500">
        বিস্তারিত লোড হচ্ছে...
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="border-t border-brand-border pt-5 text-sm text-red-600">
        অর্ডার বিস্তারিত লোড করা যায়নি।
      </div>
    );
  }

  return (
    <div className="border-t border-brand-border pt-5">
      <div className="space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-xl bg-brand-gray/40 p-3">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-white">
              {item.productImage ? (
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl">📦</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-gray-900">{item.productName}</p>
              <p className="text-sm text-gray-500">
                {formatPrice(item.unitPrice)} × {item.quantity}
              </p>
            </div>
            <p className="font-bold text-brand-orange">{formatPrice(item.lineTotal)}</p>
          </div>
        ))}
      </div>

      <dl className="mt-5 space-y-2 border-t border-brand-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">সাবটোটাল</dt>
          <dd className="font-semibold">{formatPrice(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">ডেলিভারি চার্জ</dt>
          <dd className="font-semibold">{formatPrice(order.deliveryCharge)}</dd>
        </div>
        {order.discount > 0 ? (
          <div className="flex justify-between text-green-600">
            <dt>ছাড়</dt>
            <dd className="font-semibold">- {formatPrice(order.discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-brand-border pt-2 text-base">
          <dt className="font-bold text-gray-900">মোট</dt>
          <dd className="font-bold text-brand-orange">{formatPrice(order.total)}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-xl bg-brand-gray/40 p-4 text-sm">
        <p className="font-semibold text-gray-900">ডেলিভারি ঠিকানা</p>
        <p className="mt-1 text-gray-600">{order.customerAddress}</p>
        <p className="mt-2 text-gray-600">{order.customerPhone}</p>
        <p className="mt-2 text-gray-600">
          পেমেন্ট: ক্যাশ অন ডেলিভারি —{" "}
          <span
            className={
              order.paymentStatus === "paid"
                ? "font-semibold text-green-600"
                : "font-semibold text-yellow-600"
            }
          >
            {order.paymentStatus === "paid" ? "সম্পন্ন" : "বাকি"}
          </span>
        </p>
        {order.trackingNumber ? (
          <p className="mt-2 text-gray-600">
            Tracking: <span className="font-semibold">{order.trackingNumber}</span>
            {order.courierName ? ` (${order.courierName})` : ""}
          </p>
        ) : null}
        {order.estimatedDelivery ? (
          <p className="mt-1 text-gray-600">Delivery ETA: {order.estimatedDelivery}</p>
        ) : null}
        <ReturnRequestButton orderId={order.id} orderStatus={order.status} />
      </div>
    </div>
  );
}

function OrderCard({
  order,
  expanded,
  onToggle,
}: {
  order: OrderSummary;
  expanded: boolean;
  onToggle: () => void;
}) {
  const status = statusLabelsBn[order.status];
  const payment = paymentStatusLabelsBn[order.paymentStatus] ?? paymentStatusLabelsBn.pending;

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">অর্ডার আইডি</p>
          <p className="text-lg font-bold text-gray-900">{order.orderNumber}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
            {status.label}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${payment.className}`}>
            {payment.label}
          </span>
        </div>
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

      <button
        type="button"
        onClick={onToggle}
        className="mt-4 text-sm font-semibold text-brand-green hover:underline"
      >
        {expanded ? "বিস্তারিত লুকান" : "বিস্তারিত দেখুন"}
      </button>

      {expanded ? <OrderDetail orderId={order.id} /> : null}
    </div>
  );
}

export default function OrdersPage() {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const lastOrder = useAppSelector((state) => state.auth.lastOrder);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
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
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            expanded={expandedOrderId === order.id}
            onToggle={() =>
              setExpandedOrderId((current) =>
                current === order.id ? null : order.id
              )
            }
          />
        ))}
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
