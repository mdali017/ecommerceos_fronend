import Link from "next/link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/locale-path";

export default async function NotFound({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? (localeParam as Locale) : "bn";
  const dictionary = await getDictionary(locale);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        {dictionary.pages.productNotFound}
      </h1>
      <p className="mt-2 text-gray-500">{dictionary.pages.noProductsHint}</p>
      <Link
        href={localizeHref("/", locale)}
        className="mt-6 rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
      >
        {dictionary.pages.backHome}
      </Link>
    </div>
  );
}
