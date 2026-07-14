"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setLoginMethod, setCustomerSession } from "@/app/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { loginCustomer } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { showUnlockError, showUnlockSuccess, showValidationError } from "@/lib/swal";

export function CustomerLoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loginMethod = useAppSelector((state) => state.auth.loginMethod);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      await showValidationError("ফোন/ইমেইল এবং পাসওয়ার্ড দিন।");
      return;
    }

    setSubmitting(true);

    try {
      const result = await loginCustomer({
        identifier: identifier.trim(),
        password: password.trim(),
        method: loginMethod,
      });

      dispatch(
        setCustomerSession({
          customer: {
            id: result.user.id,
            name: result.user.name,
            phone: result.user.phone,
            email: result.user.email,
            address: result.user.address,
          },
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        })
      );

      await showUnlockSuccess();
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
      await showUnlockError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-green to-brand-green-light p-10 text-white lg:flex">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
            🌿
          </div>
          <div>
            <p className="text-lg font-bold">Ecommerce OS</p>
            <p className="text-sm text-white/60">সম্পূর্ণ ই-কমার্স প্ল্যাটফর্ম</p>
          </div>
        </Link>

        <div>
          <h1 className="text-3xl font-bold leading-tight">
            আপনার অ্যাকাউন্টে<br />সাইন ইন করুন
          </h1>
          <p className="mt-4 max-w-sm text-white/70">
            অর্ডার ট্র্যাক করুন, প্রোফাইল ম্যানেজ করুন এবং দ্রুত কেনাকাটা করুন।
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm">
          <p className="font-semibold text-white/80">Demo Credentials</p>
          <p className="mt-2 text-white/70">ফোন: 01712345678</p>
          <p className="text-white/70">ইমেইল: customer@test.com</p>
          <p className="text-white/70">পাসওয়ার্ড: 123456</p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-brand-gray/30 px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-bold text-brand-green">Ecommerce OS</span>
            </Link>
          </div>

          <div className="rounded-2xl border border-brand-border bg-white p-8 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900">সাইন ইন</h2>
            <p className="mt-1 text-sm text-gray-500">
              আপনার অ্যাকাউন্টে লগইন করুন
            </p>

            <div className="mt-5 flex rounded-xl bg-brand-gray p-1">
              <button
                type="button"
                onClick={() => {
                  dispatch(setLoginMethod("phone"));
                  setIdentifier("");
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                  loginMethod === "phone"
                    ? "bg-white text-brand-orange shadow-sm"
                    : "text-gray-500"
                }`}
              >
                📱 ফোন
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch(setLoginMethod("email"));
                  setIdentifier("");
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                  loginMethod === "email"
                    ? "bg-white text-brand-orange shadow-sm"
                    : "text-gray-500"
                }`}
              >
                ✉️ ইমেইল
              </button>
            </div>

            <form onSubmit={(e) => void handleSubmit(e)} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  {loginMethod === "phone" ? "ফোন নম্বর" : "ইমেইল"}
                </label>
                <input
                  type={loginMethod === "phone" ? "tel" : "email"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    loginMethod === "phone" ? "01XXXXXXXXX" : "example@email.com"
                  }
                  className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-brand-orange py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-orange-dark disabled:opacity-60"
              >
                {submitting ? "লগইন হচ্ছে..." : "লগইন করুন"}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-500 lg:hidden">
              Demo: 01712345678 / 123456
            </p>
          </div>

          <Link
            href="/"
            className="mt-6 block text-center text-sm font-semibold text-brand-green hover:text-brand-orange"
          >
            ← হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
