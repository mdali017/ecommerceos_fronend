"use client";

import { useEffect, useState } from "react";
import {
  useCreateHomepageBrandMutation,
  useUpdateHomepageBrandMutation,
  type HomepageBrand,
} from "@/app/redux/services/homepageBrandApi";
import { showAdminValidationError } from "@/lib/admin-swal";
import Swal from "sweetalert2";
import {
  AdminFormModal,
  FormActions,
  FormField,
  formInputClass,
} from "../AdminFormModal";

const emptyForm = {
  name: "",
  sortOrder: 1,
  isActive: true,
};

export function BrandFormModal({
  open,
  initial,
  onClose,
  onSuccess,
}: {
  open: boolean;
  initial?: HomepageBrand | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [createHomepageBrand] = useCreateHomepageBrandMutation();
  const [updateHomepageBrand] = useUpdateHomepageBrandMutation();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (initial) {
      setForm({
        name: initial.name,
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

    if (!form.name.trim()) {
      await showAdminValidationError("Brand name required।");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      };

      if (isEdit && initial) {
        await updateHomepageBrand({ id: initial.id, body: payload }).unwrap();
      } else {
        await createHomepageBrand(payload).unwrap();
      }

      await Swal.fire({
        icon: "success",
        title: isEdit ? "Brand updated" : "Brand created",
        timer: 1800,
        showConfirmButton: false,
      });

      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      await Swal.fire({
        icon: "error",
        title: "Could not save brand",
        text: message,
        confirmButtonColor: "#f58220",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminFormModal open={open} title={isEdit ? "Edit Brand" : "Add Brand"} onClose={onClose}>
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <FormField label="Brand Name *">
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={formInputClass}
            placeholder="EOS Organic"
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
          submitLabel={submitting ? "Saving..." : isEdit ? "Update Brand" : "Save Brand"}
        />
      </form>
    </AdminFormModal>
  );
}
