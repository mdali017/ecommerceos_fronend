"use client";

import { useEffect, useState } from "react";
import {
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  type Testimonial,
} from "@/app/redux/services/testimonialApi";
import { showAdminValidationError } from "@/lib/admin-swal";
import Swal from "sweetalert2";
import {
  AdminFormModal,
  FormActions,
  FormField,
  formInputClass,
  formTextareaClass,
} from "../AdminFormModal";

const emptyForm = {
  nameBn: "",
  nameEn: "",
  reviewBn: "",
  reviewEn: "",
  rating: 5,
  avatar: "",
  sortOrder: 1,
  isActive: true,
};

export function TestimonialFormModal({
  open,
  initial,
  onClose,
  onSuccess,
}: {
  open: boolean;
  initial?: Testimonial | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [createTestimonial] = useCreateTestimonialMutation();
  const [updateTestimonial] = useUpdateTestimonialMutation();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (initial) {
      setForm({
        nameBn: initial.nameBn,
        nameEn: initial.nameEn,
        reviewBn: initial.reviewBn,
        reviewEn: initial.reviewEn,
        rating: initial.rating,
        avatar: initial.avatar,
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

    if (!form.nameBn.trim() || !form.reviewBn.trim()) {
      await showAdminValidationError("Name (BN) এবং Review (BN) required।");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        nameBn: form.nameBn.trim(),
        nameEn: form.nameEn.trim(),
        reviewBn: form.reviewBn.trim(),
        reviewEn: form.reviewEn.trim(),
        rating: form.rating,
        avatar: form.avatar.trim(),
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      };

      if (isEdit && initial) {
        await updateTestimonial({ id: initial.id, body: payload }).unwrap();
      } else {
        await createTestimonial(payload).unwrap();
      }

      await Swal.fire({
        icon: "success",
        title: isEdit ? "Review updated" : "Review created",
        timer: 1800,
        showConfirmButton: false,
      });

      onSuccess();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Save failed";
      await Swal.fire({
        icon: "error",
        title: "Could not save review",
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
      title={isEdit ? "Edit Testimonial" : "Add Testimonial"}
      onClose={onClose}
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Name (BN) *">
            <input
              type="text"
              value={form.nameBn}
              onChange={(e) => {
                update("nameBn", e.target.value);
                if (!form.avatar) update("avatar", e.target.value.trim().charAt(0) || "");
              }}
              className={formInputClass}
              required
            />
          </FormField>
          <FormField label="Name (EN)">
            <input
              type="text"
              value={form.nameEn}
              onChange={(e) => update("nameEn", e.target.value)}
              className={formInputClass}
            />
          </FormField>
        </div>

        <FormField label="Review (BN) *">
          <textarea
            rows={3}
            value={form.reviewBn}
            onChange={(e) => update("reviewBn", e.target.value)}
            className={formTextareaClass}
            required
          />
        </FormField>

        <FormField label="Review (EN)">
          <textarea
            rows={3}
            value={form.reviewEn}
            onChange={(e) => update("reviewEn", e.target.value)}
            className={formTextareaClass}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FormField label="Avatar Letter">
            <input
              type="text"
              maxLength={2}
              value={form.avatar}
              onChange={(e) => update("avatar", e.target.value)}
              className={formInputClass}
              placeholder="র"
            />
          </FormField>
          <FormField label="Rating">
            <select
              value={form.rating}
              onChange={(e) => update("rating", Number(e.target.value))}
              className={formInputClass}
            >
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>
                  {star} ★
                </option>
              ))}
            </select>
          </FormField>
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
          submitLabel={submitting ? "Saving..." : isEdit ? "Update Review" : "Save Review"}
        />
      </form>
    </AdminFormModal>
  );
}
