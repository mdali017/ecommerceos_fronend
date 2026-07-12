import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "My Account | Khaas Food",
  description: "Manage your orders, wishlist, and profile at Khaas Food.",
  robots: { index: false, follow: false },
};

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
