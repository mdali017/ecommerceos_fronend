"use client";

import { useState } from "react";
import Link from "next/link";
import { setAdminSession } from "@/app/redux/features/admin/adminSlice";
import { useAppDispatch } from "@/app/redux/hooks";
import { loginAdmin } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import {
  showAdminLoginSuccess,
  showAdminLoginError,
  showAdminValidationError,
} from "@/lib/admin-swal";

export function AdminLogin() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      await showAdminValidationError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await loginAdmin({
        email: email.trim(),
        password: password.trim(),
      });

      dispatch(
        setAdminSession({
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
        })
      );

      await showAdminLoginSuccess(result.user.name);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Invalid email or password. Please try again.";
      await showAdminLoginError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-brand-green p-10 text-white lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange text-2xl">
              🌿
            </div>
            <div>
              <p className="text-lg font-bold">Khaas Food</p>
              <p className="text-sm text-white/60">Admin Control Panel</p>
            </div>
          </div>
          <h1 className="mt-12 text-3xl font-bold leading-tight">
            Manage your store<br />from one place
          </h1>
          <p className="mt-4 max-w-sm text-white/70">
            Manage orders, products, customers, and sales — all from one place.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
            Demo Credentials
          </p>
          <p className="mt-2 text-sm">
            <span className="text-white/60">Email:</span>{" "}
            <span className="font-mono font-semibold">admin@test.com</span>
          </p>
          <p className="mt-1 text-sm">
            <span className="text-white/60">Password:</span>{" "}
            <span className="font-mono font-semibold">123456</span>
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-slate-50 px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <p className="text-2xl font-bold text-gray-900">Khaas Food Admin</p>
            <p className="text-sm text-gray-500">Sign in to continue</p>
          </div>

          <div className="rounded-2xl border border-brand-border bg-white p-8 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900">Admin Login</h2>
            <p className="mt-1 text-sm text-gray-500">
              Sign in with your admin account
            </p>

            <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
              <div>
                <label htmlFor="admin-email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@test.com"
                  className="w-full rounded-xl border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  id="admin-password"
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
                {submitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500 lg:hidden">
              Demo: admin@test.com / 123456
            </p>
          </div>

          <Link
            href="/"
            className="mt-6 block text-center text-sm font-semibold text-brand-green hover:text-brand-orange"
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
