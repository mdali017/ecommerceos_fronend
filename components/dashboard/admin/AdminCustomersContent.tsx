"use client";

import { useMemo, useState } from "react";
import { useListCustomersQuery } from "@/app/redux/services/adminApi";
import { AdminStatGrid } from "@/components/dashboard/admin/AdminStatCard";
import {
  AdminPagination,
  useAdminPagination,
} from "@/components/dashboard/admin/AdminPagination";

type CustomerTab = "running" | "completed";

export function AdminCustomersContent() {
  const { data: customers = [], isLoading, isError } = useListCustomersQuery();
  const [activeTab, setActiveTab] = useState<CustomerTab>("running");

  const runningCustomers = useMemo(
    () => customers.filter((c) => (c.completedOrderCount ?? 0) === 0),
    [customers]
  );

  const completedCustomers = useMemo(
    () => customers.filter((c) => (c.completedOrderCount ?? 0) > 0),
    [customers]
  );

  const tabCustomers = activeTab === "running" ? runningCustomers : completedCustomers;

  const {
    page,
    setPage,
    pageItems,
    total,
    totalPages,
    showingFrom,
    showingTo,
    serialOf,
  } = useAdminPagination(tabCustomers);

  const customerStats = useMemo(() => {
    const totalCount = customers.length;
    const totalOrders = customers.reduce((sum, c) => sum + c.orderCount, 0);
    const avgOrders = totalCount > 0 ? (totalOrders / totalCount).toFixed(1) : "0";
    const withOrders = customers.filter((c) => c.orderCount > 0).length;
    return {
      total: totalCount,
      totalOrders,
      avgOrders,
      withOrders,
      running: runningCustomers.length,
      completed: completedCustomers.length,
    };
  }, [customers, runningCustomers.length, completedCustomers.length]);

  return (
    <div className="space-y-6">
      <AdminStatGrid
        stats={[
          { label: "Total Customers", value: isLoading ? "—" : customerStats.total, icon: "👥", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
          { label: "Running Customers", value: isLoading ? "—" : customerStats.running, icon: "🔵", color: "bg-orange-50 text-brand-orange dark:bg-orange-950/40" },
          { label: "Completed Customers", value: isLoading ? "—" : customerStats.completed, icon: "✅", color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400" },
          { label: "Total Orders", value: isLoading ? "—" : customerStats.totalOrders, icon: "📦", color: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-foreground">Customer List</h2>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("running")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            activeTab === "running"
              ? "bg-brand-orange text-white"
              : "border border-brand-border bg-card text-muted hover:border-brand-orange hover:text-brand-orange"
          }`}
        >
          Running Customer ({isLoading ? "—" : runningCustomers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
            activeTab === "completed"
              ? "bg-brand-orange text-white"
              : "border border-brand-border bg-card text-muted hover:border-brand-orange hover:text-brand-orange"
          }`}
        >
          Completed Customer ({isLoading ? "—" : completedCustomers.length})
        </button>
      </div>

      <div className="rounded-2xl border border-brand-border bg-card shadow-sm">
        {isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-muted">Loading customers...</div>
        ) : isError ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">Failed to load customers.</div>
        ) : tabCustomers.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted">
            {activeTab === "running"
              ? "No running customers."
              : "No customers with completed orders yet."}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-muted">
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Address</th>
                    <th className="px-6 py-3">Orders</th>
                    {activeTab === "completed" && (
                      <th className="px-6 py-3">Completed</th>
                    )}
                    <th className="px-6 py-3">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((customer, index) => (
                    <tr
                      key={customer.id}
                      className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                    >
                      <td className="px-6 py-4 text-muted">{serialOf(index)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                            {customer.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-foreground">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{customer.phone || "—"}</td>
                      <td className="max-w-[220px] truncate px-6 py-4 text-muted">
                        {customer.email || "—"}
                      </td>
                      <td className="max-w-[260px] px-6 py-4 text-muted">
                        <span className="line-clamp-2">{customer.address || "—"}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {customer.orderCount}
                      </td>
                      {activeTab === "completed" && (
                        <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">
                          {customer.completedOrderCount ?? 0}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-brand-gray px-2.5 py-1 text-xs font-semibold capitalize text-muted">
                          {customer.source || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
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
          </>
        )}
      </div>
    </div>
  );
}
