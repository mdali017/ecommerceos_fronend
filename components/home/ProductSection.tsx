"use client";

import { useRef } from "react";
import type { Product } from "@/lib/data";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCard } from "@/components/ui/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";

export function ProductSection({
  title,
  products,
  viewAllHref = "#",
}: {
  title: string;
  products: Product[];
  viewAllHref?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -220 : 220;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <SectionTitle title={title} viewAllHref={viewAllHref} />
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-white text-brand-orange shadow-md transition-colors hover:bg-brand-cream sm:flex"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide sm:gap-5"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-white text-brand-orange shadow-md transition-colors hover:bg-brand-cream sm:flex"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
