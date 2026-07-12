"use client";

import { useState } from "react";
import {
  useDeleteCouponMutation,
  useListCouponsQuery,
  type Coupon,
} from "@/app/redux/services/couponApi";
import { CouponFormModal } from "@/components/dashboard/admin/forms/CouponFormModal";
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">Coupons & Promotions</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-gray-700 hover:border-brand-orange hover:text-brand-orange"
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
        <div className="rounded-2xl border border-brand-border bg-white p-8 text-center text-sm text-gray-500">
          Loading coupons...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
          <p className="font-semibold">Failed to load coupons.</p>
          <p className="mt-2">
            Supabase SQL Editor-এ{" "}
            <code className="rounded bg-white px-1.5 py-0.5">015_coupons.sql</code> run করুন,
            তারপর Refresh চাপুন।
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-brand-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-gray-500">
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
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      No coupons yet.
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b border-brand-border last:border-0">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">{coupon.code}</td>
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
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
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
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
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
