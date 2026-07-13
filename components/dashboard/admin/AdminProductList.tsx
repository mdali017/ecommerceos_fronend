"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminToken } from "@/lib/hooks/useAdminToken";
import { listProducts, type Product } from "@/lib/api/products";
import { ProductBulkUploadButton } from "@/components/dashboard/admin/ProductBulkUpload";
import { ProductFormModal } from "@/components/dashboard/admin/forms/ProductFormModal";
import { AdminStatGrid } from "@/components/dashboard/admin/AdminStatCard";
import { downloadProductBulkTemplate } from "@/lib/product-bulk-upload";
import { deleteProduct } from "@/lib/api/products";
import Swal from "sweetalert2";

const statusLabels: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-green-100 text-green-700" },
  low_stock: { label: "Low Stock", className: "bg-orange-100 text-brand-orange" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-100 text-red-600" },
  draft: { label: "Draft", className: "bg-gray-100 text-gray-600" },
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

  const openCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
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
      await fetchProducts();
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
      <AdminStatGrid
        stats={[
          { label: "Total Products", value: loading ? "—" : productStats.total, icon: "🛍️", color: "bg-purple-50 text-purple-600" },
          { label: "Active", value: loading ? "—" : productStats.active, icon: "✅", color: "bg-green-50 text-green-600" },
          { label: "Low Stock", value: loading ? "—" : productStats.lowStock, icon: "⚠️", color: "bg-orange-50 text-brand-orange" },
          { label: "Out of Stock", value: loading ? "—" : productStats.outOfStock, icon: "📭", color: "bg-red-50 text-red-600" },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">Product Management</h2>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={downloadProductBulkTemplate}
            className="rounded-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-brand-green hover:text-brand-green"
          >
            Download Template
          </button>
          <ProductBulkUploadButton onSuccess={fetchProducts} />
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

      <div className="rounded-2xl border border-brand-border bg-white shadow-sm">
        {loading ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">Loading products...</div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-sm text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            কোনো প্রোডাক্ট নেই। Bulk Upload দিয়ে প্রোডাক্ট যোগ করুন।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-gray/50 text-left text-xs uppercase tracking-wider text-gray-500">
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
                {products.map((product) => {
                  const status = statusLabels[product.status] ?? statusLabels.active;
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-brand-border last:border-0 hover:bg-brand-gray/30"
                    >
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
                          <span className="font-semibold text-gray-900">{product.productName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">{product.sku}</td>
                      <td className="px-6 py-4 text-gray-600">{product.category || "—"}</td>
                      <td className="px-6 py-4 font-semibold text-brand-orange">
                        {formatPrice(product.sellingPrice || product.offerPrice)}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{product.stockQty}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
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
        )}
      </div>
    </div>
  );
}
