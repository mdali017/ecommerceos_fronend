"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/product-detail";

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
      {/* Thumbnails */}
      <div className="order-2 flex gap-2 overflow-x-auto scrollbar-hide sm:order-1 sm:flex-col sm:overflow-visible">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(i)}
            className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors sm:h-[72px] sm:w-[72px] ${
              i === active
                ? "border-brand-orange"
                : "border-brand-border hover:border-brand-orange/50"
            }`}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="72px"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative order-1 aspect-square flex-1 overflow-hidden rounded-xl border border-brand-border bg-white sm:order-2">
        <Image
          src={current.url}
          alt={current.alt}
          fill
          className="object-contain p-4"
          sizes="(max-width: 640px) 100vw, 500px"
          priority
        />
      </div>
    </div>
  );
}
