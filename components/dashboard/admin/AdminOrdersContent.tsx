"use client";

import { useMemo, useState } from "react";
import {
  useListAllOrdersQuery,
  useUpdateOrderStatusMutation,
  type OrderStatus,
  type PaymentStatus,
} from "@/app/redux/services/orderApi";
import { AdminStatGrid } from "@/components/dashboard/admin/AdminStatCard";
import {
  AdminPagination,
  useAdminPagination,
} from "@/components/dashboard/admin/AdminPagination";
import { statusLabels } from "@/lib/admin-data";
import Swal from "sweetalert2";

const paymentLabels: Record<PaymentStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400" },
  paid: { label: "Completed", className: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" },
};

const filters = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending" as OrderStatus },
  { label: "Confirm Order", value: "confirmed" as OrderStatus },
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

export function AdminOrdersContent({
  variant = "all",
}: {
  variant?: "all" | "completed";
}) {
  const isCompletedView = variant === "completed";
  const [activeFilter, setActiveFilter] = useState<OrderStatus | undefined>(undefined);
  const { data: orders = [], isLoading, isError, refetch } = useListAllOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const scopedOrders = useMemo(() => {
    if (isCompletedView) {
      return orders.filter((order) => order.status === "completed");
    }
    // All Orders: exclude completed & returned (those live under their own menus)
    return orders.filter(
      (order) => order.status !== "completed" && order.status !== "returned"
    );
  }, [orders, isCompletedView]);

  const filteredOrders = useMemo(() => {
    if (isCompletedView) return scopedOrders;
    if (!activeFilter) return scopedOrders;
    return scopedOrders.filter((order) => order.status === activeFilter);
  }, [scopedOrders, activeFilter, isCompletedView]);

  const {
    page,
    setPage,
    pageItems,
    total,
    totalPages,
    showingFrom,
    showingTo,
    serialOf,
  } = useAdminPagination(filteredOrders);

  const orderStats = useMemo(() => {
    if (isCompletedView) {
      const totalCount = scopedOrders.length;
      const paid = scopedOrders.filter((o) => o.paymentStatus === "paid").length;
      const revenue = scopedOrders.reduce((sum, o) => sum + o.total, 0);
      return {
        total: totalCount,
        pending: 0,
        processing: 0,
        paid,
        revenue,
      };
    }

    const totalCount = scopedOrders.length;
    const pending = scopedOrders.filter((o) => o.status === "pending").length;
    const processing = scopedOrders.filter((o) => o.status === "processing").length;
    const confirmed = scopedOrders.filter((o) => o.status === "confirmed").length;
    const revenue = scopedOrders.reduce((sum, o) => sum + o.total, 0);
    return { total: totalCount, pending, processing, confirmed, paid: 0, revenue };
  }, [scopedOrders, isCompletedView]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const order = orders.find((item) => item.id === orderId);
    const statusLabel = statusLabels[status]?.label ?? status;

    setUpdatingId(orderId);

    void Swal.fire({
      title: "Updating status...",
      html: `<p style="color:#6b7280;margin-top:8px">Order <strong>${
        order?.orderNumber ?? ""
      }</strong> → <strong>${statusLabel}</strong></p>
      <p style="color:#9ca3af;margin-top:8px;font-size:13px">Please wait while we update...</p>`,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await updateStatus({ id: orderId, status }).unwrap();
      await refetch();

      await Swal.fire({
        icon: "success",
        title: "Status updated successfully!",
        html: `<p style="color:#6b7280;margin-top:8px">Order <strong>${
          order?.orderNumber ?? ""
        }</strong> is now <strong>${statusLabel}</strong>.</p>`,
        confirmButtonText: "OK",
        confirmButtonColor: "#f58220",
        timer: 2200,
        timerProgressBar: true,
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Could not update order status. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#f58220",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminStatGrid
        stats={
          isCompletedView
            ? [
                {
                  label: "Completed Orders",
                  value: isLoading ? "—" : orderStats.total,
                  icon: "✅",
                  color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
                },
                {
                  label: "Payment Completed",
                  value: isLoading ? "—" : orderStats.paid,
                  icon: "💳",
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
                },
                {
                  label: "Completed Revenue",
                  value: isLoading ? "—" : formatPrice(orderStats.revenue),
                  icon: "💰",
                  color: "bg-orange-50 text-brand-orange dark:bg-orange-950/40",
                },
              ]
            : [
                {
                  label: "Total Orders",
                  value: isLoading ? "—" : orderStats.total,
                  icon: "📦",
                  color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
                },
                {
                  label: "Pending",
                  value: isLoading ? "—" : orderStats.pending,
                  icon: "⏳",
                  color:
                    "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
                },
                {
                  label: "Processing",
                  value: isLoading ? "—" : orderStats.processing,
                  icon: "🔄",
                  color: "bg-orange-50 text-brand-orange dark:bg-orange-950/40",
                },
                {
                  label: "Total Revenue",
                  value: isLoading ? "—" : formatPrice(orderStats.revenue),
                  icon: "💰",
                  color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
                },
              ]
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-foreground">
          {isCompletedView ? "Completed Orders" : "Order Management"}
        </h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-semibold text-brand-green hover:text-brand-orange"
        >
          Refresh
        </button>
      </div>

      {!isCompletedView && (
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
      )}

      <div className="rounded-2xl border border-brand-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3">#</th>
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
                  <td colSpan={8} className="px-6 py-10 text-center text-muted">
                    Loading orders...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-red-500">
                    Failed to load orders. Run setup:orders on the backend.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-muted">
                    {isCompletedView
                      ? "No completed orders yet."
                      : "No orders found."}
                  </td>
                </tr>
              )}
              {pageItems.map((order, index) => {
                const status = statusLabels[order.status] ?? statusLabels.pending;
                const payment = paymentLabels[order.paymentStatus] ?? paymentLabels.pending;
                return (
                  <tr
                    key={order.id}
                    className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                  >
                    <td className="px-6 py-4 text-muted">{serialOf(index)}</td>
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
                      <div className="flex flex-wrap items-center gap-2">
                        {!isCompletedView && order.status === "pending" && (
                          <button
                            type="button"
                            disabled={updatingId === order.id}
                            onClick={() => void handleStatusChange(order.id, "confirmed")}
                            className="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-60"
                          >
                            {updatingId === order.id ? "..." : "Confirm Order"}
                          </button>
                        )}
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
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={total}
          showingFrom={showingFrom}
          showingTo={showingTo}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
