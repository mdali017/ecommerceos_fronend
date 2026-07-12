"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FormField, formInputClass } from "../AdminFormModal";

function isImageUrl(value: string) {
  return /^https?:\/\//i.test(value) || value.startsWith("data:image/");
}

export function CategoryIconPreview({
  icon,
  size = "lg",
}: {
  icon: string;
  size?: "sm" | "lg";
}) {
  const boxClass =
    size === "lg"
      ? "h-20 w-20 text-3xl"
      : "h-10 w-10 text-xl";

  if (!icon) {
    return (
      <div
        className={`flex ${boxClass} items-center justify-center rounded-full border-2 border-dashed border-brand-border bg-brand-gray text-gray-400`}
      >
        ?
      </div>
    );
  }

  if (isImageUrl(icon)) {
    return (
      <div
        className={`relative ${boxClass} overflow-hidden rounded-full border-2 border-brand-orange/30 bg-brand-cream`}
      >
        <Image src={icon} alt="Category icon" fill className="object-cover" unoptimized />
      </div>
    );
  }

  return (
    <div
      className={`flex ${boxClass} items-center justify-center rounded-full border-2 border-brand-orange/30 bg-brand-cream`}
    >
      {icon}
    </div>
  );
}

export function IconUploadField({
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

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      window.alert("PNG, JPG, WEBP, বা SVG image upload করুন।");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      window.alert("Icon image max 2MB।");
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

  const clearIcon = () => {
    onChange("", null);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <FormField
      label="Category Icon *"
      hint="Upload custom icon (PNG/JPG/WEBP/SVG) or paste image URL. Admin যেকোনো নতুন icon add করতে পারবে।"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <CategoryIconPreview icon={value} />
          <div className="min-w-0 flex-1">
            {value ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">
                  {fileName || (isImageUrl(value) ? "Icon ready" : "Emoji icon")}
                </p>
                <button
                  type="button"
                  onClick={clearIcon}
                  className="text-sm font-semibold text-red-500 hover:text-red-600"
                >
                  Remove icon
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No icon selected yet</p>
            )}
          </div>
        </div>

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
              ? "border-brand-orange bg-orange-50"
              : "border-brand-border bg-brand-gray/40 hover:border-brand-orange/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-sm font-semibold text-gray-800">Upload icon image</p>
          <p className="mt-1 text-xs text-gray-500">Drag & drop or click to browse</p>
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
            <span className="bg-white px-2 text-gray-400">or paste URL</span>
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
          placeholder="https://example.com/icons/honey.png"
        />
      </div>
    </FormField>
  );
}
