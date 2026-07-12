"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  useUpdateHomepageProductSectionMutation,
  type HomepageProductSection,
} from "@/app/redux/services/homepageProductSectionApi";
import { listProducts, type Product } from "@/lib/api/products";
import { useAdminToken } from "@/lib/hooks/useAdminToken";
import { AdminFormModal, FormActions, formInputClass } from "../AdminFormModal";
import Swal from "sweetalert2";

function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-US")}`;
}

function getDisplayPrice(product: Product) {
  const hasOffer =
    product.offerPrice > 0 && product.offerPrice < product.sellingPrice;
  return hasOffer ? product.offerPrice : product.sellingPrice;
}

function parseSkuList(value: string) {
  return value
    .split(",")
    .map((sku) => sku.trim())
    .filter(Boolean);
}

export function HomepageProductSectionProductsModal({
  open,
  section,
  onClose,
  onSuccess,
}: {
  open: boolean;
  section: HomepageProductSection | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { getValidAccessToken } = useAdminToken();
  const [updateSection] = useUpdateHomepageProductSectionMutation();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    const token = await getValidAccessToken();
    if (!token) return;

    setLoadingProducts(true);
    try {
      const products = await listProducts(token);
      setAllProducts(products);
    } catch {
      setAllProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [getValidAccessToken]);

  useEffect(() => {
    if (!open || !section) return;
    setSelectedSkus(parseSkuList(section.productSkus));
    setSearch("");
    void loadProducts();
  }, [open, section, loadProducts]);

  const productsBySku = useMemo(
    () => new Map(allProducts.map((product) => [product.sku, product])),
    [allProducts]
  );

  const assignedProducts = useMemo(
    () =>
      selectedSkus.map((sku) => ({
        sku,
        product: productsBySku.get(sku) ?? null,
      })),
    [selectedSkus, productsBySku]
  );

  const availableProducts = useMemo(() => {
    const selected = new Set(selectedSkus);
    const query = search.trim().toLowerCase();

    return allProducts
      .filter((product) => !selected.has(product.sku))
      .filter((product) => {
        if (!query) return true;
        return (
          product.productName.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.genericName.toLowerCase().includes(query)
        );
      })
      .slice(0, 8);
  }, [allProducts, selectedSkus, search]);

  const maxReached = section ? selectedSkus.length >= section.maxProducts : false;

  const handleAddProduct = (product: Product) => {
    if (!section || maxReached) return;
    setSelectedSkus((prev) => [...prev, product.sku]);
    setSearch("");
  };

  const handleRemoveProduct = (sku: string) => {
    setSelectedSkus((prev) => prev.filter((item) => item !== sku));
  };

  const handleSave = async () => {
    if (!section) return;

    setSaving(true);
    try {
      await updateSection({
        id: section.id,
        body: {
          productSkus: selectedSkus.join(","),
          productSource: "manual",
        },
      }).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Section products updated",
        timer: 1600,
        showConfirmButton: false,
      });

      onSuccess();
      onClose();
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Could not save products",
        confirmButtonColor: "#f58220",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!section) return null;

  return (
    <AdminFormModal
      open={open}
      size="xl"
      title={`Manage Products — ${section.titleBn}`}
      onClose={onClose}
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-brand-border bg-brand-cream/60 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Add product to this section</p>
              <p className="mt-1 text-xs text-gray-500">
                {selectedSkus.length} / {section.maxProducts} products selected
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-orange">
              Manual list will be used on homepage
            </span>
          </div>

          <div className="mt-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, SKU, or category..."
              className={formInputClass}
              disabled={maxReached}
            />
          </div>

          {maxReached ? (
            <p className="mt-3 text-sm text-amber-700">
              Maximum {section.maxProducts} products reached. Remove one to add another.
            </p>
          ) : loadingProducts ? (
            <p className="mt-3 text-sm text-gray-500">Loading products...</p>
          ) : availableProducts.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">No matching products to add.</p>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {availableProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleAddProduct(product)}
                  className="flex items-center gap-3 rounded-xl border border-brand-border bg-white p-3 text-left transition-colors hover:border-brand-orange hover:bg-orange-50/40"
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-brand-gray">
                    {(product.imageUrl || product.images[0]) && (
                      <Image
                        src={product.imageUrl || product.images[0]}
                        alt={product.productName}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {product.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.sku} · {formatPrice(getDisplayPrice(product))}
                    </p>
                  </div>
                  <span className="rounded-lg bg-brand-orange px-2.5 py-1 text-xs font-bold text-white">
                    Add
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-brand-border bg-white">
          <div className="border-b border-brand-border bg-brand-gray/40 px-4 py-3 sm:px-5">
            <h4 className="text-sm font-bold text-gray-900">Section Products</h4>
          </div>

          {assignedProducts.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-500">
              এই section-এ এখনো কোনো product নেই। উপরে search করে add করুন।
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-brand-border bg-brand-gray/30 text-left text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3 sm:px-5">Product</th>
                    <th className="px-4 py-3 sm:px-5">SKU</th>
                    <th className="px-4 py-3 sm:px-5">Category</th>
                    <th className="px-4 py-3 sm:px-5">Price</th>
                    <th className="px-4 py-3 sm:px-5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedProducts.map(({ sku, product }, index) => (
                    <tr
                      key={sku}
                      className="border-b border-brand-border last:border-0 hover:bg-brand-gray/20"
                    >
                      <td className="px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-cream text-xs font-bold text-brand-orange">
                            {index + 1}
                          </span>
                          {product ? (
                            <>
                              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-brand-border bg-brand-gray">
                                {(product.imageUrl || product.images[0]) && (
                                  <Image
                                    src={product.imageUrl || product.images[0]}
                                    alt={product.productName}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {product.productName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {product.genericName || product.packSize || "—"}
                                </p>
                              </div>
                            </>
                          ) : (
                            <div>
                              <p className="font-semibold text-red-600">Product not found</p>
                              <p className="text-xs text-gray-500">SKU may be outdated</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600 sm:px-5">{sku}</td>
                      <td className="px-4 py-3 text-gray-600 sm:px-5">
                        {product?.category || "—"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-brand-orange sm:px-5">
                        {product ? formatPrice(getDisplayPrice(product)) : "—"}
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(sku)}
                          className="rounded-lg border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
        >
          <FormActions
            onCancel={onClose}
            submitLabel={saving ? "Saving..." : "Save Products"}
          />
        </form>
      </div>
    </AdminFormModal>
  );
}
