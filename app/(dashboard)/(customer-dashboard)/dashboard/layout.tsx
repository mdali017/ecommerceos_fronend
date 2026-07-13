import type { Metadata } from "next";
import { cookies } from "next/headers";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LOCALE_COOKIE, parseLocaleCookie } from "@/lib/i18n/locale-cookie";

export const metadata: Metadata = {
  title: "My Account | Khaas Food",
  description: "Manage your orders, wishlist, and profile at Khaas Food.",
  robots: { index: false, follow: false },
};

export default async function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = parseLocaleCookie(cookieStore.get(LOCALE_COOKIE)?.value);
  const dictionary = await getDictionary(locale);

  return (
    <LocaleProvider locale={locale} dictionary={dictionary}>
      <DashboardShell>{children}</DashboardShell>
    </LocaleProvider>
  );
}
