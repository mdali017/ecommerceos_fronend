"use client";

import { useRef } from "react";
import type { Testimonial } from "@/lib/i18n/types";
import { StarIcon } from "@/components/ui/Icons";

export function TestimonialsSection({
  title,
  testimonials,
}: {
  title: string;
  testimonials: Testimonial[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-brand-gray py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-6 text-center text-lg font-bold text-gray-900 sm:text-xl">
          {title}
        </h2>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide sm:gap-5"
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex min-w-[280px] max-w-[320px] flex-shrink-0 flex-col rounded-xl border border-brand-border bg-white p-5 shadow-sm sm:min-w-[300px]"
            >
              <div className="mb-3 flex gap-0.5 text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} filled={i < t.rating} className="h-4 w-4" />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-gray-600">
                &ldquo;{t.review}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                  {t.avatar}
                </div>
                <span className="text-sm font-semibold text-gray-800">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
