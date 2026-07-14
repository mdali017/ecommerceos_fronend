"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  createProduct,
  updateProduct,
  uploadProductImages,
  type Product,
  type ProductUpsertInput,
} from "@/lib/api/products";
import { useAdminToken } from "@/lib/hooks/useAdminToken";
import { showAdminValidationError } from "@/lib/admin-swal";
import Swal from "sweetalert2";
import {
  AdminFormModal,
  FormActions,
  FormField,
  formInputClass,
  formTextareaClass,
} from "../AdminFormModal";

const emptyForm: ProductUpsertInput = {
  sku: "",
  productName: "",
  barcode: "",
  genericName: "",
  brand: "Ecommerce OS",
  category: "",
  subcategory: "",
  description: "",
  unit: "",
  packSize: "",
  purchasePrice: "",
  costPrice: "",
  sellingPrice: "",
  offerPrice: "",
  taxPercent: "",
  discountPercent: "",
  stockQty: "",
  minStock: "",
  maxStock: "",
  batchNo: "",
  expiryDate: "",
  manufactureDate: "",
  supplier: "",
  manufacturer: "",
  weight: "",
  color: "",
  size: "",
  variant: "",
  imageUrl: "",
  status: "active",
  featured: "no",
  tags: "",
  notes: "",
};

function productToForm(product: Product): ProductUpsertInput {
  return {
    sku: product.sku,
    productName: product.productName,
    barcode: product.barcode,
    genericName: product.genericName,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory,
    description: product.description,
    unit: product.unit,
    packSize: product.packSize,
    purchasePrice: product.purchasePrice,
    costPrice: product.costPrice,
    sellingPrice: product.sellingPrice,
    offerPrice: product.offerPrice,
    taxPercent: product.taxPercent,
    discountPercent: product.discountPercent,
    stockQty: product.stockQty,
    minStock: product.minStock,
    maxStock: product.maxStock,
    batchNo: product.batchNo,
    expiryDate: product.expiryDate ?? "",
    manufactureDate: product.manufactureDate ?? "",
    supplier: product.supplier,
    manufacturer: product.manufacturer,
    weight: product.weight,
    color: product.color,
    size: product.size,
    variant: product.variant,
    imageUrl: product.imageUrl || product.images[0] || "",
    status: product.status,
    featured: product.featured ? "yes" : "no",
    tags: product.tags,
    notes: product.notes,
  };
}

function getProductImageList(product: Product | null | undefined): string[] {
  if (!product) return [];
  return [...new Set([...(product.imageUrl ? [product.imageUrl] : []), ...(product.images ?? [])].filter(Boolean))];
}

