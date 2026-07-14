"use client";

import { useMemo } from "react";
import type { Product } from "@/lib/api/products";
import { AdminFormModal } from "@/components/dashboard/admin/AdminFormModal";

const statusLabels: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" },
  low_stock: { label: "Low Stock", className: "bg-orange-100 text-brand-orange dark:bg-orange-950/40" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400" },
  draft: { label: "Draft", className: "bg-brand-gray text-muted" },
};

function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-US")}`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-foreground">{value || "—"}</dd>
    </div>
  );
}

export function ProductViewModal({
  open,
  product,
  onClose,
  onEdit,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onEdit?: (product: Product) => void;
}) {
  const images = useMemo(() => {
    if (!product) return [] as string[];
    const urls = [
      ...(product.imageUrl ? [product.imageUrl] : []),
      ...(product.images ?? []),
    ].filter(Boolean);
    return [...new Set(urls)];
  }, [product]);

  if (!product) return null;

  const status = statusLabels[product.status] ?? statusLabels.active;

  return (
    <AdminFormModal open={open} title="Product Details" onClose={onClose} size="lg">
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="text-xl font-bold text-foreground">{product.productName}</h4>
            <p className="mt-1 font-mono text-xs text-muted">{product.sku}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
            {status.label}
          </span>
        </div>

        <section>
          <h5 className="mb-3 text-sm font-bold text-foreground">
            Images {images.length > 0 ? `(${images.length})` : ""}
          </h5>
          {images.length === 0 ? (
            <div className="rounded-xl border border-dashed border-brand-border bg-brand-gray/30 px-4 py-10 text-center text-sm text-muted">
              No images uploaded for this product.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {images.map((url, index) => (
                <a
                  key={`${url}-${index}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-xl border border-brand-border bg-brand-gray"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${product.productName} ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {index + 1}
                  </span>
                </a>
              ))}
            </div>
          )}
        </section>

        <section>
          <h5 className="mb-3 text-sm font-bold text-foreground">Basic Info</h5>
          <dl className="grid grid-cols-1 gap-4 rounded-xl border border-brand-border bg-brand-gray/20 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Generic Name" value={product.genericName} />
            <DetailItem label="Brand" value={product.brand} />
            <DetailItem label="Category" value={product.category} />
            <DetailItem label="Subcategory" value={product.subcategory} />
            <DetailItem label="Barcode" value={product.barcode} />
            <DetailItem label="Slug" value={product.slug} />
            <DetailItem label="Unit" value={product.unit} />
            <DetailItem label="Pack Size" value={product.packSize} />
            <DetailItem label="Featured" value={product.featured ? "Yes" : "No"} />
          </dl>
        </section>

        <section>
          <h5 className="mb-3 text-sm font-bold text-foreground">Pricing & Stock</h5>
          <dl className="grid grid-cols-1 gap-4 rounded-xl border border-brand-border bg-brand-gray/20 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Purchase Price" value={formatPrice(product.purchasePrice)} />
            <DetailItem label="Cost Price" value={formatPrice(product.costPrice)} />
            <DetailItem label="Selling Price" value={formatPrice(product.sellingPrice)} />
            <DetailItem label="Offer Price" value={formatPrice(product.offerPrice)} />
            <DetailItem label="Tax %" value={product.taxPercent} />
            <DetailItem label="Discount %" value={product.discountPercent} />
            <DetailItem label="Stock Qty" value={product.stockQty} />
            <DetailItem label="Min Stock" value={product.minStock} />
            <DetailItem label="Max Stock" value={product.maxStock} />
          </dl>
        </section>

        <section>
          <h5 className="mb-3 text-sm font-bold text-foreground">Extra Details</h5>
          <dl className="grid grid-cols-1 gap-4 rounded-xl border border-brand-border bg-brand-gray/20 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Supplier" value={product.supplier} />
            <DetailItem label="Manufacturer" value={product.manufacturer} />
            <DetailItem label="Batch No" value={product.batchNo} />
            <DetailItem label="Manufacture Date" value={formatDate(product.manufactureDate)} />
            <DetailItem label="Expiry Date" value={formatDate(product.expiryDate)} />
            <DetailItem label="Weight" value={product.weight} />
            <DetailItem label="Color" value={product.color} />
            <DetailItem label="Size" value={product.size} />
            <DetailItem label="Variant" value={product.variant} />
            <DetailItem label="Tags" value={product.tags} />
            <DetailItem label="Created" value={formatDate(product.createdAt)} />
            <DetailItem label="Updated" value={formatDate(product.updatedAt)} />
          </dl>
        </section>

        {(product.description || product.notes) && (
          <section className="space-y-4">
            {product.description && (
              <div>
                <h5 className="mb-2 text-sm font-bold text-foreground">Description</h5>
                <p className="whitespace-pre-wrap rounded-xl border border-brand-border bg-brand-gray/20 p-4 text-sm text-foreground">
                  {product.description}
                </p>
              </div>
            )}
            {product.notes && (
              <div>
                <h5 className="mb-2 text-sm font-bold text-foreground">Notes</h5>
                <p className="whitespace-pre-wrap rounded-xl border border-brand-border bg-brand-gray/20 p-4 text-sm text-foreground">
                  {product.notes}
                </p>
              </div>
            )}
          </section>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-brand-border pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-brand-border px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-brand-gray"
          >
            Close
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
            >
              Edit Product
            </button>
          )}
        </div>
      </div>
    </AdminFormModal>
  );
}
