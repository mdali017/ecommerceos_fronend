"use client";

import { useEffect, useState } from "react";
import {
  setLoginMethod,
  setCustomerSession,
} from "@/app/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { activateCheckoutCustomer, loginCustomer } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { showUnlockError, showUnlockSuccess } from "@/lib/swal";

type UnlockMode = "activate" | "login";

export function UnlockModal() {
  const dispatch = useAppDispatch();
  const loginMethod = useAppSelector((state) => state.auth.loginMethod);
  const customer = useAppSelector((state) => state.auth.customer);
  const pendingCheckoutActivation = useAppSelector(
    (state) => state.auth.pendingCheckoutActivation
  );
  const [mode, setMode] = useState<UnlockMode>(
    pendingCheckoutActivation && customer ? "activate" : "login"
  );
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (pendingCheckoutActivation && customer) {
      setMode("activate");
    }
  }, [pendingCheckoutActivation, customer]);

  useEffect(() => {
    if (mode !== "login") {
      return;
    }

    if (loginMethod === "phone") {
      setIdentifier(customer?.phone ?? "");
    } else {
      setIdentifier(customer?.email ?? "");
    }
  }, [loginMethod, customer, mode]);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer) {
      await showUnlockError("অর্ডারের তথ্য পাওয়া যায়নি।");
      return;
    }

    if (!password.trim() || password.trim().length < 4) {
      await showUnlockError("পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      await showUnlockError("পাসওয়ার্ড মিলছে না।");
      return;
    }

    setSubmitting(true);

    try {
      const result = await activateCheckoutCustomer({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        password: password.trim(),
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
          : "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।";
      await showUnlockError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      await showUnlockError("ফোন/ইমেইল এবং পাসওয়ার্ড দিন।");
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
            {mode === "activate"
              ? "অর্ডারের তথ্য দিয়ে পাসওয়ার্ড সেট করুন"
              : "অর্ডার দেখতে লগইন করুন"}
          </p>
        </div>

        {mode === "activate" && customer ? (
          <form onSubmit={(e) => void handleActivate(e)} className="space-y-4">
            <div className="rounded-xl border border-brand-border bg-brand-gray/40 p-4 text-sm">
              <p className="font-semibold text-gray-900">{customer.name}</p>
              <p className="mt-1 text-gray-600">{customer.phone}</p>
              <p className="text-gray-600">{customer.email}</p>
              <p className="mt-1 text-gray-600">{customer.address}</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                পাসওয়ার্ড সেট করুন
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৪ অক্ষর"
                className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="পাসওয়ার্ড আবার লিখুন"
                className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-green py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-green-light disabled:opacity-60"
            >
              {submitting ? "সংরক্ষণ হচ্ছে..." : "পাসওয়ার্ড সেট করুন"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("login");
                setPassword("");
                setConfirmPassword("");
              }}
              className="w-full text-sm font-medium text-brand-green hover:underline"
            >
              ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন
            </button>
          </form>
        ) : (
          <>
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

            <form onSubmit={(e) => void handleLogin(e)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  {loginMethod === "phone" ? "ফোন নম্বর" : "ইমেইল"}
                </label>
                <input
                  type={loginMethod === "phone" ? "tel" : "email"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    loginMethod === "phone"
                      ? "01XXXXXXXXX"
                      : "example@email.com"
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
                {submitting ? "যাচাই হচ্ছে..." : "লগইন করুন"}
              </button>

              {pendingCheckoutActivation && customer ? (
                <button
                  type="button"
                  onClick={() => {
                    setMode("activate");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="w-full text-sm font-medium text-brand-green hover:underline"
                >
                  নতুন অর্ডার? পাসওয়ার্ড সেট করুন
                </button>
              ) : null}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
