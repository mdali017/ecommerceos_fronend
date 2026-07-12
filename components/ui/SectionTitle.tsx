"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";

export function SectionTitle({
  title,
  viewAllHref = "#",
}: {
  title: string;
  viewAllHref?: string;
}) {
  const { dictionary, localizePath } = useLocale();
  const href = viewAllHref === "#" ? viewAllHref : localizePath(viewAllHref);

  return (
    <div className="mb-4 flex items-center justify-between sm:mb-5">
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">{title}</h2>
      {viewAllHref !== "#" ? (
        <Link
          href={href}
          className="text-sm font-medium text-brand-orange transition-colors hover:text-brand-orange-dark"
        >
          {dictionary.common.viewAll}
        </Link>
      ) : (
        <span className="text-sm font-medium text-brand-orange">
          {dictionary.common.viewAll}
        </span>
      )}
    </div>
  );
}
