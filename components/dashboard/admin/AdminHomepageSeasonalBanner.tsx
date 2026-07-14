"use client";

import Image from "next/image";
import { useState } from "react";
import {
  useListAllSeasonalBannersQuery,
  type SeasonalBanner,
} from "@/app/redux/services/seasonalBannerApi";
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
import { SeasonalBannerFormModal } from "./forms/SeasonalBannerFormModal";

export function AdminHomepageSeasonalBanner() {
  const accessToken = useAppSelector((state) => state.admin.accessToken);
  const {
    data: banners = [],
    isLoading,
    isError,
    refetch,
  } = useListAllSeasonalBannersQuery(undefined, {
    skip: !accessToken,
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SeasonalBanner | null>(null);

  const {
    page,
    setPage,
    pageItems,
    total,
    totalPages,
    showingFrom,
    showingTo,
  } = useAdminPagination(banners);

  return (
    <div className="space-y-6">
      <AdminHomepageSectionHeader
        title="Seasonal Banner"
        description="Side banner displayed next to the hero slider"
        addLabel="+ Add Banner"
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
          <div className="px-6 py-12 text-center text-sm text-muted">Loading banners...</div>
        ) : isError ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">
            Seasonal banners load করতে সমস্যা হয়েছে।
          </div>
        ) : banners.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted">
            কোনো banner নেই। Add Banner দিয়ে নতুন যোগ করুন।
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3">Preview</th>
                <th className="px-6 py-3">Title (BN)</th>
                <th className="px-6 py-3">Title (EN)</th>
                <th className="px-6 py-3">CTA</th>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((banner) => (
                <tr
                  key={banner.id}
                  className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                >
                  <td className="px-6 py-4">
                    <div className="relative h-16 w-14 overflow-hidden rounded-lg bg-brand-gray">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.titleBn}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  </td>
                  <td className="max-w-xs px-6 py-4 font-semibold text-foreground">
                    <p className="line-clamp-2">{banner.titleBn}</p>
                  </td>
                  <td className="max-w-xs px-6 py-4 text-muted">
                    <p className="line-clamp-2">{banner.titleEn}</p>
                  </td>
                  <td className="px-6 py-4 text-muted">{banner.ctaBn}</td>
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

      <SeasonalBannerFormModal
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
