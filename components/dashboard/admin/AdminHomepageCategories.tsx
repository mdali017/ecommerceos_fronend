"use client";

import { useState } from "react";
import {
  useListAllCategoriesQuery,
  type Category,
} from "@/app/redux/services/categoryApi";
import { useAppSelector } from "@/app/redux/hooks";
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

      <AdminTableShell>
        {isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">Loading categories...</div>
        ) : isError ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">
            Categories load করতে সমস্যা হয়েছে।
          </div>
        ) : categories.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            কোনো category নেই। Add Category দিয়ে নতুন যোগ করুন।
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-gray-500">
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
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                >
                  <td className="px-6 py-4">
                    <AdminCategoryIconCell icon={category.icon} />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{category.nameBn}</td>
                  <td className="px-6 py-4 text-gray-600">{category.name}</td>
                  <td className="px-6 py-4">
                    <code className="rounded bg-brand-gray px-2 py-1 text-xs text-gray-600">
                      {category.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{category.sortOrder}</td>
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
