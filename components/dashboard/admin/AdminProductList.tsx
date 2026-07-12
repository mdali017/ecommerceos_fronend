"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminToken } from "@/lib/hooks/useAdminToken";
import { listProducts, type Product } from "@/lib/api/products";
import { ProductBulkUploadButton } from "@/components/dashboard/admin/ProductBulkUpload";

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">Product Management</h2>
        <div className="flex flex-wrap items-center gap-3">
          <ProductBulkUploadButton onSuccess={fetchProducts} />
          <button
            type="button"
            className="rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-orange-dark"
          >
            + Add Product
          </button>
        </div>
      </div>

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
                        <button
                          type="button"
                          className="text-sm font-semibold text-brand-green hover:text-brand-orange"
                        >
                          Edit
                        </button>
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
