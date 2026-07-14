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
import { useLocale } from "@/components/providers/LocaleProvider";
import { formatDashboardDate } from "@/lib/i18n/product-display";
import {
  getPaymentStatusLabels,
  getStatusLabels,
} from "@/lib/order-status";
import Swal from "sweetalert2";

function ReturnRequestButton({ orderId, orderStatus }: { orderId: string; orderStatus: string }) {
  const { dictionary } = useLocale();
  const t = dictionary.dashboard;
  const [createReturn, { isLoading }] = useCreateReturnRequestMutation();
  const { data: myReturns = [] } = useListMyReturnsQuery();
  const existing = myReturns.find((item) => item.orderId === orderId);

  if (!["delivered", "completed", "shipped"].includes(orderStatus)) return null;
  if (existing) {
    return (
      <p className="mt-3 text-xs font-semibold text-brand-orange">
        {t.returnStatus} {existing.status}
      </p>
    );
  }

  const handleReturn = async () => {
    const result = await Swal.fire({
      title: t.returnRequest,
      input: "textarea",
      inputLabel: t.returnReason,
      inputPlaceholder: t.returnWhy,
      showCancelButton: true,
      confirmButtonColor: "#f58220",
    });
    if (!result.isConfirmed || !result.value?.trim()) return;

    try {
      await createReturn({ orderId, reason: result.value.trim() }).unwrap();
      await Swal.fire({ icon: "success", title: t.returnSubmitted, timer: 1500, showConfirmButton: false });
    } catch {
      await Swal.fire({ icon: "error", title: t.returnFailed });
    }
  };

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={() => void handleReturn()}
      className="mt-3 rounded-lg border border-brand-orange px-3 py-1.5 text-xs font-semibold text-brand-orange hover:bg-orange-50 dark:hover:bg-orange-950/30"
    >
      {t.returnRequest}
    </button>
  );
}

function OrderDetail({ orderId }: { orderId: string }) {
  const { dictionary, locale, formatPrice } = useLocale();
  const t = dictionary.dashboard;
  const { data: order, isLoading, isError } = useGetOrderQuery(orderId);

  if (isLoading) {
    return (
      <div className="border-t border-brand-border pt-5 text-sm text-muted">
        {t.detailsLoading}
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="border-t border-brand-border pt-5 text-sm text-red-600">
        {t.detailsLoadError}
      </div>
    );
  }

  return (
    <div className="border-t border-brand-border pt-5">
      <div className="space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-xl bg-brand-gray/40 p-3">
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-card">
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
              <p className="truncate font-semibold text-foreground">{item.productName}</p>
              <p className="text-sm text-muted">
                {formatPrice(item.unitPrice)} × {item.quantity}
              </p>
            </div>
            <p className="font-bold text-brand-orange">{formatPrice(item.lineTotal)}</p>
          </div>
        ))}
      </div>

      <dl className="mt-5 space-y-2 border-t border-brand-border pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">{t.subtotal}</dt>
          <dd className="font-semibold">{formatPrice(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">{t.deliveryCharge}</dt>
          <dd className="font-semibold">{formatPrice(order.deliveryCharge)}</dd>
        </div>
        {order.discount > 0 ? (
          <div className="flex justify-between text-green-600">
            <dt>{t.discount}</dt>
            <dd className="font-semibold">- {formatPrice(order.discount)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-brand-border pt-2 text-base">
          <dt className="font-bold text-foreground">{t.total}</dt>
          <dd className="font-bold text-brand-orange">{formatPrice(order.total)}</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-xl bg-brand-gray/40 p-4 text-sm">
        <p className="font-semibold text-foreground">{t.deliveryAddress}</p>
        <p className="mt-1 text-muted">{order.customerAddress}</p>
        <p className="mt-2 text-muted">{order.customerPhone}</p>
        <p className="mt-2 text-muted">
          {t.paymentCod}{" "}
          <span
            className={
              order.paymentStatus === "paid"
                ? "font-semibold text-green-600"
                : "font-semibold text-yellow-600"
            }
          >
            {order.paymentStatus === "paid" ? t.paymentPaid : t.paymentPending}
          </span>
        </p>
        {order.trackingNumber ? (
          <p className="mt-2 text-muted">
            {t.tracking} <span className="font-semibold">{order.trackingNumber}</span>
            {order.courierName ? ` (${order.courierName})` : ""}
          </p>
        ) : null}
        {order.estimatedDelivery ? (
          <p className="mt-1 text-muted">{t.deliveryEta} {order.estimatedDelivery}</p>
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
  const { dictionary, locale, formatPrice } = useLocale();
  const t = dictionary.dashboard;
  const statusLabels = getStatusLabels(locale);
  const paymentLabels = getPaymentStatusLabels(locale);
  const status = statusLabels[order.status];
  const payment = paymentLabels[order.paymentStatus] ?? paymentLabels.pending;

  return (
    <div className="rounded-2xl border border-brand-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{t.orderId}</p>
          <p className="text-lg font-bold text-foreground">{order.orderNumber}</p>
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
          <p className="text-sm text-muted">{t.date}</p>
          <p className="font-semibold">{formatDashboardDate(order.createdAt, locale)}</p>
        </div>
        <div>
          <p className="text-sm text-muted">{t.products}</p>
          <p className="font-semibold">{order.itemCount} {t.itemCountSuffix}</p>
        </div>
        <div>
          <p className="text-sm text-muted">{t.total}</p>
          <p className="font-bold text-brand-orange">{formatPrice(order.total)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="mt-4 text-sm font-semibold text-brand-green hover:underline"
      >
        {expanded ? t.hideDetails : t.showDetails}
      </button>

      {expanded ? <OrderDetail orderId={order.id} /> : null}
    </div>
  );
}

export default function OrdersPage() {
  const { dictionary, locale, formatPrice } = useLocale();
  const t = dictionary.dashboard;
  const statusLabels = getStatusLabels(locale);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const lastOrder = useAppSelector((state) => state.auth.lastOrder);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const { data: orders = [], isLoading, isError } = useListMyOrdersQuery(undefined, {
    skip: !accessToken,
  });

  const hasApiOrders = accessToken && !isError && orders.length > 0;

  if (accessToken && isLoading) {
    return (
      <div className="rounded-2xl border border-brand-border bg-card p-8 text-center shadow-sm">
        <p className="text-muted">{t.ordersLoading}</p>
      </div>
    );
  }

  if (hasApiOrders) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">{t.myOrders}</h2>
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
      <div className="rounded-2xl border border-brand-border bg-card p-8 text-center shadow-sm">
        <p className="text-muted">{t.noOrdersFound}</p>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-brand-orange">
          {t.shopNow}
        </Link>
      </div>
    );
  }

  const processingLabel = statusLabels.processing.label;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">{t.myOrders}</h2>
      <div className="rounded-2xl border border-brand-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">{t.orderId}</p>
            <p className="text-lg font-bold text-foreground">{lastOrder.orderId}</p>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-brand-orange dark:bg-orange-950/40">
            {processingLabel}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-brand-border pt-5 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted">{t.date}</p>
            <p className="font-semibold">{formatDashboardDate(lastOrder.date, locale)}</p>
          </div>
          <div>
            <p className="text-sm text-muted">{t.products}</p>
            <p className="font-semibold">{lastOrder.itemCount} {t.itemCountSuffix}</p>
          </div>
          <div>
            <p className="text-sm text-muted">{t.total}</p>
            <p className="font-bold text-brand-orange">{formatPrice(lastOrder.total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
