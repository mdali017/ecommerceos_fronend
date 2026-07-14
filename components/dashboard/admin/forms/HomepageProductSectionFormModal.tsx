"use client";

import { useEffect, useState } from "react";
import {
  useCreateHomepageProductSectionMutation,
  useUpdateHomepageProductSectionMutation,
  type HomepageProductSection,
  type HomepageProductSource,
  type HomepageSectionType,
} from "@/app/redux/services/homepageProductSectionApi";
import { showAdminValidationError } from "@/lib/admin-swal";
import Swal from "sweetalert2";
import {
  AdminFormModal,
  FormActions,
  FormField,
  formInputClass,
} from "../AdminFormModal";

const emptyForm = {
  titleBn: "",
  titleEn: "",
  sectionType: "carousel" as HomepageSectionType,
  productSource: "category" as HomepageProductSource,
  categorySlug: "",
  categoryKeywords: "",
  productSkus: "",
  maxProducts: 12,
  sortOrder: 10,
  isActive: true,
};

export function HomepageProductSectionFormModal({
  open,
  initial,
  onClose,
  onSuccess,
}: {
  open: boolean;
  initial?: HomepageProductSection | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [createSection] = useCreateHomepageProductSectionMutation();
  const [updateSection] = useUpdateHomepageProductSectionMutation();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (initial) {
      setForm({
        titleBn: initial.titleBn,
        titleEn: initial.titleEn,
        sectionType: initial.sectionType,
        productSource: initial.productSource,
        categorySlug: initial.categorySlug,
        categoryKeywords: initial.categoryKeywords,
        productSkus: initial.productSkus,
        maxProducts: initial.maxProducts,
        sortOrder: initial.sortOrder,
        isActive: initial.isActive,
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, initial]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.titleBn.trim()) {
      await showAdminValidationError("Section title (BN) required।");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        titleBn: form.titleBn.trim(),
        titleEn: form.titleEn.trim(),
        sectionType: form.sectionType,
        productSource: form.productSource,
        categorySlug: form.categorySlug.trim(),
        categoryKeywords: form.categoryKeywords.trim(),
        productSkus: form.productSkus.trim(),
        maxProducts: form.maxProducts,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      };

      if (isEdit && initial) {
        await updateSection({ id: initial.id, body: payload }).unwrap();
      } else {
        await createSection(payload).unwrap();
      }

      await Swal.fire({
        icon: "success",
        title: isEdit ? "Section updated" : "Section created",
        timer: 1800,
        showConfirmButton: false,
      });

      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      await Swal.fire({
        icon: "error",
        title: "Could not save section",
        text: message,
        confirmButtonColor: "#f58220",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminFormModal
      open={open}
      title={isEdit ? "Edit Product Section" : "Add Product Section"}
      onClose={onClose}
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Title (BN) *">
            <input
              className={formInputClass}
              value={form.titleBn}
              onChange={(e) => update("titleBn", e.target.value)}
              placeholder="মশলা সংগ্রহ"
            />
          </FormField>
          <FormField label="Title (EN)">
            <input
              className={formInputClass}
              value={form.titleEn}
              onChange={(e) => update("titleEn", e.target.value)}
              placeholder="Spice Collection"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Layout Type">
            <select
              className={formInputClass}
              value={form.sectionType}
              onChange={(e) => update("sectionType", e.target.value as HomepageSectionType)}
            >
              <option value="grid">Best Sell Grid</option>
              <option value="carousel">Category Carousel</option>
              <option value="flash_sale">Flash Sale</option>
            </select>
          </FormField>
          <FormField label="Product Source">
            <select
              className={formInputClass}
              value={form.productSource}
              onChange={(e) => update("productSource", e.target.value as HomepageProductSource)}
            >
              <option value="category">Category</option>
              <option value="featured">Best Sell / Featured</option>
              <option value="on_sale">Flash Sale / On Sale</option>
              <option value="manual">Manual SKUs</option>
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Category Slug (View All link)">
            <input
              className={formInputClass}
              value={form.categorySlug}
              onChange={(e) => update("categorySlug", e.target.value)}
              placeholder="moshla / modhu / am"
            />
          </FormField>
          <FormField label="Sort Order">
            <input
              type="number"
              className={formInputClass}
              value={form.sortOrder}
              onChange={(e) => update("sortOrder", Number(e.target.value))}
            />
          </FormField>
        </div>

        <FormField label="Category Keywords (comma separated)">
          <input
            className={formInputClass}
            value={form.categoryKeywords}
            onChange={(e) => update("categoryKeywords", e.target.value)}
            placeholder="spice,মশলা"
          />
        </FormField>

        <FormField label="Manual Product SKUs (comma separated)">
          <input
            className={formInputClass}
            value={form.productSkus}
            onChange={(e) => update("productSkus", e.target.value)}
            placeholder="KF-001,KF-002,KF-003"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Max Products">
            <input
              type="number"
              min={1}
              max={50}
              className={formInputClass}
              value={form.maxProducts}
              onChange={(e) => update("maxProducts", Number(e.target.value))}
            />
          </FormField>
          <FormField label="Status">
            <select
              className={formInputClass}
              value={form.isActive ? "active" : "inactive"}
              onChange={(e) => update("isActive", e.target.value === "active")}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </FormField>
        </div>

        <p className="rounded-xl bg-brand-cream px-4 py-3 text-xs text-muted">
          Sort order guide: 10 = before brands, 30-50 = between brands & promo, 70+ = after promo.
        </p>

        <FormActions
          onCancel={onClose}
          submitLabel={
            submitting ? "Saving..." : isEdit ? "Update Section" : "Save Section"
          }
        />
      </form>
    </AdminFormModal>
  );
}
