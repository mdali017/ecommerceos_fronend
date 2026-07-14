"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { fallbackCategories } from "@/lib/data";
import { isImageUrl } from "@/lib/image-utils";
import type { Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/locale-path";
import { getCategoryDisplayName } from "@/lib/i18n/product-display";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";

function CategoryIconDisplay({ icon }: { icon: string }) {
  if (isImageUrl(icon)) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-full">
        <Image src={icon} alt="" fill className="object-cover" sizes="64px" />
      </div>
    );
  }

  return <span>{icon}</span>;
}

export function CategoryIcons({
  categories = [],
  locale,
}: {
  categories?: Array<{ slug: string; nameBn: string; name?: string; icon: string }>;
  locale: Locale;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const source = categories.length > 0 ? categories : fallbackCategories;

  const items = source.map((category) => ({
    slug: category.slug,
    name: getCategoryDisplayName(category, locale),
    icon: category.icon,
  }));

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-white text-brand-orange shadow-sm transition-colors hover:bg-brand-cream sm:-left-3"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-6 scrollbar-hide sm:gap-6 sm:px-8"
        >
          {items.map((cat) => (
            <Link
              key={cat.slug}
              href={localizeHref(`/products?category=${cat.slug}`, locale)}
              className="flex min-w-[72px] flex-col items-center gap-2 transition-transform hover:scale-105 sm:min-w-[80px]"
            >
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-brand-orange/30 bg-brand-cream text-2xl sm:h-16 sm:w-16 sm:text-3xl">
                <CategoryIconDisplay icon={cat.icon} />
              </div>
              <span className="text-center text-xs font-medium text-gray-700 sm:text-sm">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-white text-brand-orange shadow-sm transition-colors hover:bg-brand-cream sm:-right-3"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
