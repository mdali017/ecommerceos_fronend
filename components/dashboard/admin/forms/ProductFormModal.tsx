"use client";

import { useEffect, useState } from "react";
import {
  createProduct,
  updateProduct,
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
} from "../AdminFormModal";

const emptyForm: ProductUpsertInput = {
  sku: "",
  productName: "",
  genericName: "",
  brand: "Khaas Food",
  category: "",
  subcategory: "",
  description: "",
  unit: "",
  packSize: "",
  sellingPrice: "",
  offerPrice: "",
  stockQty: "",
  minStock: "",
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
    genericName: product.genericName,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory,
    description: product.description,
    unit: product.unit,
    packSize: product.packSize,
    sellingPrice: product.sellingPrice,
    offerPrice: product.offerPrice,
    stockQty: product.stockQty,
    minStock: product.minStock,
    imageUrl: product.imageUrl || product.images[0] || "",
    status: product.status,
    featured: product.featured ? "yes" : "no",
    tags: product.tags,
    notes: product.notes,
  };
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
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<ProductUpsertInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(initial ? productToForm(initial) : emptyForm);
  }, [open, initial]);

  const update = <K extends keyof ProductUpsertInput>(
    key: K,
    value: ProductUpsertInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
      if (isEdit && initial) {
        await updateProduct(initial.id, form, accessToken);
      } else {
        await createProduct(form, accessToken);
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

  return (
    <AdminFormModal
      open={open}
      title={isEdit ? "Edit Product" : "Add Product"}
      onClose={onClose}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <FormField label="Generic Name (BN)">
            <input
              className={formInputClass}
              value={form.genericName}
              onChange={(e) => update("genericName", e.target.value)}
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
          <FormField label="Brand">
            <input
              className={formInputClass}
              value={form.brand}
              onChange={(e) => update("brand", e.target.value)}
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
        </div>

        <FormField label="Image URL">
          <input
            className={formInputClass}
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
          />
        </FormField>

        <FormField label="Description">
          <textarea
            className={`${formInputClass} min-h-[90px]`}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </FormField>

        <FormField label="Tags">
          <input
            className={formInputClass}
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
            placeholder="honey,bestseller"
          />
        </FormField>

        <FormActions onCancel={onClose} submitLabel={isEdit ? "Update" : "Create"} submitting={submitting} />
      </form>
    </AdminFormModal>
  );
}
