"use client";

import { useState } from "react";
import type { ProductDetail } from "@/lib/product-detail";
import { StarIcon } from "@/components/ui/Icons";

type Tab = "description" | "video" | "reviews";

export function ProductTabs({ product }: { product: ProductDetail }) {
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const reviewCount = product.reviews.length;

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "বিবরণ" },
    { id: "video", label: "পণ্যের ভিডিও" },
    { id: "reviews", label: `গ্রাহক রিভিউ (${reviewCount})` },
  ];

  const avgRating =
    reviewCount > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / reviewCount
      : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product.reviews.filter((r) => r.rating === star).length,
    percent:
      reviewCount > 0
        ? (product.reviews.filter((r) => r.rating === star).length /
            reviewCount) *
          100
        : 0,
  }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Tab headers */}
      <div className="flex overflow-x-auto border-b border-brand-border scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 border-b-2 px-5 py-3 text-sm font-semibold transition-colors sm:px-8 sm:text-base ${
              activeTab === tab.id
                ? "border-brand-orange text-brand-orange"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pt-6">
        {activeTab === "description" && (
          <div className="max-w-3xl">
            <h3 className="text-lg font-bold text-gray-900">পণ্যের বিবরণ</h3>
            <p className="mt-3 leading-relaxed text-gray-600">
              {product.description}
            </p>

            <h4 className="mt-6 text-base font-bold text-gray-900">
              মূল বৈশিষ্ট্য
            </h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-600">
              {product.keyFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <h4 className="mt-6 text-base font-bold text-gray-900">
              ব্যবহার ও সংরক্ষণ
            </h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-600">
              {product.usageAndStorage.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "video" && (
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">ভিডিও</h3>
            {product.videoId ? (
              <div className="relative aspect-video max-w-3xl overflow-hidden rounded-xl bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${product.videoId}`}
                  title="পণ্যের ভিডিও"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            ) : (
              <p className="text-gray-500">কোনো ভিডিও উপলব্ধ নেই।</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Rating summary */}
              <div>
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-gray-900">
                    {avgRating.toFixed(1)}
                  </span>
                  <div>
                    <div className="flex gap-0.5 text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          filled={i < Math.round(avgRating)}
                          className="h-5 w-5"
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {reviewCount} টি রিভিউ
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {ratingBreakdown.map(({ star, percent }) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-gray-600">{star} ★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-gray">
                        <div
                          className="h-full rounded-full bg-yellow-400"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-gray-400">
                        {Math.round(percent)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review form */}
              <div className="rounded-xl border border-brand-border bg-brand-gray/50 p-5">
                <h4 className="font-bold text-gray-900">আপনার রিভিউ দিন</h4>
                <div className="mt-3 flex gap-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" aria-label={`Rate ${i + 1} stars`}>
                      <StarIcon className="h-6 w-6" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="আপনার নাম"
                  className="mt-4 w-full rounded-lg border border-brand-border bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
                />
                <textarea
                  placeholder="আপনার মতামত লিখুন..."
                  rows={4}
                  className="mt-3 w-full resize-none rounded-lg border border-brand-border bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
                />
                <button
                  type="button"
                  className="mt-4 rounded-lg bg-[#1a3a4a] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#142e3a]"
                >
                  রিভিউ জমা দিন
                </button>
              </div>
            </div>

            {/* Review list */}
            <div className="mt-8 space-y-5">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-brand-border pb-5 last:border-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-800">
                          {review.author}
                        </span>
                        <span className="text-xs text-gray-400">
                          {review.date}
                        </span>
                      </div>
                      <div className="mt-1 flex gap-0.5 text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            filled={i < review.rating}
                            className="h-3.5 w-3.5"
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
