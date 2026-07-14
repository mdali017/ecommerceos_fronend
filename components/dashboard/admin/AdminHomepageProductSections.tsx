"use client";

import { useState } from "react";
import {
  useDeleteHomepageProductSectionMutation,
  useListHomepageProductSectionsQuery,
  type HomepageProductSection,
} from "@/app/redux/services/homepageProductSectionApi";
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
import { HomepageProductSectionFormModal } from "./forms/HomepageProductSectionFormModal";
import { HomepageProductSectionProductsModal } from "./forms/HomepageProductSectionProductsModal";
import Swal from "sweetalert2";

const layoutLabels = {
  grid: "Best Sell Grid",
  carousel: "Category Carousel",
  flash_sale: "Flash Sale",
} as const;

const sourceLabels = {
  category: "Category",
  featured: "Featured",
  on_sale: "On Sale",
  manual: "Manual SKUs",
} as const;

export function AdminHomepageProductSections() {
  const accessToken = useAppSelector((state) => state.admin.accessToken);
  const {
    data: sections = [],
    isLoading,
    isError,
    refetch,
  } = useListHomepageProductSectionsQuery(undefined, {
    skip: !accessToken,
  });
  const [deleteSection] = useDeleteHomepageProductSectionMutation();
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [editing, setEditing] = useState<HomepageProductSection | null>(null);
  const [managingProducts, setManagingProducts] = useState<HomepageProductSection | null>(null);

  const {
    page,
    setPage,
    pageItems,
    total,
    totalPages,
    showingFrom,
    showingTo,
    serialOf,
  } = useAdminPagination(sections);

  const handleDelete = async (section: HomepageProductSection) => {
    const result = await Swal.fire({
      title: "Delete this section?",
      text: section.titleBn,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f58220",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSection(section.id).unwrap();
      await Swal.fire({
        icon: "success",
        title: "Section deleted",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        confirmButtonColor: "#f58220",
      });
    }
  };

  return (
    <div className="space-y-6">
      <AdminHomepageSectionHeader
        title="Product Sections"
        description="Homepage product rows: category, best sell, flash sale"
        addLabel="+ Add Section"
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
          <div className="px-6 py-12 text-center text-sm text-muted">Loading sections...</div>
        ) : isError ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">
            Sections load করতে সমস্যা হয়েছে। `012_homepage_product_sections.sql` run করুন।
          </div>
        ) : sections.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted">
            কোনো section নেই। Add Section দিয়ে নতুন যোগ করুন।
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Layout</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                >
                  <td className="px-6 py-4 text-muted">{serialOf(index)}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">{item.titleBn}</p>
                    <p className="text-xs text-muted">{item.titleEn || "—"}</p>
                  </td>
                  <td className="px-6 py-4">{layoutLabels[item.sectionType]}</td>
                  <td className="px-6 py-4">{sourceLabels[item.productSource]}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted">
                    {item.categorySlug || "—"}
                  </td>
                  <td className="px-6 py-4">{item.sortOrder}</td>
                  <td className="px-6 py-4">
                    <AdminStatusBadge isActive={item.isActive} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setManagingProducts(item);
                          setProductsOpen(true);
                        }}
                        className="rounded-lg bg-brand-orange/10 px-3 py-1.5 text-sm font-semibold text-brand-orange transition-colors hover:bg-brand-orange hover:text-white"
                      >
                        Products
                      </button>
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
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="text-sm font-semibold text-red-500 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminTableShell>

      <HomepageProductSectionFormModal
        open={open}
        initial={editing}
        onClose={() => setOpen(false)}
        onSuccess={() => refetch()}
      />

      <HomepageProductSectionProductsModal
        open={productsOpen}
        section={managingProducts}
        onClose={() => {
          setProductsOpen(false);
          setManagingProducts(null);
        }}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
