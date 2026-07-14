"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminToken } from "@/lib/hooks/useAdminToken";
import { listProducts, type Product } from "@/lib/api/products";
import { ProductBulkUploadButton } from "@/components/dashboard/admin/ProductBulkUpload";
import { ConnectSheetButton } from "@/components/dashboard/admin/ConnectSheetButton";
import { ProductFormModal } from "@/components/dashboard/admin/forms/ProductFormModal";
import { ProductViewModal } from "@/components/dashboard/admin/ProductViewModal";
import { AdminStatGrid } from "@/components/dashboard/admin/AdminStatCard";
import {
  AdminPagination,
  useAdminPagination,
} from "@/components/dashboard/admin/AdminPagination";
import { downloadProductBulkTemplate } from "@/lib/product-bulk-upload";
import { deleteProduct } from "@/lib/api/products";
import Swal from "sweetalert2";

const statusLabels: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" },
  low_stock: { label: "Low Stock", className: "bg-orange-100 text-brand-orange dark:bg-orange-950/40" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400" },
  draft: { label: "Draft", className: "bg-brand-gray text-muted" },
};

function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-US")}`;
}

export function AdminProductList() {
  const { getValidAccessToken } = useAdminToken();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await listProducts(accessToken);
      setProducts(data);
    } catch {
      setError("প্রোডাক্ট লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, [getValidAccessToken]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const productStats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === "active").length;
    const lowStock = products.filter((p) => p.status === "low_stock").length;
    const outOfStock = products.filter((p) => p.status === "out_of_stock").length;
    return { total, active, lowStock, outOfStock };
  }, [products]);

  const {
    page,
    setPage,
    pageItems,
    total,
    totalPages,
    showingFrom,
    showingTo,
    serialOf,
  } = useAdminPagination(products);

  const openCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const openView = (product: Product) => {
    setViewingProduct(product);
    setViewOpen(true);
  };

  const handleEditFromView = (product: Product) => {
    setViewOpen(false);
    setViewingProduct(null);
    openEdit(product);
  };

  const handleDelete = async (product: Product) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete product?",
      text: `${product.productName} (${product.sku})`,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    const accessToken = await getValidAccessToken();
    if (!accessToken) return;

    try {
      await deleteProduct(product.id, accessToken);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
      await fetchProducts();
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        confirmButtonColor: "#f58220",
      });
    }
  };

  const handleToggleBulkDeleteMode = () => {
    if (selectionMode) {
      setSelectionMode(false);
      setSelectedIds(new Set());
      return;
    }
    setSelectionMode(true);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pageAllSelected =
    pageItems.length > 0 && pageItems.every((product) => selectedIds.has(product.id));
  const pageSomeSelected =
    pageItems.some((product) => selectedIds.has(product.id)) && !pageAllSelected;

  const handleToggleSelectPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (pageAllSelected) {
        pageItems.forEach((product) => next.delete(product.id));
      } else {
        pageItems.forEach((product) => next.add(product.id));
      }
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete selected products?",
      text: `${selectedIds.size}টি প্রোডাক্ট মুছে যাবে। এটা undo করা যাবে না।`,
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Delete (${selectedIds.size})`,
    });

    if (!result.isConfirmed) return;

    const accessToken = await getValidAccessToken();
    if (!accessToken) return;

    setBulkDeleting(true);

    try {
      const ids = [...selectedIds];
      const results = await Promise.allSettled(
        ids.map((id) => deleteProduct(id, accessToken))
      );
      const failed = results.filter((item) => item.status === "rejected").length;
      const deleted = ids.length - failed;

      await fetchProducts();
      setSelectedIds(new Set());
      setSelectionMode(false);

      if (failed > 0) {
        await Swal.fire({
          icon: "warning",
          title: "আংশিক সম্পন্ন",
          text: `${deleted}টি ডিলিট হয়েছে, ${failed}টি ব্যর্থ।`,
          confirmButtonColor: "#f58220",
        });
      } else {
        await Swal.fire({
          icon: "success",
          title: "Bulk delete সম্পন্ন",
          text: `${deleted}টি প্রোডাক্ট মুছে ফেলা হয়েছে।`,
          confirmButtonColor: "#f58220",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Bulk delete failed",
        confirmButtonColor: "#f58220",
      });
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminStatGrid
        stats={[
          { label: "Total Products", value: loading ? "—" : productStats.total, icon: "🛍️", color: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400" },
          { label: "Active", value: loading ? "—" : productStats.active, icon: "✅", color: "bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400" },
          { label: "Low Stock", value: loading ? "—" : productStats.lowStock, icon: "⚠️", color: "bg-orange-50 text-brand-orange dark:bg-orange-950/40" },
          { label: "Out of Stock", value: loading ? "—" : productStats.outOfStock, icon: "📭", color: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-foreground">Product Management</h2>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={downloadProductBulkTemplate}
            className="rounded-xl border border-brand-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-brand-green hover:text-brand-green dark:hover:border-emerald-400 dark:hover:text-emerald-400"
          >
            Download Template
          </button>
          <ProductBulkUploadButton onSuccess={fetchProducts} />
          <ConnectSheetButton products={products} />
          {selectionMode && selectedIds.size > 0 && (
            <button
              type="button"
              onClick={() => void handleBulkDelete()}
              disabled={bulkDeleting}
              className="rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              {bulkDeleting ? "Deleting..." : `Delete selected (${selectedIds.size})`}
            </button>
          )}
          <button
            type="button"
            onClick={handleToggleBulkDeleteMode}
            disabled={bulkDeleting || products.length === 0}
            className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
              selectionMode
                ? "border-brand-border bg-brand-gray text-foreground"
                : "border-red-200 bg-card text-red-500 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
            }`}
          >
            {selectionMode ? "Cancel select" : "Bulk Delete"}
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-orange-dark"
          >
            + Add Product
          </button>
        </div>
      </div>

      <ProductFormModal
        open={formOpen}
        initial={editingProduct}
        onClose={() => setFormOpen(false)}
        onSuccess={fetchProducts}
      />

      <ProductViewModal
        open={viewOpen}
        product={viewingProduct}
        onClose={() => {
          setViewOpen(false);
          setViewingProduct(null);
        }}
        onEdit={handleEditFromView}
      />

      <div className="rounded-2xl border border-brand-border bg-card shadow-sm">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-muted">Loading products...</div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-muted">
            কোনো প্রোডাক্ট নেই। Bulk Upload দিয়ে প্রোডাক্ট যোগ করুন।
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-muted">
                    {selectionMode && (
                      <th className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={pageAllSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = pageSomeSelected;
                          }}
                          onChange={handleToggleSelectPage}
                          aria-label="Select all on this page"
                          className="h-4 w-4 cursor-pointer accent-brand-orange"
                        />
                      </th>
                    )}
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">SKU</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((product, index) => {
                    const status = statusLabels[product.status] ?? statusLabels.active;
                    const isSelected = selectedIds.has(product.id);
                    return (
                      <tr
                        key={product.id}
                        className={`border-b border-brand-border last:border-0 hover:bg-brand-gray/30 ${
                          isSelected ? "bg-orange-50/40 dark:bg-orange-950/20" : ""
                        }`}
                      >
                        {selectionMode && (
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(product.id)}
                              aria-label={`Select ${product.productName}`}
                              className="h-4 w-4 cursor-pointer accent-brand-orange"
                            />
                          </td>
                        )}
                        <td className="px-6 py-4 text-muted">{serialOf(index)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {(product.imageUrl || product.images[0]) && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.imageUrl || product.images[0]}
                                alt=""
                                className="h-10 w-10 rounded-lg border border-brand-border object-cover"
                              />
                            )}
                            <span className="font-semibold text-foreground">{product.productName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-muted">{product.sku}</td>
                        <td className="px-6 py-4 text-muted">{product.category || "—"}</td>
                        <td className="px-6 py-4 font-semibold text-brand-orange">
                          {formatPrice(product.sellingPrice || product.offerPrice)}
                        </td>
                        <td className="px-6 py-4 text-foreground">{product.stockQty}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => openView(product)}
                              className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => openEdit(product)}
                              className="text-sm font-semibold text-brand-green hover:text-brand-orange"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(product)}
                              className="text-sm font-semibold text-red-600 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <AdminPagination
              page={page}
              totalPages={totalPages}
              total={total}
              showingFrom={showingFrom}
              showingTo={showingTo}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
