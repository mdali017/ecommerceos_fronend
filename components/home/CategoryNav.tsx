import Link from "next/link";
import { fetchCategories } from "@/lib/api/categories.server";
import { fallbackCategories } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { localizeHref } from "@/lib/i18n/locale-path";
import { getCategoryDisplayName } from "@/lib/i18n/product-display";

export async function CategoryNav({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary;
}) {
  const categories = await fetchCategories();

  const source = categories.length > 0 ? categories : fallbackCategories;

  const items = source.map((category) => ({
    slug: category.slug,
    label: getCategoryDisplayName(category, locale),
  }));

  return (
    <nav className="bg-brand-green">
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 scrollbar-hide sm:px-6">
        <ul className="flex items-center gap-0 whitespace-nowrap">
          {items.map((cat, i) => (
            <li key={cat.slug}>
              <Link
                href={localizeHref(`/category/${cat.slug}`, locale)}
                className={`block px-3 py-2.5 text-sm text-white transition-colors hover:bg-brand-green-light sm:px-4 sm:py-3 sm:text-[15px] ${
                  i === 0 ? "bg-brand-orange font-medium" : ""
                }`}
              >
                {cat.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={localizeHref("/", locale)}
              className="ml-1 block rounded bg-brand-orange px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-orange-dark sm:px-4 sm:py-2.5"
            >
              {dictionary.nav.allCategories}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
