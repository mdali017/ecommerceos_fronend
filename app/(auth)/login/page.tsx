import type { Metadata } from "next";
import { CustomerLoginForm } from "@/components/auth/CustomerLoginForm";

export const metadata: Metadata = {
  title: "সাইন ইন — Ecommerce OS",
  description: "আপনার Ecommerce OS অ্যাকাউন্টে লগইন করুন।",
};

export default function LoginPage() {
  return <CustomerLoginForm />;
}
