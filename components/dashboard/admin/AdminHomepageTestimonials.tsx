"use client";

import { useState } from "react";
import {
  useListAllTestimonialsQuery,
  type Testimonial,
} from "@/app/redux/services/testimonialApi";
import { useAppSelector } from "@/app/redux/hooks";
import {
  AdminHomepageSectionHeader,
  AdminStatusBadge,
  AdminTableShell,
} from "./AdminHomepageSectionHeader";
import { TestimonialFormModal } from "./forms/TestimonialFormModal";

export function AdminHomepageTestimonials() {
  const accessToken = useAppSelector((state) => state.admin.accessToken);
  const {
    data: testimonials = [],
    isLoading,
    isError,
    refetch,
  } = useListAllTestimonialsQuery(undefined, {
    skip: !accessToken,
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  return (
    <div className="space-y-6">
      <AdminHomepageSectionHeader
        title="Testimonials"
        description="Customer reviews shown on homepage"
        addLabel="+ Add Review"
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
      />

      <AdminTableShell>
        {isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">Loading testimonials...</div>
        ) : isError ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">
            Testimonials load করতে সমস্যা হয়েছে।
          </div>
        ) : testimonials.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            কোনো review নেই। Add Review দিয়ে নতুন যোগ করুন।
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Review (BN)</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                        {item.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.nameBn}</p>
                        <p className="text-xs text-gray-500">{item.nameEn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-md px-6 py-4 text-gray-600">
                    <p className="line-clamp-2">&ldquo;{item.reviewBn}&rdquo;</p>
                  </td>
                  <td className="px-6 py-4 text-yellow-500">
                    {"★".repeat(item.rating)}
                    {"☆".repeat(5 - item.rating)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.sortOrder}</td>
                  <td className="px-6 py-4">
                    <AdminStatusBadge isActive={item.isActive} />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(item);
                        setOpen(true);
                      }}
                      className="text-sm font-semibold text-brand-green hover:text-brand-orange"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminTableShell>

      <TestimonialFormModal
        open={open}
        initial={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSuccess={() => void refetch()}
      />
    </div>
  );
}
