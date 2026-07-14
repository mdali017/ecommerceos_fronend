"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FormField, formInputClass } from "../AdminFormModal";

function isImageUrl(value: string) {
  return /^https?:\/\//i.test(value) || value.startsWith("data:image/");
}

export function BannerImagePreview({ imageUrl }: { imageUrl: string }) {
  if (!imageUrl) {
    return (
      <div className="flex h-28 w-full items-center justify-center rounded-xl border-2 border-dashed border-brand-border bg-brand-gray text-sm text-muted">
        No banner image
      </div>
    );
  }

  return (
    <div className="relative h-28 w-full overflow-hidden rounded-xl border border-brand-border bg-brand-gray">
      <Image
        src={imageUrl}
        alt="Banner preview"
        fill
        className="object-cover"
        unoptimized={imageUrl.startsWith("data:")}
      />
    </div>
  );
}

export function BannerImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string, file?: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File | null) => {
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      window.alert("PNG, JPG, বা WEBP image upload করুন।");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      window.alert("Banner image max 5MB।");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result, file);
        setFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    onChange("", null);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <FormField
      label="Banner Image *"
      hint="Upload banner (PNG/JPG/WEBP) or paste image URL. Recommended wide aspect ratio."
    >
      <div className="space-y-3">
        <BannerImagePreview imageUrl={value} />

        {value ? (
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-foreground">
              {fileName || (isImageUrl(value) ? "Banner ready" : "Image selected")}
            </p>
            <button
              type="button"
              onClick={clearImage}
              className="shrink-0 text-sm font-semibold text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ) : null}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0] ?? null);
          }}
          className={`rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
            dragOver
              ? "border-brand-orange bg-orange-50 dark:bg-orange-950/40"
              : "border-brand-border bg-brand-gray/40 hover:border-brand-orange/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-sm font-semibold text-foreground">Upload banner image</p>
          <p className="mt-1 text-xs text-muted">Drag & drop or click to browse (max 5MB)</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-3 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
          >
            Choose File
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted">or paste URL</span>
          </div>
        </div>

        <input
          type="url"
          value={isImageUrl(value) && !value.startsWith("data:") ? value : ""}
          onChange={(e) => {
            setFileName("");
            onChange(e.target.value, null);
          }}
          className={formInputClass}
          placeholder="https://example.com/banner.jpg"
        />
      </div>
    </FormField>
  );
}
