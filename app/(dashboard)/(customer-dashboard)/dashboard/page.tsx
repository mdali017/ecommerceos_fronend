import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard — Ecommerce OS",
  description: "আপনার অর্ডার ও ডেলিভারি তথ্য দেখুন।",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
