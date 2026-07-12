"use client";

import Link from "next/link";
import { customerLogout, logoutDashboard } from "@/app/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { logout as logoutApi } from "@/lib/api/auth";
import { useGetUnreadCountQuery } from "@/app/redux/services/notificationApi";
import { CartCountBadge } from "@/components/cart/CartCountBadge";
import { CartIcon } from "@/components/ui/Icons";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const dispatch = useAppDispatch();
  const customer = useAppSelector((state) => state.auth.customer);
  const isLoggedIn = useAppSelector((state) => state.auth.isCustomerLoggedIn);
  const isUnlocked = useAppSelector((state) => state.auth.isDashboardUnlocked);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const { data: unreadData } = useGetUnreadCountQuery(undefined, { skip: !isLoggedIn });

  const handleCustomerLogout = () => {
    if (refreshToken) {
      void logoutApi(refreshToken).catch(() => undefined);
    }
    dispatch(customerLogout());
  };

  const handleLockDashboard = () => {
    if (refreshToken) {
      void logoutApi(refreshToken).catch(() => undefined);
    }
    dispatch(logoutDashboard());
  };

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-brand-border bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border text-gray-600 transition-colors hover:bg-brand-gray lg:hidden"
          aria-label="Open menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-900 sm:text-lg">
            {customer ? `স্বাগতম, ${customer.name.split(" ")[0]}!` : "ড্যাশবোর্ড"}
          </h1>
          <p className="hidden text-xs text-gray-500 sm:block">
            আপনার অর্ডার ও অ্যাকাউন্ট পরিচালনা করুন
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {isUnlocked && !isLoggedIn && (
          <button
            type="button"
            onClick={handleLockDashboard}
            className="hidden rounded-lg border border-brand-border px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-brand-gray sm:block"
          >
            🔒 লক করুন
          </button>
        )}
        {isLoggedIn && (
          <button
            type="button"
            onClick={handleCustomerLogout}
            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 sm:text-sm"
          >
            লগআউট
          </button>
        )}
        <Link
          href="/checkout"
          className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-brand-gray hover:text-brand-orange"
          aria-label="Cart"
        >
          <CartIcon />
          <CartCountBadge />
        </Link>
        {isLoggedIn && (
          <Link
            href="/dashboard/notifications"
            className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-brand-gray hover:text-brand-orange"
            aria-label="Notifications"
          >
            <span className="text-lg">🔔</span>
            {(unreadData?.count ?? 0) > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white">
                {unreadData!.count > 9 ? "9+" : unreadData!.count}
              </span>
            )}
          </Link>
        )}
        <Link
          href="/"
          className="rounded-lg bg-brand-orange px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-orange-dark sm:px-4 sm:text-sm"
        >
          শপে যান
        </Link>
      </div>
    </header>
  );
}
