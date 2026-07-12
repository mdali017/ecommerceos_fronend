import { CategoryNav } from "@/components/home/CategoryNav";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <>
      <Header locale={locale} dictionary={dictionary} />
      <CategoryNav locale={locale} dictionary={dictionary} />
      <main>{children}</main>
      <Footer dictionary={dictionary} />
    </>
  );
}
