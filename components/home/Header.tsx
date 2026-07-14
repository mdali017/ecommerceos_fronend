"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon, UserIcon, HeartIcon, CartIcon } from "@/components/ui/Icons";
import { CartCountBadge } from "@/components/cart/CartCountBadge";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { BrandMark } from "@/components/ui/BrandMark";
import { useAppSelector } from "@/app/redux/hooks";
import { useGetUnreadCountQuery } from "@/app/redux/services/notificationApi";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { localizeHref } from "@/lib/i18n/locale-path";
import Link from "next/link";

export function Header({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.auth.isCustomerLoggedIn);
  const customerName = useAppSelector((state) => state.auth.customer?.name);
  const { data: unreadData } = useGetUnreadCountQuery(undefined, { skip: !isLoggedIn });
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(localizeHref(`/search?q=${encodeURIComponent(query)}`, locale));
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4">
        <BrandMark href={localizeHref("/", locale)} hideTextOnMobile />

        <form onSubmit={handleSearch} className="relative flex-1">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dictionary.header.searchPlaceholder}
            className="w-full rounded-full border border-brand-border bg-brand-gray py-2 pl-4 pr-10 text-sm outline-none transition-colors focus:border-brand-orange focus:bg-white sm:py-2.5 sm:pl-5 sm:text-base"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-orange"
            aria-label="Search"
          >
            <SearchIcon />
          </button>
        </form>

        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
          <LocaleSwitcher currentLocale={locale} />

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-gray-700 transition-colors hover:text-brand-orange"
            >
              <UserIcon />
              <span className="hidden sm:inline">
                {customerName?.split(" ")[0] ?? dictionary.header.dashboard}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-gray-700 transition-colors hover:text-brand-orange"
            >
              <UserIcon />
              <span className="hidden sm:inline">{dictionary.header.signIn}</span>
            </Link>
          )}
          <Link
            href={isLoggedIn ? "/dashboard/wishlist" : "/login"}
            className="relative p-1.5 text-gray-700 transition-colors hover:text-brand-orange"
            aria-label="Wishlist"
          >
            <HeartIcon />
          </Link>
          {isLoggedIn && (
            <Link
              href="/dashboard/notifications"
              className="relative p-1.5 text-gray-700 transition-colors hover:text-brand-orange"
              aria-label="Notifications"
            >
              <span className="text-lg">🔔</span>
              {(unreadData?.count ?? 0) > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-[10px] font-bold text-white">
                  {unreadData!.count > 9 ? "9+" : unreadData!.count}
                </span>
              )}
            </Link>
          )}
          <Link
            href={localizeHref("/checkout", locale)}
            className="relative p-1.5 text-gray-700 transition-colors hover:text-brand-orange"
            aria-label="Cart"
          >
            <CartIcon />
            <CartCountBadge />
          </Link>
        </div>
      </div>
    </header>
  );
}
