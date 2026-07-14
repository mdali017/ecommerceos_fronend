"use client";

import { useMemo, useState } from "react";
import {
  useDeleteCouponMutation,
  useListCouponsQuery,
  type Coupon,
} from "@/app/redux/services/couponApi";
import { CouponFormModal } from "@/components/dashboard/admin/forms/CouponFormModal";
import { AdminStatGrid } from "@/components/dashboard/admin/AdminStatCard";
import {
  AdminPagination,
  useAdminPagination,
} from "@/components/dashboard/admin/AdminPagination";
import Swal from "sweetalert2";

function formatValue(coupon: Coupon) {
  return coupon.discountType === "fixed"
    ? `৳${coupon.discountValue.toLocaleString("en-US")}`
    : `${coupon.discountValue}%`;
}

export function AdminCouponsContent() {
  const { data: coupons = [], isLoading, isError, refetch } = useListCouponsQuery();
  const [deleteCoupon] = useDeleteCouponMutation();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const {
    page,
    setPage,
    pageItems,
    total,
    totalPages,
    showingFrom,
    showingTo,
  } = useAdminPagination(coupons);

  const couponStats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => c.isActive).length;
    const inactive = coupons.filter((c) => !c.isActive).length;
    const totalUsed = coupons.reduce((sum, c) => sum + c.usedCount, 0);
    return { total, active, inactive, totalUsed };
  }, [coupons]);

  const openCreate = () => {
    setEditingCoupon(null);
    setFormOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormOpen(true);
  };

  const handleDelete = async (coupon: Coupon) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete coupon?",
      text: coupon.code,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteCoupon(coupon.id).unwrap();
    } catch {
      await Swal.fire({ icon: "error", title: "Failed to delete coupon" });
    }
  };

  return (
    <div className="space-y-6">
      <AdminStatGrid
        stats={[
          { label: "Total Coupons", value: isLoading ? "—" : couponStats.total, icon: "🎟️", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400" },
          { label: "Active", value: isLoading ? "—" : couponStats.active, icon: "✅", color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400" },
          { label: "Inactive", value: isLoading ? "—" : couponStats.inactive, icon: "⏸️", color: "bg-brand-gray text-muted" },
          { label: "Total Redemptions", value: isLoading ? "—" : couponStats.totalUsed, icon: "🔥", color: "bg-orange-50 text-brand-orange dark:bg-orange-950/40" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-foreground">Coupons & Promotions</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-foreground hover:border-brand-orange hover:text-brand-orange"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-dark"
          >
            + Create Coupon
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-brand-border bg-card p-8 text-center text-sm text-muted">
          Loading coupons...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
          <p className="font-semibold">Failed to load coupons.</p>
          <p className="mt-2">
            Supabase SQL Editor-এ{" "}
            <code className="rounded bg-card px-1.5 py-0.5">015_coupons.sql</code> run করুন,
            তারপর Refresh চাপুন।
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-brand-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Discount</th>
                  <th className="px-6 py-3">Min Order</th>
                  <th className="px-6 py-3">Used</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted">
                      No coupons yet.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((coupon) => (
                    <tr key={coupon.id} className="border-b border-brand-border last:border-0">
                      <td className="px-6 py-4 font-mono font-bold text-foreground">{coupon.code}</td>
                      <td className="px-6 py-4">{formatValue(coupon)}</td>
                      <td className="px-6 py-4">৳{coupon.minOrderAmount.toLocaleString("en-US")}</td>
                      <td className="px-6 py-4">
                        {coupon.usedCount}
                        {coupon.usageLimit != null ? ` / ${coupon.usageLimit}` : ""}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            coupon.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                              : "bg-brand-gray text-muted"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(coupon)}
                            className="rounded-lg border border-brand-border px-3 py-1.5 text-xs font-semibold hover:border-brand-orange hover:text-brand-orange"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(coupon)}
                            className="rounded-lg border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
      )}

      <CouponFormModal
        open={formOpen}
        coupon={editingCoupon}
        onClose={() => setFormOpen(false)}
        onSaved={() => refetch()}
      />
    </div>
  );
}
