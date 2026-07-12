"use client";

import { useEffect, useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUploadCategoryIconMutation,
  type Category,
} from "@/app/redux/services/categoryApi";
import { showAdminValidationError } from "@/lib/admin-swal";
import Swal from "sweetalert2";
import {
  AdminFormModal,
  FormActions,
  FormField,
  formInputClass,
  slugify,
} from "../AdminFormModal";
import { IconUploadField } from "./IconUploadField";

const emptyForm = {
  nameBn: "",
  nameEn: "",
  slug: "",
  icon: "",
  sortOrder: 1,
  isActive: true,
};

export function CategoryFormModal({
  open,
  initial,
  onClose,
  onSuccess,
}: {
  open: boolean;
  initial?: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [uploadCategoryIcon] = useUploadCategoryIconMutation();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(emptyForm);
  const [slugManual, setSlugManual] = useState(false);
  const [pendingIconFile, setPendingIconFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (initial) {
      setForm({
        nameBn: initial.nameBn,
        nameEn: initial.name,
        slug: initial.slug,
        icon: initial.icon,
        sortOrder: initial.sortOrder,
        isActive: initial.isActive,
      });
      setSlugManual(true);
    } else {
      setForm(emptyForm);
      setSlugManual(false);
    }
    setPendingIconFile(null);
  }, [open, initial]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.nameBn.trim() || !form.nameEn.trim() || !form.slug.trim()) {
      await showAdminValidationError("Name (BN), Name (EN) এবং Slug required।");
      return;
    }
    if (!form.icon.trim()) {
      await showAdminValidationError("Category icon upload বা URL দিন।");
      return;
    }

    setSubmitting(true);

    try {
      let icon = form.icon.trim();

      if (pendingIconFile) {
        const uploaded = await uploadCategoryIcon(pendingIconFile).unwrap();
        icon = uploaded.url;
      } else if (icon.startsWith("data:")) {
        await showAdminValidationError("Icon upload করুন অথবা URL দিন।");
        return;
      }

      const payload = {
        slug: form.slug.trim(),
        name: form.nameEn.trim(),
        nameBn: form.nameBn.trim(),
        icon,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      };

      if (isEdit && initial) {
        await updateCategory({ id: initial.id, body: payload }).unwrap();
      } else {
        await createCategory(payload).unwrap();
      }

      await Swal.fire({
        icon: "success",
        title: isEdit ? "Category updated" : "Category created",
        timer: 1800,
        showConfirmButton: false,
      });

      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      await Swal.fire({
        icon: "error",
        title: "Could not save category",
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
      title={isEdit ? "Edit Category" : "Add Category"}
      onClose={onClose}
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <IconUploadField
          value={form.icon}
          onChange={(icon, file) => {
            update("icon", icon);
            setPendingIconFile(file ?? null);
          }}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Name (BN) *">
            <input
              type="text"
              value={form.nameBn}
              onChange={(e) => update("nameBn", e.target.value)}
              className={formInputClass}
              placeholder="যেমন: মধু"
              required
            />
          </FormField>
          <FormField label="Name (EN) *">
            <input
              type="text"
              value={form.nameEn}
              onChange={(e) => {
                update("nameEn", e.target.value);
                if (!slugManual) update("slug", slugify(e.target.value));
              }}
              className={formInputClass}
              placeholder="e.g. Honey"
              required
            />
          </FormField>
        </div>

        <FormField label="Slug *" hint="URL-friendly id, e.g. modhu">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => {
              setSlugManual(true);
              update("slug", slugify(e.target.value) || e.target.value);
            }}
            className={formInputClass}
            placeholder="modhu"
            required
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Order">
            <input
              type="number"
              min={1}
              value={form.sortOrder}
              onChange={(e) => update("sortOrder", Number(e.target.value) || 1)}
              className={formInputClass}
            />
          </FormField>
          <FormField label="Status">
            <select
              value={form.isActive ? "active" : "inactive"}
              onChange={(e) => update("isActive", e.target.value === "active")}
              className={formInputClass}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </FormField>
        </div>

        <FormActions
          onCancel={onClose}
          submitLabel={
            submitting
              ? "Saving..."
              : isEdit
                ? "Update Category"
                : "Save Category"
          }
        />
      </form>
    </AdminFormModal>
  );
}
