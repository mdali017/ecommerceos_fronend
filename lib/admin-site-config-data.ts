export const sitePages = [
  {
    id: "homepage",
    title: "Homepage",
    description: "Hero slider, banners, brands, product sections & more",
    href: "/admin/homepage",
    icon: "🏠",
    color: "bg-orange-50 text-brand-orange dark:bg-orange-950/40",
  },
  {
    id: "about",
    title: "About Page",
    description: "Company story, mission & team information",
    href: "/admin/site-config/about",
    icon: "📄",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  },
  {
    id: "contact",
    title: "Contact Page",
    description: "Contact details, address & inquiry form",
    href: "/admin/site-config/contact",
    icon: "📧",
    color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400",
  },
] as const;
