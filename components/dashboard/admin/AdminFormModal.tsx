"use client";

import { useEffect } from "react";

export function AdminFormModal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-brand-border bg-white px-5 py-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-brand-gray hover:text-gray-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

export function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-400">{hint}</span>}
    </label>
  );
}

export const formInputClass =
  "w-full rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-brand-orange";

export const formTextareaClass =
  "w-full resize-none rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-brand-orange";

export function FormActions({
  onCancel,
  submitLabel,
}: {
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-brand-border pt-5">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-brand-border px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-brand-gray"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
      >
        {submitLabel}
      </button>
    </div>
  );
}

export function showSavedPreview(message = "Form ready — API connect হলে save হবে।") {
  window.alert(message);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
