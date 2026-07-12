"use client";

import { useMemo, useState } from "react";
import {
  useListAllOrdersQuery,
  useUpdateOrderStatusMutation,
  type OrderStatus,
} from "@/app/redux/services/orderApi";
import { statusLabels } from "@/lib/admin-data";

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
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
                : "border border-brand-border bg-white text-gray-600 hover:border-brand-orange hover:text-brand-orange"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-brand-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-red-500">
                    Failed to load orders. Run setup:orders on the backend.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
              {filteredOrders.map((order) => {
                const status = statusLabels[order.status] ?? statusLabels.pending;
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
                      <div className="text-xs text-gray-500">{order.customerPhone}</div>
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
                    <td className="px-6 py-4 text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="rounded-lg border border-brand-border bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-brand-orange"
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
