import type { Metadata } from "next";
import { CustomerLoginForm } from "@/components/auth/CustomerLoginForm";

export const metadata: Metadata = {
  title: "সাইন ইন — Khaas Food",
  description: "আপনার Khaas Food অ্যাকাউন্টে লগইন করুন।",
};

export default function LoginPage() {
  return <CustomerLoginForm />;
}
