"use client";

import { useState } from "react";
import {
  useListAllCategoriesQuery,
  type Category,
} from "@/app/redux/services/categoryApi";
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
import { CategoryFormModal } from "./forms/CategoryFormModal";
import { AdminCategoryIconCell } from "./AdminCategoryIconCell";

export function AdminHomepageCategories() {
  const accessToken = useAppSelector((state) => state.admin.accessToken);
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useListAllCategoriesQuery(undefined, {
    skip: !accessToken,
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const {
    page,
    setPage,
    pageItems,
    total,
    totalPages,
    showingFrom,
    showingTo,
    serialOf,
  } = useAdminPagination(categories);

  return (
    <div className="space-y-6">
      <AdminHomepageSectionHeader
        title="Nav Categories"
        description="Categories shown in top navbar and homepage icon row"
        addLabel="+ Add Category"
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
          <div className="px-6 py-12 text-center text-sm text-muted">Loading categories...</div>
        ) : isError ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">
            Categories load করতে সমস্যা হয়েছে।
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted">
            কোনো category নেই। Add Category দিয়ে নতুন যোগ করুন।
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Icon</th>
                <th className="px-6 py-3">Name (BN)</th>
                <th className="px-6 py-3">Name (EN)</th>
                <th className="px-6 py-3">Slug</th>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((category, index) => (
                <tr
                  key={category.id}
                  className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                >
                  <td className="px-6 py-4 text-muted">{serialOf(index)}</td>
                  <td className="px-6 py-4">
                    <AdminCategoryIconCell icon={category.icon} />
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">{category.nameBn}</td>
                  <td className="px-6 py-4 text-muted">{category.name}</td>
                  <td className="px-6 py-4">
                    <code className="rounded bg-brand-gray px-2 py-1 text-xs text-muted">
                      {category.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-muted">{category.sortOrder}</td>
                  <td className="px-6 py-4">
                    <AdminStatusBadge isActive={category.isActive} />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(category);
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

      <CategoryFormModal
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
