"use client";

import Link from "next/link";
import { useAppSelector } from "@/app/redux/hooks";
import { useListMyOrdersQuery } from "@/app/redux/services/orderApi";
import {
  isStepDone,
  orderStatusSteps,
  statusLabelsBn,
} from "@/lib/order-status";

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

export function DashboardContent() {
  const customer = useAppSelector((state) => state.auth.customer);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const lastOrder = useAppSelector((state) => state.auth.lastOrder);
  const { data: orders = [], isLoading, isError } = useListMyOrdersQuery(undefined, {
    skip: !accessToken,
  });

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
      <div className="rounded-2xl border border-brand-border bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">ড্যাশবোর্ড লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!displayOrder || !customer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-brand-border bg-white p-8 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-cream text-3xl">
          📦
        </div>
        <h2 className="mt-5 text-xl font-bold text-gray-900">কোনো অর্ডার নেই</h2>
        <p className="mt-2 max-w-sm text-gray-500">
          প্রথমে একটি অর্ডার সম্পূর্ণ করুন, তারপর এখানে দেখা যাবে।
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-brand-orange px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
        >
          কেনাকাটা শুরু করুন
        </Link>
      </div>
    );
  }

  const statusInfo = statusLabelsBn[displayOrder.status];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "সর্বশেষ অর্ডার", value: displayOrder.orderId, icon: "📦", color: "bg-blue-50 text-blue-600" },
          { label: "মোট খরচ", value: formatPrice(displayOrder.total), icon: "💰", color: "bg-orange-50 text-brand-orange" },
          { label: "পণ্য সংখ্যা", value: `${displayOrder.itemCount} টি`, icon: "🛍️", color: "bg-green-50 text-green-600" },
          { label: "অর্ডার তারিখ", value: formatDate(displayOrder.date), icon: "📅", color: "bg-purple-50 text-purple-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="mt-4 text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">ডেলিভারি তথ্য</h2>
          <dl className="mt-5 space-y-4 text-sm">
            {[
              { label: "নাম", value: customer.name },
              { label: "ফোন", value: customer.phone },
              { label: "ইমেইল", value: customer.email },
            ].map((row) => (
              <div key={row.label} className="flex justify-between gap-4 border-b border-brand-border pb-3 last:border-0 last:pb-0">
                <dt className="text-gray-500">{row.label}</dt>
                <dd className="font-semibold text-gray-900">{row.value}</dd>
              </div>
            ))}
            <div>
              <dt className="text-gray-500">ঠিকানা</dt>
              <dd className="mt-1 font-semibold text-gray-900">{customer.address}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900">অর্ডার স্ট্যাটাস</h2>
            {statusInfo ? (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.className}`}>
                {statusInfo.label}
              </span>
            ) : null}
          </div>
          <div className="mt-6 space-y-5">
            {displayOrder.status === "cancelled" ? (
              <p className="text-sm font-medium text-red-600">এই অর্ডারটি বাতিল করা হয়েছে।</p>
            ) : (
              orderStatusSteps.map((item, index) => {
                const done = isStepDone(displayOrder.status, index);
                return (
                  <div key={item.key} className="flex items-center gap-4">
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        done
                          ? "bg-brand-orange text-white"
                          : "bg-brand-gray text-gray-400"
                      }`}
                    >
                      {done ? "✓" : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${done ? "text-gray-900" : "text-gray-400"}`}>
                        {item.label}
                      </p>
                      {done && (
                        <p className="text-xs text-green-600">সম্পন্ন</p>
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
        <h2 className="text-lg font-bold">দ্রুত অ্যাকশন</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-cream"
          >
            নতুন অর্ডার করুন
          </Link>
          <Link
            href="/dashboard/orders"
            className="rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            সব অর্ডার দেখুন
          </Link>
        </div>
      </div>

      {accessToken && isError ? (
        <p className="text-sm text-amber-600">
          সার্ভার থেকে অর্ডার লোড করা যায়নি — স্থানীয় ডেটা দেখানো হচ্ছে।
        </p>
      ) : null}
    </div>
  );
}
