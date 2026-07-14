"use client";

import { useMemo } from "react";
import { useListCustomersQuery } from "@/app/redux/services/adminApi";
import { AdminStatGrid } from "@/components/dashboard/admin/AdminStatCard";

export function AdminCustomersContent() {
  const { data: customers = [], isLoading, isError } = useListCustomersQuery();

  const customerStats = useMemo(() => {
    const total = customers.length;
    const totalOrders = customers.reduce((sum, c) => sum + c.orderCount, 0);
    const avgOrders = total > 0 ? (totalOrders / total).toFixed(1) : "0";
    const withOrders = customers.filter((c) => c.orderCount > 0).length;
    return { total, totalOrders, avgOrders, withOrders };
  }, [customers]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-brand-border bg-card p-8 text-center text-sm text-muted">
        Loading customers...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-brand-border bg-card p-8 text-center text-sm text-red-600">
        Failed to load customers.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminStatGrid
        stats={[
          { label: "Total Customers", value: customerStats.total, icon: "👥", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
          { label: "Total Orders", value: customerStats.totalOrders, icon: "📦", color: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400" },
          { label: "Avg Orders / Customer", value: customerStats.avgOrders, icon: "📊", color: "bg-orange-50 text-brand-orange dark:bg-orange-950/40" },
          { label: "Repeat Customers", value: customerStats.withOrders, icon: "🔁", color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400" },
        ]}
      />

      <h2 className="text-xl font-bold text-foreground">Customer List</h2>

      {customers.length === 0 ? (
        <div className="rounded-2xl border border-brand-border bg-card p-8 text-center text-sm text-muted">
          No customers yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="rounded-2xl border border-brand-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-lg font-bold text-white">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-foreground">{customer.name}</p>
                  <p className="text-xs text-muted">{customer.orderCount} orders</p>
                </div>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Phone</dt>
                  <dd className="font-medium">{customer.phone}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">Email</dt>
                  <dd className="truncate font-medium">{customer.email}</dd>
                </div>
                <div>
                  <dt className="text-muted">Address</dt>
                  <dd className="mt-1 font-medium text-foreground">{customer.address}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Source</dt>
                  <dd className="font-medium capitalize">{customer.source}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
