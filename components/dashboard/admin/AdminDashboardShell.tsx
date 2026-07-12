"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminLogout } from "@/app/redux/features/admin/adminSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { logout as logoutApi } from "@/lib/api/auth";
import { AdminLogin } from "./AdminLogin";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/orders", label: "Orders", icon: "🧾" },
  { href: "/admin/shipping", label: "Shipping", icon: "🚚" },
  { href: "/admin/returns", label: "Returns", icon: "↩️" },
  { href: "/admin/campaigns", label: "Campaign", icon: "📣" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/coupons", label: "Coupons", icon: "🎟️" },
  { href: "/admin/reviews", label: "Reviews", icon: "⭐" },
  { href: "/admin/homepage", label: "Homepage", icon: "🏠" },
];

export function AdminDashboardShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useAppSelector((state) => state.admin.isAuthenticated);
  const accessToken = useAppSelector((state) => state.admin.accessToken);
  const adminName = useAppSelector((state) => state.admin.adminName);
  const refreshToken = useAppSelector((state) => state.admin.refreshToken);

  useEffect(() => {
    if (isAuthenticated && !accessToken) {
      dispatch(adminLogout());
    }
  }, [isAuthenticated, accessToken, dispatch]);

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
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange text-lg">
              🌿
            </div>
            <div>
              <p className="text-sm font-bold">Khaas Food</p>
              <p className="text-xs text-white/60">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-orange text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-bold">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{adminName}</p>
              <p className="text-xs text-white/60">Administrator</p>
            </div>
          </div>
          <Link
            href="/"
            className="mt-2 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            🌐 View Store
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-brand-border bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border text-gray-600 lg:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-900 sm:text-lg">
                Admin Dashboard
              </h1>
              <p className="hidden text-xs text-gray-500 sm:block">
                Store management panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
