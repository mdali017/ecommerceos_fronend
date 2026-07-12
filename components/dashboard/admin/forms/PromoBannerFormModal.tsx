"use client";

import { useEffect, useState } from "react";
import {
  useCreatePromoBannerMutation,
  useUpdatePromoBannerMutation,
  useUploadPromoBannerImageMutation,
  type PromoBanner,
} from "@/app/redux/services/promoBannerApi";
import { showAdminValidationError } from "@/lib/admin-swal";
import Swal from "sweetalert2";
import {
  AdminFormModal,
  FormActions,
  FormField,
  formInputClass,
  formTextareaClass,
} from "../AdminFormModal";
import { BannerImageUploadField } from "./BannerImageUploadField";

const emptyForm = {
  titleBn: "",
  titleEn: "",
  subtitleBn: "",
  subtitleEn: "",
  imageUrl: "",
  sortOrder: 1,
  isActive: true,
};

export function PromoBannerFormModal({
  open,
  initial,
  onClose,
  onSuccess,
}: {
  open: boolean;
  initial?: PromoBanner | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [createPromoBanner] = useCreatePromoBannerMutation();
  const [updatePromoBanner] = useUpdatePromoBannerMutation();
  const [uploadPromoBannerImage] = useUploadPromoBannerImageMutation();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(emptyForm);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (initial) {
      setForm({
        titleBn: initial.titleBn,
        titleEn: initial.titleEn,
        subtitleBn: initial.subtitleBn,
        subtitleEn: initial.subtitleEn,
        imageUrl: initial.imageUrl,
        sortOrder: initial.sortOrder,
        isActive: initial.isActive,
      });
    } else {
      setForm(emptyForm);
    }
    setPendingImageFile(null);
  }, [open, initial]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.titleBn.trim() || !form.titleEn.trim()) {
      await showAdminValidationError("Title (BN) এবং Title (EN) required।");
      return;
    }
    if (!form.imageUrl.trim()) {
      await showAdminValidationError("Banner image upload বা URL দিন।");
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = form.imageUrl.trim();

      if (pendingImageFile) {
        const uploaded = await uploadPromoBannerImage(pendingImageFile).unwrap();
        imageUrl = uploaded.url;
      } else if (imageUrl.startsWith("data:")) {
        await showAdminValidationError("Image upload করুন অথবা URL দিন।");
        return;
      }

      const payload = {
        titleBn: form.titleBn.trim(),
        titleEn: form.titleEn.trim(),
        subtitleBn: form.subtitleBn.trim(),
        subtitleEn: form.subtitleEn.trim(),
        imageUrl,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      };

      if (isEdit && initial) {
        await updatePromoBanner({ id: initial.id, body: payload }).unwrap();
      } else {
        await createPromoBanner(payload).unwrap();
      }

      await Swal.fire({
        icon: "success",
        title: isEdit ? "Promo updated" : "Promo created",
        timer: 1800,
        showConfirmButton: false,
      });

      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      await Swal.fire({
        icon: "error",
        title: "Could not save promo banner",
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
      title={isEdit ? "Edit Promo Banner" : "Add Promo Banner"}
      onClose={onClose}
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <BannerImageUploadField
          value={form.imageUrl}
          onChange={(imageUrl, file) => {
            update("imageUrl", imageUrl);
            setPendingImageFile(file ?? null);
          }}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Title (BN) *">
            <input
              type="text"
              value={form.titleBn}
              onChange={(e) => update("titleBn", e.target.value)}
              className={formInputClass}
              required
            />
          </FormField>
          <FormField label="Title (EN) *">
            <input
              type="text"
              value={form.titleEn}
              onChange={(e) => update("titleEn", e.target.value)}
              className={formInputClass}
              required
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Subtitle (BN)">
            <textarea
              rows={2}
              value={form.subtitleBn}
              onChange={(e) => update("subtitleBn", e.target.value)}
              className={formTextareaClass}
            />
          </FormField>
          <FormField label="Subtitle (EN)">
            <textarea
              rows={2}
              value={form.subtitleEn}
              onChange={(e) => update("subtitleEn", e.target.value)}
              className={formTextareaClass}
            />
          </FormField>
        </div>

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
          submitLabel={submitting ? "Saving..." : isEdit ? "Update Promo" : "Save Promo"}
        />
      </form>
    </AdminFormModal>
  );
}
