"use client";

import Link from "next/link";
import { useAppSelector } from "@/app/redux/hooks";
import { useListMyOrdersQuery } from "@/app/redux/services/orderApi";
import { useLocale } from "@/components/providers/LocaleProvider";
import { formatDashboardDate } from "@/lib/i18n/product-display";
import {
  getOrderStatusSteps,
  getStatusLabels,
  isStepDone,
} from "@/lib/order-status";

export function DashboardContent() {
  const { dictionary, locale, formatPrice } = useLocale();
  const t = dictionary.dashboard;
  const customer = useAppSelector((state) => state.auth.customer);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const lastOrder = useAppSelector((state) => state.auth.lastOrder);
  const { data: orders = [], isLoading, isError } = useListMyOrdersQuery(undefined, {
    skip: !accessToken,
  });

  const statusLabels = getStatusLabels(locale);
  const orderStatusSteps = getOrderStatusSteps(locale);

  const latestOrder = orders[0];
  const displayOrder = latestOrder
    ? {
        orderId: latestOrder.orderNumber,
        total: latestOrder.total,
        itemCount: latestOrder.itemCount,
        date: latestOrder.createdAt,
        status: latestOrder.status,
      }
    : lastOrder
      ? {
          orderId: lastOrder.orderId,
          total: lastOrder.total,
          itemCount: lastOrder.itemCount,
          date: lastOrder.date,
          status: "processing" as const,
        }
      : null;

  if (accessToken && isLoading) {
    return (
      <div className="rounded-2xl border border-brand-border bg-card p-8 text-center shadow-sm">
        <p className="text-muted">{t.loading}</p>
      </div>
    );
  }

  if (!displayOrder || !customer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-brand-border bg-card p-8 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-cream text-3xl">
          📦
        </div>
        <h2 className="mt-5 text-xl font-bold text-foreground">{t.noOrders}</h2>
        <p className="mt-2 max-w-sm text-muted">{t.noOrdersHint}</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-brand-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
        >
          {t.startShopping}
        </Link>
      </div>
    );
  }

  const statusInfo = statusLabels[displayOrder.status];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: t.lastOrder, value: displayOrder.orderId, icon: "📦", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
          { label: t.orderAmount, value: formatPrice(displayOrder.total), icon: "💰", color: "bg-orange-50 text-brand-orange dark:bg-orange-950/40" },
          { label: t.itemCount, value: `${displayOrder.itemCount} ${t.itemCountSuffix}`, icon: "🛍️", color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400" },
          { label: t.orderDate, value: formatDashboardDate(displayOrder.date, locale), icon: "📅", color: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-brand-border bg-card p-5 shadow-sm"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="mt-4 text-sm text-muted">{stat.label}</p>
            <p className="mt-1 text-lg font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">{t.deliveryInfo}</h2>
          <dl className="mt-5 space-y-4 text-sm">
            {[
              { label: t.name, value: customer.name },
              { label: t.phone, value: customer.phone },
              { label: t.email, value: customer.email },
            ].map((row) => (
              <div key={row.label} className="flex justify-between gap-4 border-b border-brand-border pb-3 last:border-0 last:pb-0">
                <dt className="text-muted">{row.label}</dt>
                <dd className="font-semibold text-foreground">{row.value}</dd>
              </div>
            ))}
            <div>
              <dt className="text-muted">{t.address}</dt>
              <dd className="mt-1 font-semibold text-foreground">{customer.address}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-brand-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-foreground">{t.orderStatus}</h2>
            {statusInfo ? (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
            ) : null}
          </div>
          <div className="mt-6 space-y-5">
            {displayOrder.status === "cancelled" ? (
              <p className="text-sm font-medium text-red-600">{t.orderCancelled}</p>
            ) : (
              orderStatusSteps.map((item, index) => {
                const done = isStepDone(displayOrder.status, index);
                return (
                  <div key={item.key} className="flex items-center gap-4">
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        done
                          ? "bg-brand-orange text-white"
                          : "bg-brand-gray text-muted"
                      }`}
                    >
                      {done ? "✓" : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${done ? "text-foreground" : "text-muted"}`}>
                        {item.label}
                      </p>
                      {done && (
                        <p className="text-xs text-green-600">{t.stepCompleted}</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-border bg-gradient-to-r from-brand-green to-brand-green-light p-6 text-white shadow-sm">
        <h2 className="text-lg font-bold">{t.quickActions}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-cream"
          >
            {t.newOrder}
          </Link>
          <Link
            href="/dashboard/orders"
            className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {t.viewAllOrders}
          </Link>
        </div>
      </div>

      {accessToken && isError ? (
        <p className="text-sm text-amber-600">{t.ordersLoadError}</p>
      ) : null}
    </div>
  );
}
