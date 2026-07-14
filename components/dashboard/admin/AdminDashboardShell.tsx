"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminLogout } from "@/app/redux/features/admin/adminSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { logout as logoutApi } from "@/lib/api/auth";
import {
  adminNavItems,
  isAdminGroupActive,
  isAdminNavActive,
  type AdminNavGroup,
} from "@/lib/admin-nav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AdminLogin } from "./AdminLogin";
import { AdminPosShell } from "./pos/AdminPosShell";

function getInitiallyExpandedGroups(pathname: string) {
  const expanded = new Set<string>();
  for (const item of adminNavItems) {
    if (item.type === "group" && isAdminGroupActive(item, pathname)) {
      expanded.add(item.id);
    }
  }
  return expanded;
}

export function AdminDashboardShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() =>
    getInitiallyExpandedGroups(pathname)
  );
  const isAuthenticated = useAppSelector((state) => state.admin.isAuthenticated);
  const accessToken = useAppSelector((state) => state.admin.accessToken);
  const adminName = useAppSelector((state) => state.admin.adminName);
  const refreshToken = useAppSelector((state) => state.admin.refreshToken);

  useEffect(() => {
    if (isAuthenticated && !accessToken) {
      dispatch(adminLogout());
    }
  }, [isAuthenticated, accessToken, dispatch]);

  useEffect(() => {
    setExpandedGroups(getInitiallyExpandedGroups(pathname));
  }, [pathname]);

  if (!isAuthenticated || !accessToken) {
    return <AdminLogin />;
  }

  if (pathname.startsWith("/admin/pos")) {
    return <AdminPosShell>{children}</AdminPosShell>;
  }

  const handleLogout = () => {
    if (refreshToken) {
      void logoutApi(refreshToken).catch(() => undefined);
    }
    dispatch(adminLogout());
    router.push("/admin");
  };

  const collapseAllGroups = () => setExpandedGroups(new Set());

  const expandOnlyGroup = (groupId: string) => setExpandedGroups(new Set([groupId]));

  const handleGroupNavigate = (group: AdminNavGroup) => {
    const firstChild = group.children[0];
    if (!firstChild) return;

    expandOnlyGroup(group.id);

    if (!isAdminNavActive(firstChild.href, pathname)) {
      router.push(firstChild.href);
      setSidebarOpen(false);
    }
  };

  const toggleGroup = (group: AdminNavGroup) => {
    setExpandedGroups((prev) => {
      if (prev.has(group.id)) {
        return new Set();
      }
      return new Set([group.id]);
    });
  };

  const handleNavLinkClick = () => {
    collapseAllGroups();
    setSidebarOpen(false);
  };

  const handleChildLinkClick = (groupId: string) => {
    expandOnlyGroup(groupId);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
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
              <p className="text-sm font-bold">Ecommerce OS</p>
              <p className="text-xs text-white/60">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="scrollbar-hide min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {adminNavItems.map((item) => {
            if (item.type === "link") {
              const isActive = isAdminNavActive(item.href, pathname);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavLinkClick}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-orange text-white"
                      : "text-white/80 hover:bg-card/10"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            }

            const isGroupActive = isAdminGroupActive(item, pathname);
            const isExpanded = expandedGroups.has(item.id);

            return (
              <div key={item.id}>
                <div
                  className={`flex w-full items-center rounded-xl transition-colors ${
                    isGroupActive
                      ? "bg-card/10 text-white"
                      : "text-white/80 hover:bg-card/10"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleGroupNavigate(item)}
                    className="flex flex-1 items-center gap-3 px-4 py-3 text-sm font-medium"
                  >
                    <span>{item.icon}</span>
                    <span className="text-left">{item.label}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleGroup(item)}
                    aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label}`}
                    className="px-3 py-3 text-white/50 transition-colors hover:text-white"
                  >
                    <span
                      className={`inline-block text-[10px] transition-transform duration-300 ease-out ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                </div>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                  aria-hidden={!isExpanded}
                >
                  <div className={`overflow-hidden ${isExpanded ? "" : "pointer-events-none"}`}>
                    <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2 pb-1">
                      {item.children.map((child, index) => {
                        const isActive = isAdminNavActive(child.href, pathname);

                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => handleChildLinkClick(item.id)}
                            style={{
                              transitionDelay: isExpanded ? `${index * 40}ms` : "0ms",
                            }}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-out ${
                              isExpanded
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-2 opacity-0"
                            } ${
                              isActive
                                ? "bg-brand-orange text-white"
                                : "text-white/70 hover:bg-card/10 hover:text-white"
                            }`}
                          >
                            <span className="text-base">{child.icon}</span>
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-card/10 px-3 py-3">
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
            className="mt-2 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-card/10 hover:text-white"
          >
            🌐 View Store
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-brand-border bg-card px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border text-muted transition-colors hover:bg-brand-gray lg:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>
            <div>
              <h1 className="text-base font-bold text-foreground sm:text-lg">
                Admin Dashboard
              </h1>
              <p className="hidden text-xs text-muted sm:block">
                Store management panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <span className="hidden rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-brand-orange dark:bg-orange-950/40 sm:block">
              {adminName}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30 sm:text-sm"
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
