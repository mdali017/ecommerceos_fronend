"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "ড্যাশবোর্ড", icon: "📊" },
  { href: "/dashboard/orders", label: "আমার অর্ডার", icon: "📦" },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: "❤️" },
  { href: "/dashboard/notifications", label: "Notifications", icon: "🔔" },
  { href: "/dashboard/profile", label: "প্রোফাইল", icon: "👤" },
  { href: "/", label: "কেনাকাটা", icon: "🛒" },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
}

export function DashboardSidebar({
  isOpen,
  onClose,
  customerName,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-brand-green text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl">
            🌿
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Khaas Food</p>
            <p className="text-xs text-white/60">Customer Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href) && item.href !== "/";

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-orange text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-orange text-sm font-bold">
              {customerName?.charAt(0) ?? "?"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {customerName ?? "গ্রাহক"}
              </p>
              <p className="text-xs text-white/60">Customer</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
