"use client";

import { useState } from "react";
import {
  useListAllHomepageBrandsQuery,
  type HomepageBrand,
} from "@/app/redux/services/homepageBrandApi";
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
import { BrandFormModal } from "./forms/BrandFormModal";

export function AdminHomepageBrands() {
  const accessToken = useAppSelector((state) => state.admin.accessToken);
  const {
    data: brands = [],
    isLoading,
    isError,
    refetch,
  } = useListAllHomepageBrandsQuery(undefined, {
    skip: !accessToken,
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HomepageBrand | null>(null);

  const {
    page,
    setPage,
    pageItems,
    total,
    totalPages,
    showingFrom,
    showingTo,
    serialOf,
  } = useAdminPagination(brands);

  return (
    <div className="space-y-6">
      <AdminHomepageSectionHeader
        title="Brand Strip"
        description="Brand logos shown in the homepage brand section"
        addLabel="+ Add Brand"
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
          <div className="px-6 py-12 text-center text-sm text-muted">Loading brands...</div>
        ) : isError ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">
            Brands load করতে সমস্যা হয়েছে।
          </div>
        ) : brands.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted">
            কোনো brand নেই। Add Brand দিয়ে নতুন যোগ করুন।
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Brand Name</th>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((brand, index) => (
                <tr
                  key={brand.id}
                  className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                >
                  <td className="px-6 py-4 text-muted">{serialOf(index)}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{brand.name}</td>
                  <td className="px-6 py-4 text-muted">{brand.sortOrder}</td>
                  <td className="px-6 py-4">
                    <AdminStatusBadge isActive={brand.isActive} />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(brand);
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

      <BrandFormModal
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