export function ProductFormModal({
  open,
  initial,
  onClose,
  onSuccess,
}: {
  open: boolean;
  initial?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { getValidAccessToken } = useAdminToken();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<ProductUpsertInput>(emptyForm);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(initial ? productToForm(initial) : emptyForm);
    setExistingImages(getProductImageList(initial));
    setNewFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open, initial]);

  const newPreviews = useMemo(
    () => newFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [newFiles]
  );

  useEffect(() => {
    return () => {
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [newPreviews]);

  const update = <K extends keyof ProductUpsertInput>(key: K, value: ProductUpsertInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setNewFiles((prev) => [...prev, ...Array.from(fileList)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.sku.trim() || !form.productName.trim()) {
      await showAdminValidationError("SKU এবং Product Name required।");
      return;
    }

    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      await showAdminValidationError("Session expired. Please login again.");
      return;
    }

    setSubmitting(true);

    try {
      let uploadedUrls: string[] = [];
      if (newFiles.length > 0) {
        const uploadResult = await uploadProductImages(newFiles, accessToken);
        uploadedUrls = uploadResult.urls;
      }

      const imageUrls = [...existingImages, ...uploadedUrls].filter(
        (url, index, arr) => url && arr.indexOf(url) === index
      );

      const payload: ProductUpsertInput = {
        ...form,
        imageUrl: imageUrls[0] || "",
        imageUrls,
      };

      if (isEdit && initial) {
        await updateProduct(initial.id, payload, accessToken);
      } else {
        await createProduct(payload, accessToken);
      }

      await Swal.fire({
        icon: "success",
        title: isEdit ? "Product updated" : "Product created",
        confirmButtonColor: "#f58220",
        timer: 1800,
        showConfirmButton: false,
      });

      onSuccess();
      onClose();
    } catch {
      await showAdminValidationError("Save failed. Check your data and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalImages = existingImages.length + newFiles.length;

  return (
    <AdminFormModal
      open={open}
      title={isEdit ? "Edit Product" : "Add Product"}
      onClose={onClose}
      size="lg"
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-3">
            <FormField label="Product Name *">
              <input
                className={formInputClass}
                value={form.productName}
                onChange={(e) => update("productName", e.target.value)}
              />
            </FormField>
            <FormField label="SKU *">
              <input
                className={formInputClass}
                value={form.sku}
                onChange={(e) => update("sku", e.target.value)}
                disabled={isEdit}
              />
            </FormField>
          </div>
          <div className="w-full sm:w-40">
            <FormField label="Status">
              <select
                className={formInputClass}
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
              >
                <option value="active">Active</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="draft">Draft</option>
              </select>
            </FormField>
          </div>
        </div>

        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h5 className="text-sm font-bold text-foreground">
              Images {totalImages > 0 ? `(${totalImages})` : ""}
            </h5>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-brand-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              + Add Images
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleAddFiles(e.target.files)}
            />
          </div>

          {totalImages === 0 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-brand-border bg-brand-gray/30 px-4 py-10 text-center transition-colors hover:border-brand-orange"
            >
              <span className="text-sm font-semibold text-foreground">Upload product images</span>
              <span className="mt-1 text-xs text-muted">JPG, PNG, WEBP — multiple allowed</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {existingImages.map((url, index) => (
                <div
                  key={`existing-${url}-${index}`}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-brand-border bg-brand-gray"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute right-1.5 top-1.5 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white opacity-100 shadow transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
              {newPreviews.map((preview, index) => (
                <div
                  key={`new-${preview.url}`}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-brand-orange/50 bg-brand-gray"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.url}
                    alt={`New ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 rounded bg-brand-orange px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    New
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    className="absolute right-1.5 top-1.5 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white opacity-100 shadow transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Remove new image"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-brand-border bg-brand-gray/20 text-2xl text-muted transition-colors hover:border-brand-orange hover:text-brand-orange"
                aria-label="Add more images"
              >
                +
              </button>
            </div>
          )}
        </section>

        <section>
          <h5 className="mb-3 text-sm font-bold text-foreground">Basic Info</h5>
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-brand-border bg-brand-gray/20 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Generic Name (BN)">
              <input
                className={formInputClass}
                value={form.genericName}
                onChange={(e) => update("genericName", e.target.value)}
              />
            </FormField>
            <FormField label="Brand">
              <input
                className={formInputClass}
                value={form.brand}
                onChange={(e) => update("brand", e.target.value)}
              />
            </FormField>
            <FormField label="Category">
              <input
                className={formInputClass}
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              />
            </FormField>
            <FormField label="Subcategory (BN)">
              <input
                className={formInputClass}
                value={form.subcategory}
                onChange={(e) => update("subcategory", e.target.value)}
              />
            </FormField>
            <FormField label="Barcode">
              <input
                className={formInputClass}
                value={form.barcode}
                onChange={(e) => update("barcode", e.target.value)}
              />
            </FormField>
            <FormField label="Unit">
              <input
                className={formInputClass}
                value={form.unit}
                onChange={(e) => update("unit", e.target.value)}
              />
            </FormField>
            <FormField label="Pack Size">
              <input
                className={formInputClass}
                value={form.packSize}
                onChange={(e) => update("packSize", e.target.value)}
              />
            </FormField>
            <FormField label="Featured">
              <select
                className={formInputClass}
                value={form.featured}
                onChange={(e) => update("featured", e.target.value)}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </FormField>
            <FormField label="Tags">
              <input
                className={formInputClass}
                value={form.tags}
                onChange={(e) => update("tags", e.target.value)}
                placeholder="honey,bestseller"
              />
            </FormField>
          </div>
        </section>

        <section>
          <h5 className="mb-3 text-sm font-bold text-foreground">Pricing & Stock</h5>
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-brand-border bg-brand-gray/20 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Purchase Price">
              <input
                type="number"
                className={formInputClass}
                value={form.purchasePrice}
                onChange={(e) => update("purchasePrice", e.target.value)}
              />
            </FormField>
            <FormField label="Cost Price">
              <input
                type="number"
                className={formInputClass}
                value={form.costPrice}
                onChange={(e) => update("costPrice", e.target.value)}
              />
            </FormField>
            <FormField label="Selling Price">
              <input
                type="number"
                className={formInputClass}
                value={form.sellingPrice}
                onChange={(e) => update("sellingPrice", e.target.value)}
              />
            </FormField>
            <FormField label="Offer Price">
              <input
                type="number"
                className={formInputClass}
                value={form.offerPrice}
                onChange={(e) => update("offerPrice", e.target.value)}
              />
            </FormField>
            <FormField label="Tax %">
              <input
                type="number"
                className={formInputClass}
                value={form.taxPercent}
                onChange={(e) => update("taxPercent", e.target.value)}
              />
            </FormField>
            <FormField label="Discount %">
              <input
                type="number"
                className={formInputClass}
                value={form.discountPercent}
                onChange={(e) => update("discountPercent", e.target.value)}
              />
            </FormField>
            <FormField label="Stock Qty">
              <input
                type="number"
                className={formInputClass}
                value={form.stockQty}
                onChange={(e) => update("stockQty", e.target.value)}
              />
            </FormField>
            <FormField label="Min Stock">
              <input
                type="number"
                className={formInputClass}
                value={form.minStock}
                onChange={(e) => update("minStock", e.target.value)}
              />
            </FormField>
            <FormField label="Max Stock">
              <input
                type="number"
                className={formInputClass}
                value={form.maxStock}
                onChange={(e) => update("maxStock", e.target.value)}
              />
            </FormField>
          </div>
        </section>

        <section>
          <h5 className="mb-3 text-sm font-bold text-foreground">Extra Details</h5>
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-brand-border bg-brand-gray/20 p-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Supplier">
              <input
                className={formInputClass}
                value={form.supplier}
                onChange={(e) => update("supplier", e.target.value)}
              />
            </FormField>
            <FormField label="Manufacturer">
              <input
                className={formInputClass}
                value={form.manufacturer}
                onChange={(e) => update("manufacturer", e.target.value)}
              />
            </FormField>
            <FormField label="Batch No">
              <input
                className={formInputClass}
                value={form.batchNo}
                onChange={(e) => update("batchNo", e.target.value)}
              />
            </FormField>
            <FormField label="Manufacture Date">
              <input
                type="date"
                className={formInputClass}
                value={String(form.manufactureDate || "").slice(0, 10)}
                onChange={(e) => update("manufactureDate", e.target.value)}
              />
            </FormField>
            <FormField label="Expiry Date">
              <input
                type="date"
                className={formInputClass}
                value={String(form.expiryDate || "").slice(0, 10)}
                onChange={(e) => update("expiryDate", e.target.value)}
              />
            </FormField>
            <FormField label="Weight">
              <input
                className={formInputClass}
                value={form.weight}
                onChange={(e) => update("weight", e.target.value)}
              />
            </FormField>
            <FormField label="Color">
              <input
                className={formInputClass}
                value={form.color}
                onChange={(e) => update("color", e.target.value)}
              />
            </FormField>
            <FormField label="Size">
              <input
                className={formInputClass}
                value={form.size}
                onChange={(e) => update("size", e.target.value)}
              />
            </FormField>
            <FormField label="Variant">
              <input
                className={formInputClass}
                value={form.variant}
                onChange={(e) => update("variant", e.target.value)}
              />
            </FormField>
          </div>
        </section>

        <section className="space-y-4">
          <FormField label="Description">
            <textarea
              className={`${formTextareaClass} min-h-[100px]`}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </FormField>
          <FormField label="Notes">
            <textarea
              className={`${formTextareaClass} min-h-[80px]`}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </FormField>
        </section>

        <FormActions
          onCancel={onClose}
          submitLabel={submitting ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          submitting={submitting}
        />
      </form>
    </AdminFormModal>
  );
}
