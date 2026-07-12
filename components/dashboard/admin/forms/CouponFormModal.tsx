"use client";

import { useEffect, useState } from "react";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
  type Coupon,
  type CouponUpsertInput,
} from "@/app/redux/services/couponApi";
import { showAdminValidationError } from "@/lib/admin-swal";
import {
  AdminFormModal,
  FormActions,
  FormField,
  formInputClass,
} from "../AdminFormModal";

const emptyForm: CouponUpsertInput = {
  code: "",
  description: "",
  discountType: "fixed",
  discountValue: 100,
  minOrderAmount: 0,
  maxDiscount: null,
  usageLimit: null,
  perUserLimit: 1,
  startsAt: null,
  expiresAt: null,
  isActive: true,
  freeShipping: false,
};

export function CouponFormModal({
  open,
  coupon,
  onClose,
  onSaved,
}: {
  open: boolean;
  coupon: Coupon | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<CouponUpsertInput>(emptyForm);
  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: updating }] = useUpdateCouponMutation();
  const isEdit = Boolean(coupon);
  const submitting = creating || updating;

  useEffect(() => {
    if (!open) return;
    if (coupon) {
      setForm({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount,
        usageLimit: coupon.usageLimit,
        perUserLimit: coupon.perUserLimit,
        startsAt: coupon.startsAt,
        expiresAt: coupon.expiresAt,
        isActive: coupon.isActive,
        freeShipping: coupon.freeShipping,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, coupon]);

  const update = <K extends keyof CouponUpsertInput>(key: K, value: CouponUpsertInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || form.discountValue <= 0) {
      await showAdminValidationError("Code and discount value are required.");
      return;
    }

    try {
      if (isEdit && coupon) {
        await updateCoupon({ id: coupon.id, body: form }).unwrap();
      } else {
        await createCoupon(form).unwrap();
      }
      onSaved();
      onClose();
    } catch (error) {
      const apiError =
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "error" in error.data &&
        error.data.error &&
        typeof error.data.error === "object"
          ? (error.data.error as { message?: string; code?: string })
          : null;

      const message =
        apiError?.code === "COUPONS_TABLE_MISSING"
          ? "Coupons table সেটআপ হয়নি। Supabase SQL Editor-এ 015_coupons.sql run করুন।"
          : apiError?.message ?? "Failed to save coupon.";
      await showAdminValidationError(message);
    }
  };

  return (
    <AdminFormModal
      open={open}
      title={isEdit ? "Edit Coupon" : "Create Coupon"}
      onClose={onClose}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <FormField label="Code *">
          <input
            className={formInputClass}
            value={form.code}
            onChange={(e) => update("code", e.target.value.toUpperCase())}
            placeholder="SAVE100"
          />
        </FormField>

        <FormField label="Description">
          <input
            className={formInputClass}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Discount Type">
            <select
              className={formInputClass}
              value={form.discountType}
              onChange={(e) => update("discountType", e.target.value as "fixed" | "percent")}
            >
              <option value="fixed">Fixed (৳)</option>
              <option value="percent">Percent (%)</option>
            </select>
          </FormField>

          <FormField label="Discount Value *">
            <input
              type="number"
              className={formInputClass}
              value={form.discountValue}
              onChange={(e) => update("discountValue", Number(e.target.value))}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Min Order (৳)">
            <input
              type="number"
              className={formInputClass}
              value={form.minOrderAmount ?? 0}
              onChange={(e) => update("minOrderAmount", Number(e.target.value))}
            />
          </FormField>

          <FormField label="Max Discount (৳)">
            <input
              type="number"
              className={formInputClass}
              value={form.maxDiscount ?? ""}
              onChange={(e) =>
                update("maxDiscount", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="Percent only"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Usage Limit">
            <input
              type="number"
              className={formInputClass}
              value={form.usageLimit ?? ""}
              onChange={(e) =>
                update("usageLimit", e.target.value ? Number(e.target.value) : null)
              }
              placeholder="Unlimited"
            />
          </FormField>

          <FormField label="Per User Limit">
            <input
              type="number"
              className={formInputClass}
              value={form.perUserLimit ?? 1}
              onChange={(e) => update("perUserLimit", Number(e.target.value))}
            />
          </FormField>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => update("isActive", e.target.checked)}
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.freeShipping}
              onChange={(e) => update("freeShipping", e.target.checked)}
            />
            Free shipping
          </label>
        </div>

        <FormActions
          onCancel={onClose}
          submitLabel={isEdit ? "Update" : "Create"}
          submitting={submitting}
        />
      </form>
    </AdminFormModal>
  );
}
