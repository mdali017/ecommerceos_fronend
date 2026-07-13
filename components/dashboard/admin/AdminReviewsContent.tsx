"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  useDeleteReviewMutation,
  useListAllReviewsQuery,
  useUpdateReviewStatusMutation,
} from "@/app/redux/services/reviewApi";
import { AdminStatGrid } from "@/components/dashboard/admin/AdminStatCard";
import Swal from "sweetalert2";

type ReviewFilter = "all" | "approved" | "pending";

const filters: { label: string; value: ReviewFilter }[] = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function AdminReviewsContent() {
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>("all");
  const { data: reviews = [], isLoading, isError, refetch } = useListAllReviewsQuery();
  const [updateStatus] = useUpdateReviewStatusMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredReviews = useMemo(() => {
    if (activeFilter === "approved") {
      return reviews.filter((review) => review.isApproved);
    }
    if (activeFilter === "pending") {
      return reviews.filter((review) => !review.isApproved);
    }
    return reviews;
  }, [reviews, activeFilter]);

  const reviewStats = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter((r) => !r.isApproved).length;
    const approved = reviews.filter((r) => r.isApproved).length;
    const avgRating =
      total > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
        : "0";
    return { total, pending, approved, avgRating };
  }, [reviews]);

  const handleToggleStatus = async (id: string, isApproved: boolean) => {
    setUpdatingId(id);
    try {
      await updateStatus({ id, isApproved: !isApproved }).unwrap();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, authorName: string) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete review?",
      text: `Remove review by ${authorName}?`,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteReview(id).unwrap();
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Failed to delete review",
        confirmButtonColor: "#f58220",
      });
    }
  };

  return (
    <div className="space-y-6">
      <AdminStatGrid
        stats={[
          { label: "Total Reviews", value: isLoading ? "—" : reviewStats.total, icon: "⭐", color: "bg-blue-50 text-blue-600" },
          { label: "Pending Approval", value: isLoading ? "—" : reviewStats.pending, icon: "⏳", color: "bg-yellow-50 text-yellow-700" },
          { label: "Approved", value: isLoading ? "—" : reviewStats.approved, icon: "✅", color: "bg-green-50 text-green-600" },
          { label: "Avg Rating", value: isLoading ? "—" : reviewStats.avgRating, icon: "📊", color: "bg-orange-50 text-brand-orange" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">Product Reviews</h2>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-semibold text-brand-green hover:text-brand-orange"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeFilter === filter.value
                ? "bg-brand-orange text-white"
                : "border border-brand-border bg-white text-gray-600 hover:border-brand-orange hover:text-brand-orange"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-brand-border bg-white p-8 text-center text-sm text-gray-500">
          Loading reviews...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-brand-border bg-white p-8 text-center text-sm text-red-600">
          Failed to load reviews.
        </div>
      ) : (
        <div className="rounded-2xl border border-brand-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Rating</th>
                  <th className="px-6 py-3">Comment</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr
                      key={review.id}
                      className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                    >
                      <td className="px-6 py-4">
                        {review.productSlug ? (
                          <Link
                            href={`/product/${review.productSlug}`}
                            className="font-medium text-brand-orange hover:underline"
                          >
                            {review.productName}
                          </Link>
                        ) : (
                          <span className="text-gray-700">{review.productName}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{review.authorName}</td>
                      <td className="px-6 py-4 text-yellow-500">{renderStars(review.rating)}</td>
                      <td className="max-w-xs px-6 py-4 text-gray-600">
                        <p className="line-clamp-2">{review.comment}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            review.isApproved
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {review.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(review.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={updatingId === review.id}
                            onClick={() => void handleToggleStatus(review.id, review.isApproved)}
                            className="rounded-lg border border-brand-border px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-brand-orange hover:text-brand-orange disabled:opacity-60"
                          >
                            {review.isApproved ? "Reject" : "Approve"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(review.id, review.authorName)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
