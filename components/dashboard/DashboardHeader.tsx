"use client";

import Link from "next/link";
import { customerLogout, logoutDashboard } from "@/app/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { logout as logoutApi } from "@/lib/api/auth";
import { useGetUnreadCountQuery } from "@/app/redux/services/notificationApi";
import { CartCountBadge } from "@/components/cart/CartCountBadge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CartIcon } from "@/components/ui/Icons";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const dispatch = useAppDispatch();
  const { dictionary, locale } = useLocale();
  const t = dictionary.dashboard;
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
    <header className="flex flex-shrink-0 flex-col border-b border-brand-border bg-card px-3 py-2 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
      <div className="flex w-full min-w-0 items-center gap-2.5 sm:w-auto sm:flex-1 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-brand-border text-muted transition-colors hover:bg-brand-gray lg:hidden"
          aria-label="Open menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-bold text-foreground sm:text-lg">
            {customer
              ? t.welcome.replace("{name}", customer.name.split(" ")[0])
              : t.welcomeFallback}
          </h1>
          <p className="hidden text-xs text-muted sm:block">{t.subtitle}</p>
        </div>
      </div>

      <div className="mt-2 flex w-full flex-shrink-0 items-center justify-end gap-1.5 border-t border-brand-border/70 pt-2 sm:mt-0 sm:w-auto sm:gap-3 sm:border-0 sm:pt-0">
        <ThemeToggle />
        <LocaleSwitcher currentLocale={locale} />
        {isUnlocked && !isLoggedIn && (
          <button
            type="button"
            onClick={handleLockDashboard}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border text-sm font-semibold text-muted transition-colors hover:bg-brand-gray sm:h-auto sm:w-auto sm:px-3 sm:py-2 sm:text-xs"
            aria-label={t.lock}
            title={t.lock}
          >
            <span aria-hidden className="sm:hidden">🔒</span>
            <span className="hidden sm:inline">{t.lock}</span>
          </button>
        )}
        {isLoggedIn && (
          <button
            type="button"
            onClick={handleCustomerLogout}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-colors hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30 sm:h-auto sm:w-auto sm:px-3 sm:py-2 sm:text-sm sm:font-semibold"
            aria-label={t.logout}
            title={t.logout}
          >
            <svg
              className="h-4 w-4 sm:hidden"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 8l-4 4m0 0 4 4m-4-4h11m0-7h2a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
            </svg>
            <span className="hidden sm:inline">{t.logout}</span>
          </button>
        )}
        <Link
          href="/checkout"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-brand-gray hover:text-brand-orange"
          aria-label="Cart"
        >
          <CartIcon />
          <CartCountBadge />
        </Link>
        {isLoggedIn && (
          <Link
            href="/dashboard/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-brand-gray hover:text-brand-orange"
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
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange text-xs font-semibold text-white transition-colors hover:bg-brand-orange-dark sm:h-auto sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
          aria-label={t.goToShop}
          title={t.goToShop}
        >
          <span aria-hidden className="text-base sm:hidden">🏪</span>
          <span className="hidden sm:inline">{t.goToShop}</span>
        </Link>
      </div>
    </header>
  );
}
