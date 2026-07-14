"use client";

import Image from "next/image";
import { useState } from "react";
import {
  useListAllPromoBannersQuery,
  type PromoBanner,
} from "@/app/redux/services/promoBannerApi";
import { useAppSelector } from "@/app/redux/hooks";
import {
  AdminPagination,
  useAdminPagination,
} from "@/components/dashboard/admin/AdminPagination";
import {
  AdminHomepageSectionHeader,
  AdminStatusBadge,
  AdminTableShell,
} from "./AdminHomepageSectionHeader";
import { PromoBannerFormModal } from "./forms/PromoBannerFormModal";

export function AdminHomepagePromoBanner() {
  const accessToken = useAppSelector((state) => state.admin.accessToken);
  const {
    data: banners = [],
    isLoading,
    isError,
    refetch,
  } = useListAllPromoBannersQuery(undefined, {
    skip: !accessToken,
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PromoBanner | null>(null);

  const {
    page,
    setPage,
    pageItems,
    total,
    totalPages,
    showingFrom,
    showingTo,
    serialOf,
  } = useAdminPagination(banners);

  return (
    <div className="space-y-6">
      <AdminHomepageSectionHeader
        title="Promo Banner"
        description="Mid-page promotional banner on homepage"
        addLabel="+ Add Promo"
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
      />

      <AdminTableShell
        footer={
          <AdminPagination
            page={page}
            totalPages={totalPages}
            total={total}
            showingFrom={showingFrom}
            showingTo={showingTo}
            onPageChange={setPage}
          />
        }
      >
        {isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-muted">Loading promo banners...</div>
        ) : isError ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">
            Promo banners load করতে সমস্যা হয়েছে।
          </div>
        ) : banners.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted">
            কোনো promo banner নেই। Add Promo দিয়ে নতুন যোগ করুন।
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Preview</th>
                <th className="px-6 py-3">Title (BN)</th>
                <th className="px-6 py-3">Subtitle (BN)</th>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((banner, index) => (
                <tr
                  key={banner.id}
                  className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                >
                  <td className="px-6 py-4 text-muted">{serialOf(index)}</td>
                  <td className="px-6 py-4">
                    <div className="relative h-12 w-28 overflow-hidden rounded-lg bg-brand-gray">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.titleBn}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">{banner.titleBn}</td>
                  <td className="max-w-xs px-6 py-4 text-muted">
                    <p className="line-clamp-2">{banner.subtitleBn}</p>
                  </td>
                  <td className="px-6 py-4 text-muted">{banner.sortOrder}</td>
                  <td className="px-6 py-4">
                    <AdminStatusBadge isActive={banner.isActive} />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(banner);
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

      <PromoBannerFormModal
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
