"use client";

import { useEffect, useState } from "react";
import { setLoginMethod, setCustomerSession } from "@/app/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { loginCustomer } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { showUnlockError, showUnlockSuccess } from "@/lib/swal";

export function UnlockModal() {
  const dispatch = useAppDispatch();
  const loginMethod = useAppSelector((state) => state.auth.loginMethod);
  const customer = useAppSelector((state) => state.auth.customer);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loginMethod === "phone") {
      setIdentifier(customer?.phone ?? "");
    } else {
      setIdentifier(customer?.email ?? "");
    }
  }, [loginMethod, customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      await showUnlockError("ফোন/ইমেইল এবং পাসওয়ার্ড দিন।");
      return;
    }

    const expectedIdentifier =
      loginMethod === "phone" ? customer?.phone : customer?.email;

    if (expectedIdentifier && identifier.trim() !== expectedIdentifier) {
      await showUnlockError(
        loginMethod === "phone"
          ? "অর্ডারের ফোন নম্বর মিলছে না।"
          : "অর্ডারের ইমেইল মিলছে না।"
      );
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
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "ভুল তথ্য। আবার চেষ্টা করুন।";
      await showUnlockError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream text-2xl">
            🔐
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            ড্যাশবোর্ড আনলক করুন
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            অর্ডার দেখতে লগইন করুন
          </p>
        </div>

        <div className="mb-5 flex rounded-xl bg-brand-gray p-1">
          <button
            type="button"
            onClick={() => {
              dispatch(setLoginMethod("phone"));
              setIdentifier(customer?.phone ?? "");
            }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              loginMethod === "phone"
                ? "bg-white text-brand-orange shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📱 Phone
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(setLoginMethod("email"));
              setIdentifier(customer?.email ?? "");
            }}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              loginMethod === "email"
                ? "bg-white text-brand-orange shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            ✉️ Email
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
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
              placeholder="আপনার পাসওয়ার্ড"
              className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-brand-green py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-green-light disabled:opacity-60"
          >
            {submitting ? "যাচাই হচ্ছে..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
