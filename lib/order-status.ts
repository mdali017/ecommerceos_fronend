import type { OrderStatus, PaymentStatus } from "@/app/redux/services/orderApi";

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

export const paymentStatusLabelsBn: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  pending: { label: "পেমেন্ট বাকি", className: "bg-yellow-100 text-yellow-700" },
  paid: { label: "পেমেন্ট সম্পন্ন", className: "bg-green-100 text-green-700" },
};

export const orderStatusSteps = [
  { key: "received", label: "অর্ডার গ্রহণ" },
  { key: "processing", label: "প্রসেসিং" },
  { key: "shipping", label: "ডেলিভারিতে" },
  { key: "delivered", label: "ডেলিভারি সম্পন্ন" },
] as const;

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
