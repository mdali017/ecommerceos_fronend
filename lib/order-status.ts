import type { OrderStatus, PaymentStatus } from "@/app/redux/services/orderApi";
import type { Locale } from "@/lib/i18n/config";

export const statusLabelsBn: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: { label: "অপেক্ষমাণ", className: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "নিশ্চিত", className: "bg-indigo-100 text-indigo-700" },
  processing: { label: "প্রসেসিং", className: "bg-blue-100 text-blue-700" },
  shipped: { label: "ডেলিভারিতে", className: "bg-purple-100 text-purple-700" },
  delivered: { label: "ডেলিভারি সম্পন্ন", className: "bg-green-100 text-green-700" },
  completed: { label: "সম্পন্ন", className: "bg-green-100 text-green-700" },
  cancelled: { label: "বাতিল", className: "bg-red-100 text-red-600" },
  returned: { label: "রিটার্ন", className: "bg-orange-100 text-brand-orange" },
};

export const statusLabelsEn: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmed", className: "bg-indigo-100 text-indigo-700" },
  processing: { label: "Processing", className: "bg-blue-100 text-blue-700" },
  shipped: { label: "Shipped", className: "bg-purple-100 text-purple-700" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-700" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-600" },
  returned: { label: "Returned", className: "bg-orange-100 text-brand-orange" },
};

export const paymentStatusLabelsBn: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  pending: { label: "পেমেন্ট বাকি", className: "bg-yellow-100 text-yellow-700" },
  paid: { label: "পেমেন্ট সম্পন্ন", className: "bg-green-100 text-green-700" },
};

export const paymentStatusLabelsEn: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  pending: { label: "Payment Pending", className: "bg-yellow-100 text-yellow-700" },
  paid: { label: "Payment Complete", className: "bg-green-100 text-green-700" },
};

export const orderStatusStepsBn = [
  { key: "received", label: "অর্ডার গ্রহণ" },
  { key: "processing", label: "প্রসেসিং" },
  { key: "shipping", label: "ডেলিভারিতে" },
  { key: "delivered", label: "ডেলিভারি সম্পন্ন" },
] as const;

export const orderStatusStepsEn = [
  { key: "received", label: "Order Received" },
  { key: "processing", label: "Processing" },
  { key: "shipping", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
] as const;

/** @deprecated Use getOrderStatusSteps(locale) */
export const orderStatusSteps = orderStatusStepsBn;

export function getStatusLabels(locale: Locale) {
  return locale === "en" ? statusLabelsEn : statusLabelsBn;
}

export function getPaymentStatusLabels(locale: Locale) {
  return locale === "en" ? paymentStatusLabelsEn : paymentStatusLabelsBn;
}

export function getOrderStatusSteps(locale: Locale) {
  return locale === "en" ? orderStatusStepsEn : orderStatusStepsBn;
}

const statusProgress: Record<OrderStatus, number> = {
  pending: 1,
  confirmed: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
  completed: 4,
  cancelled: 0,
  returned: 0,
};

export function getOrderProgress(status: OrderStatus) {
  return statusProgress[status] ?? 0;
}

export function isStepDone(status: OrderStatus, stepIndex: number) {
  if (status === "cancelled") {
    return false;
  }

  return getOrderProgress(status) > stepIndex;
}
