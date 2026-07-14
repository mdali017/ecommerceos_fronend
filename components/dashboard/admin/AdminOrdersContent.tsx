"use client";

import { useMemo, useState } from "react";
import {
  useListAllOrdersQuery,
  useUpdateOrderStatusMutation,
  type OrderStatus,
  type PaymentStatus,
} from "@/app/redux/services/orderApi";
import { AdminStatGrid } from "@/components/dashboard/admin/AdminStatCard";
import { statusLabels } from "@/lib/admin-data";

const paymentLabels: Record<PaymentStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400" },
  paid: { label: "Paid", className: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" },
};

const filters = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending" as OrderStatus },
  { label: "Processing", value: "processing" as OrderStatus },
  { label: "Delivered", value: "delivered" as OrderStatus },
];

const statusOptions: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "completed",
  "cancelled",
  "returned",
];

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

export function AdminOrdersContent() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | undefined>(undefined);
  const { data: orders = [], isLoading, isError, refetch } = useListAllOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    if (!activeFilter) return orders;
    return orders.filter((order) => order.status === activeFilter);
  }, [orders, activeFilter]);

  const orderStats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const processing = orders.filter((o) => o.status === "processing").length;
    const delivered = orders.filter((o) => ["delivered", "completed"].includes(o.status)).length;
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);
    return { total, pending, processing, delivered, revenue };
  }, [orders]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateStatus({ id: orderId, status }).unwrap();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminStatGrid
        stats={[
          { label: "Total Orders", value: isLoading ? "—" : orderStats.total, icon: "📦", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
          { label: "Pending", value: isLoading ? "—" : orderStats.pending, icon: "⏳", color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400" },
          { label: "Processing", value: isLoading ? "—" : orderStats.processing, icon: "🔄", color: "bg-orange-50 text-brand-orange dark:bg-orange-950/40" },
          { label: "Total Revenue", value: isLoading ? "—" : formatPrice(orderStats.revenue), icon: "💰", color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-foreground">Order Management</h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-semibold text-brand-green hover:text-brand-orange"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.label}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeFilter === filter.value
                ? "bg-brand-orange text-white"
                : "border border-brand-border bg-card text-muted hover:border-brand-orange hover:text-brand-orange"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-brand-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted">
                    Loading orders...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-red-500">
                    Failed to load orders. Run setup:orders on the backend.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted">
                    No orders found.
                  </td>
                </tr>
              )}
              {filteredOrders.map((order) => {
                const status = statusLabels[order.status] ?? statusLabels.pending;
                const payment = paymentLabels[order.paymentStatus] ?? paymentLabels.pending;
                return (
                  <tr
                    key={order.id}
                    className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                  >
                    <td className="px-6 py-4 font-mono font-semibold">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div>{order.customerName}</div>
                      <div className="text-xs text-muted">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-brand-orange">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${payment.className}`}
                      >
                        {payment.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="rounded-lg border border-brand-border bg-card px-2 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-brand-orange"
                      >
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {statusLabels[option]?.label ?? option}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
