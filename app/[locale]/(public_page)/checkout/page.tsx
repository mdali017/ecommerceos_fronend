import type { Metadata } from "next";
import { CheckoutContent } from "@/components/checkout/CheckoutContent";

export const metadata: Metadata = {
  title: "Checkout — Ecommerce OS",
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}
