"use client";

import { useState, useEffect, useRef } from "react";
import type { Product } from "@/lib/data";
import { ProductCard } from "@/components/ui/ProductCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";

function useCountdown(targetHours: number) {
  const [timeLeft, setTimeLeft] = useState({
    hours: targetHours,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const end = Date.now() + targetHours * 3600 * 1000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [targetHours]);

  return timeLeft;
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-lg font-bold text-white sm:h-12 sm:w-12 sm:text-xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] text-gray-600 sm:text-xs">{label}</span>
    </div>
  );
}

export function FlashSaleSection({
  products,
  labels,
  title,
}: {
  products: Product[];
  labels: {
    flashSale: string;
    endingIn: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  title?: string;
}) {
  const countdown = useCountdown(5);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="bg-brand-cream py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            {title ?? labels.flashSale}
          </h2>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm text-gray-600">{labels.endingIn}</span>
            <div className="flex gap-2">
              <TimeBlock value={countdown.hours} label={labels.hours} />
              <span className="self-start pt-2 font-bold text-brand-orange">:</span>
              <TimeBlock value={countdown.minutes} label={labels.minutes} />
              <span className="self-start pt-2 font-bold text-brand-orange">:</span>
              <TimeBlock value={countdown.seconds} label={labels.seconds} />
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute -left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-white text-brand-orange shadow-md sm:flex"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="h-4 w-4" />
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
            className="absolute -right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-white text-brand-orange shadow-md sm:flex"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
