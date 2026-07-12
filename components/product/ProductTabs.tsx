"use client";

import { useMemo, useState } from "react";
import type { ProductDetail } from "@/lib/product-detail";
import { StarIcon } from "@/components/ui/Icons";
import {
  useCreateProductReviewMutation,
  useGetProductReviewsQuery,
} from "@/app/redux/services/reviewApi";
import { useAppSelector } from "@/app/redux/hooks";
import Swal from "sweetalert2";

type Tab = "description" | "video" | "reviews";

function formatReviewDate(iso: string) {
  return new Date(iso).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ProductTabs({ product }: { product: ProductDetail }) {
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const customerName = useAppSelector((state) => state.auth.customer?.name);
  const { data: reviewData, isLoading: reviewsLoading } = useGetProductReviewsQuery(
    product.slug
  );
  const [createReview, { isLoading: submitting }] = useCreateProductReviewMutation();

  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [comment, setComment] = useState("");

  const reviews = useMemo(() => {
    if (reviewData?.reviews?.length) {
      return reviewData.reviews.map((review) => ({
        id: review.id,
        author: review.authorName,
        avatar: review.authorName.charAt(0),
        rating: review.rating,
        date: formatReviewDate(review.createdAt),
        comment: review.comment,
      }));
    }
    return product.reviews;
  }, [reviewData, product.reviews]);

  const reviewCount = reviewData?.totalReviews ?? reviews.length;
  const avgRating = reviewData?.averageRating ??
    (reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0);

  const tabs: { id: Tab; label: string }[] = [
    { id: "description", label: "বিবরণ" },
    { id: "video", label: "পণ্যের ভিডিও" },
    { id: "reviews", label: `গ্রাহক রিভিউ (${reviewCount})` },
  ];

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
    percent:
      reviewCount > 0
        ? (reviews.filter((review) => review.rating === star).length / reviewCount) * 100
        : 0,
  }));

  const handleSubmitReview = async () => {
    const name = (authorName || customerName || "").trim();
    const text = comment.trim();

    if (!name || text.length < 3) {
      await Swal.fire({
        icon: "warning",
        title: "তথ্য অসম্পূর্ণ",
        text: "নাম এবং কমপক্ষে ৩ অক্ষরের মতামত দিন।",
        confirmButtonColor: "#f58220",
      });
      return;
    }

    try {
      await createReview({
        slug: product.slug,
        body: { authorName: name, rating, comment: text },
      }).unwrap();

      setComment("");
      if (!customerName) setAuthorName("");

      await Swal.fire({
        icon: "success",
        title: "রিভিউ জমা হয়েছে!",
        confirmButtonColor: "#f58220",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "রিভিউ জমা দেওয়া যায়নি",
        confirmButtonColor: "#f58220",
      });
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
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

      <div className="pt-6">
        {activeTab === "description" && (
          <div className="max-w-3xl">
            <h3 className="text-lg font-bold text-gray-900">পণ্যের বিবরণ</h3>
            <p className="mt-3 leading-relaxed text-gray-600">{product.description}</p>
            <h4 className="mt-6 text-base font-bold text-gray-900">মূল বৈশিষ্ট্য</h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-600">
              {product.keyFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <h4 className="mt-6 text-base font-bold text-gray-900">ব্যবহার ও সংরক্ষণ</h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-600">
              {product.usageAndStorage.map((item) => (
                <li key={item}>{item}</li>
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
              <div>
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-gray-900">
                    {avgRating.toFixed(1)}
                  </span>
                  <div>
                    <div className="flex gap-0.5 text-yellow-400">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <StarIcon
                          key={index}
                          filled={index < Math.round(avgRating)}
                          className="h-5 w-5"
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{reviewCount} টি রিভিউ</p>
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

              <div className="rounded-xl border border-brand-border bg-brand-gray/50 p-5">
                <h4 className="font-bold text-gray-900">আপনার রিভিউ দিন</h4>
                <div className="mt-3 flex gap-1 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Rate ${index + 1} stars`}
                      onClick={() => setRating(index + 1)}
                    >
                      <StarIcon filled={index < rating} className="h-6 w-6" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="আপনার নাম"
                  value={authorName || customerName || ""}
                  onChange={(e) => setAuthorName(e.target.value)}
                  disabled={Boolean(customerName)}
                  className="mt-4 w-full rounded-lg border border-brand-border bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
                />
                <textarea
                  placeholder="আপনার মতামত লিখুন..."
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-3 w-full resize-none rounded-lg border border-brand-border bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
                />
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => void handleSubmitReview()}
                  className="mt-4 rounded-lg bg-[#1a3a4a] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#142e3a] disabled:opacity-60"
                >
                  {submitting ? "জমা হচ্ছে..." : "রিভিউ জমা দিন"}
                </button>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {reviewsLoading && reviews.length === 0 ? (
                <p className="text-sm text-gray-500">রিভিউ লোড হচ্ছে...</p>
              ) : reviews.length === 0 ? (
                <p className="text-sm text-gray-500">এখনো কোনো রিভিউ নেই। প্রথম রিভিউ দিন!</p>
              ) : (
                reviews.map((review) => (
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
                          <span className="font-semibold text-gray-800">{review.author}</span>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <div className="mt-1 flex gap-0.5 text-yellow-400">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <StarIcon
                              key={index}
                              filled={index < review.rating}
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
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
