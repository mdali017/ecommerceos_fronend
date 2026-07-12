"use client";

import { useState } from "react";
import { useValidateCouponMutation } from "@/app/redux/services/couponApi";

export interface AppliedCoupon {
  code: string;
  discountAmount: number;
  freeShipping: boolean;
}

function formatPrice(price: number) {
  return `৳${price.toLocaleString("bn-BD")}`;
}

export function CouponInput({
  subtotal,
  appliedCoupon,
  onApply,
  onRemove,
}: {
  subtotal: number;
  appliedCoupon: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [validateCoupon, { isLoading }] = useValidateCouponMutation();

  const handleApply = async () => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setError("");
    try {
      const result = await validateCoupon({ code: trimmed, subtotal }).unwrap();
      if (!result.valid) {
        setError(result.message);
        return;
      }
      onApply({
        code: result.code,
        discountAmount: result.discountAmount,
        freeShipping: result.freeShipping,
      });
      setCode("");
    } catch {
      setError("Coupon validate করা যায়নি।");
    }
  };

  if (appliedCoupon) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
              Coupon applied
            </p>
            <p className="font-mono text-sm font-bold text-green-800">{appliedCoupon.code}</p>
            <p className="text-xs text-green-700">
              -{formatPrice(appliedCoupon.discountAmount)}
              {appliedCoupon.freeShipping ? " · Free shipping" : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-green-300 px-3 py-1.5 text-xs font-semibold text-green-800 hover:bg-green-100"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">Coupon code</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="SAVE100"
          className="flex-1 rounded-xl border border-brand-border px-4 py-2.5 text-sm uppercase outline-none focus:border-brand-orange"
        />
        <button
          type="button"
          disabled={isLoading || !code.trim()}
          onClick={() => void handleApply()}
          className="rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-green/90 disabled:opacity-60"
        >
          {isLoading ? "..." : "Apply"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function calculateCheckoutTotals(
  subtotal: number,
  itemCount: number,
  appliedCoupon: AppliedCoupon | null,
  zone?: { deliveryFee: number; freeDeliveryThreshold: number }
) {
  const deliveryFee = zone?.deliveryFee ?? 80;
  const freeThreshold = zone?.freeDeliveryThreshold ?? 2000;
  let deliveryCharge = itemCount === 0 || subtotal >= freeThreshold ? 0 : deliveryFee;
  if (appliedCoupon?.freeShipping) deliveryCharge = 0;

  const autoDiscount = appliedCoupon ? 0 : subtotal >= 3000 ? 150 : 0;
  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const discount = autoDiscount + couponDiscount;
  const total = Math.max(0, subtotal + deliveryCharge - discount);

  return { deliveryCharge, discount, total, autoDiscount, couponDiscount };
}
