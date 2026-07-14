"use client";

import Link from "next/link";
import { useGetDashboardStatsQuery } from "@/app/redux/services/adminApi";
import { AdminStatGrid } from "@/components/dashboard/admin/AdminStatCard";
import { statusLabels } from "@/lib/admin-data";

function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-US")}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AdminDashboardContent() {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-brand-border bg-card p-8 text-center text-sm text-muted">
        Loading dashboard...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-brand-border bg-card p-8 text-center text-sm text-red-600">
        Failed to load dashboard stats.
      </div>
    );
  }

  const { stats, recentOrders } = data;

  return (
    <div className="space-y-6">
      <AdminStatGrid
        stats={[
          { label: "Total Orders", value: stats.totalOrders, icon: "📦", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
          { label: "Total Customers", value: stats.totalCustomers, icon: "👥", color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400" },
          { label: "Total Products", value: stats.totalProducts, icon: "🛍️", color: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400" },
          { label: "Today's Sales", value: formatPrice(stats.todaySales), icon: "💰", color: "bg-orange-50 text-brand-orange dark:bg-orange-950/40" },
        ]}
      />

      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        <div className="flex items-center gap-2.5 rounded-xl border border-yellow-200/80 bg-yellow-50 px-3 py-2.5 dark:border-yellow-800/50 dark:bg-yellow-950/30 sm:gap-3 sm:px-3.5 sm:py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-sm dark:bg-yellow-950/60 sm:h-9 sm:w-9 sm:text-base">
            ⏳
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-yellow-800 dark:text-yellow-300 sm:text-xs">Pending Orders</p>
            <p className="text-base font-bold text-yellow-900 dark:text-yellow-200 sm:text-lg">{stats.pendingOrders}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200/80 bg-red-50 px-3 py-2.5 dark:border-red-800/50 dark:bg-red-950/30 sm:gap-3 sm:px-3.5 sm:py-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-sm dark:bg-red-950/60 sm:h-9 sm:w-9 sm:text-base">
            ⚠️
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-red-700 dark:text-red-300 sm:text-xs">Low Stock Products</p>
            <p className="text-base font-bold text-red-800 dark:text-red-200 sm:text-lg">{stats.lowStock}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-brand-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-brand-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-brand-orange hover:underline">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const status = statusLabels[order.status] ?? statusLabels.pending;
                  return (
                    <tr key={order.id} className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30">
                      <td className="px-6 py-4 font-mono font-semibold text-foreground">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-foreground">{order.customerName}</td>
                      <td className="px-6 py-4 font-semibold text-brand-orange">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted">{formatDate(order.createdAt)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
