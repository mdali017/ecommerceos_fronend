"use client";

import { useMemo, useState } from "react";
import {
  useListAllReturnsQuery,
  useUpdateReturnStatusMutation,
  type ReturnStatus,
} from "@/app/redux/services/returnApi";
import { AdminStatGrid } from "@/components/dashboard/admin/AdminStatCard";

const statusOptions: ReturnStatus[] = ["pending", "approved", "rejected", "refunded", "completed"];

export function AdminReturnsContent() {
  const { data: returns = [], isLoading, isError, refetch } = useListAllReturnsQuery();
  const [updateStatus] = useUpdateReturnStatusMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const returnStats = useMemo(() => {
    const total = returns.length;
    const pending = returns.filter((r) => r.status === "pending").length;
    const approved = returns.filter((r) => r.status === "approved").length;
    const rejected = returns.filter((r) => r.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [returns]);

  const handleStatus = async (id: string, status: ReturnStatus) => {
    setUpdatingId(id);
    try {
      await updateStatus({ id, status }).unwrap();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminStatGrid
        stats={[
          { label: "Total Returns", value: isLoading ? "—" : returnStats.total, icon: "↩️", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
          { label: "Pending", value: isLoading ? "—" : returnStats.pending, icon: "⏳", color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400" },
          { label: "Approved", value: isLoading ? "—" : returnStats.approved, icon: "✅", color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400" },
          { label: "Rejected", value: isLoading ? "—" : returnStats.rejected, icon: "❌", color: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400" },
        ]}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Return Requests</h2>
        <button type="button" onClick={() => refetch()} className="text-sm font-semibold text-brand-orange">
          Refresh
        </button>
      </div>

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
          Run <code>019_returns.sql</code> in Supabase, then refresh.
        </div>
      )}

      <div className="rounded-2xl border border-brand-border bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-brand-gray/50 text-left text-xs uppercase text-muted">
              <th className="px-6 py-3">Order</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Reason</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center">Loading...</td></tr>
            ) : returns.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-muted">No return requests.</td></tr>
            ) : (
              returns.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="px-6 py-4 font-mono font-semibold">{item.orderNumber}</td>
                  <td className="px-6 py-4">{item.customerName}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{item.reason}</td>
                  <td className="px-6 py-4 capitalize">{item.status}</td>
                  <td className="px-6 py-4">
                    <select
                      disabled={updatingId === item.id}
                      value={item.status}
                      onChange={(e) => void handleStatus(item.id, e.target.value as ReturnStatus)}
                      className="rounded-lg border border-brand-border px-2 py-1 text-xs"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
