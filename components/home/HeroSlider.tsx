"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { HeroSlide } from "@/lib/i18n/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icons";

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (slides.length === 0) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  useEffect(() => {
    if (current >= slides.length) {
      setCurrent(0);
    }
  }, [current, slides.length]);

  if (slides.length === 0) {
    return (
      <div className="relative h-[180px] overflow-hidden rounded-xl bg-brand-gray sm:h-[240px] lg:h-[300px]" />
    );
  }

  const slide = slides[current];

  return (
    <div className="relative h-[180px] overflow-hidden rounded-xl sm:h-[240px] lg:h-[300px]">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 850px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/60" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-center justify-end px-5 sm:px-8 md:px-10">
        <div className="max-w-[55%] text-right sm:max-w-[50%]">
          <h2 className="text-base font-bold leading-tight text-white sm:text-xl md:text-2xl lg:text-3xl">
            {slide.title}
          </h2>
          <p className="mt-1.5 hidden text-sm text-white/90 sm:block md:text-base">
            {slide.subtitle}
          </p>
          <button
            type="button"
            className="mt-3 rounded bg-brand-orange px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-orange-dark sm:px-5 sm:py-2 sm:text-sm"
          >
            {slide.cta}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg transition-colors hover:bg-brand-orange-dark sm:left-3 sm:h-9 sm:w-9"
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg transition-colors hover:bg-brand-orange-dark sm:right-3 sm:h-9 sm:w-9"
        aria-label="Next slide"
      >
        <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      <div className="absolute bottom-3 left-4 flex gap-1.5 sm:bottom-4 sm:left-5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all sm:h-2 ${
              i === current
                ? "w-5 bg-brand-orange sm:w-6"
                : "w-1.5 bg-white/60 hover:bg-white sm:w-2"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
