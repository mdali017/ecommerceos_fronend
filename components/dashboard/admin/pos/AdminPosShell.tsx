"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminLogout } from "@/app/redux/features/admin/adminSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { logout as logoutApi } from "@/lib/api/auth";
import { AdminLogin } from "../AdminLogin";

export function AdminPosShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.admin.isAuthenticated);
  const accessToken = useAppSelector((state) => state.admin.accessToken);
  const adminName = useAppSelector((state) => state.admin.adminName);
  const refreshToken = useAppSelector((state) => state.admin.refreshToken);

  if (!isAuthenticated || !accessToken) {
    return <AdminLogin />;
  }

  const handleLogout = () => {
    if (refreshToken) {
      void logoutApi(refreshToken).catch(() => undefined);
    }
    dispatch(adminLogout());
    router.push("/admin");
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-brand-border bg-white px-3 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <Link
            href="/admin"
            className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-brand-border text-sm text-gray-600 transition-colors hover:bg-brand-gray lg:hidden"
            aria-label="Back to admin panel"
          >
            ←
          </Link>
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-orange text-lg">
            🌿
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-gray-900 sm:text-lg">Point of Sale</h1>
            <p className="hidden text-xs text-gray-500 sm:block">Khaas Food — Admin POS</p>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            className="hidden rounded-lg border border-brand-border px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-brand-gray sm:inline-flex sm:text-sm"
          >
            ← Admin Panel
          </Link>
          <span className="hidden rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-brand-orange sm:block">
            {adminName}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 sm:text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto lg:overflow-hidden">{children}</main>
    </div>
  );
}
