export type AdminNavLink = {
  type: "link";
  href: string;
  label: string;
  icon: string;
};

export type AdminNavGroup = {
  type: "group";
  id: string;
  label: string;
  icon: string;
  children: Omit<AdminNavLink, "type">[];
};

export type AdminNavItem = AdminNavLink | AdminNavGroup;

export const adminNavItems: AdminNavItem[] = [
  { type: "link", href: "/admin", label: "Dashboard", icon: "📊" },
  { type: "link", href: "/admin/pos", label: "POS", icon: "🖥️" },
  { type: "link", href: "/admin/products", label: "Products", icon: "📦" },
  {
    type: "group",
    id: "orders",
    label: "Orders",
    icon: "🧾",
    children: [
      { href: "/admin/orders", label: "All Orders", icon: "📋" },
      { href: "/admin/orders/completed", label: "Completed", icon: "✅" },
      { href: "/admin/shipping", label: "Shipping", icon: "🚚" },
      { href: "/admin/returns", label: "Returns", icon: "↩️" },
    ],
  },
  { type: "link", href: "/admin/customers", label: "Customers", icon: "👥" },
  {
    type: "group",
    id: "features",
    label: "Features",
    icon: "✨",
    children: [
      { href: "/admin/campaigns", label: "Campaign", icon: "📣" },
      { href: "/admin/coupons", label: "Coupons", icon: "🎟️" },
      { href: "/admin/reviews", label: "Reviews", icon: "⭐" },
    ],
  },
  { type: "link", href: "/admin/site-config", label: "Site Config", icon: "⚙️" },
];

export function isAdminNavActive(href: string, pathname: string) {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/pos") return pathname.startsWith("/admin/pos");
  // Keep "All Orders" from highlighting when on /admin/orders/completed
  if (href === "/admin/orders") {
    return pathname === "/admin/orders" || pathname === "/admin/orders/";
  }
  if (href === "/admin/site-config") {
    return (
      pathname.startsWith("/admin/site-config") || pathname.startsWith("/admin/homepage")
    );
  }
  return pathname.startsWith(href);
}

export function isAdminGroupActive(group: AdminNavGroup, pathname: string) {
  return group.children.some((child) => isAdminNavActive(child.href, pathname));
}
