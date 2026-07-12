import type { Metadata } from "next";
import { AdminDashboardShell } from "@/components/dashboard/admin/AdminDashboardShell";

export const metadata: Metadata = {
  title: "Admin Panel | Khaas Food",
  description: "Khaas Food store administration panel.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}
