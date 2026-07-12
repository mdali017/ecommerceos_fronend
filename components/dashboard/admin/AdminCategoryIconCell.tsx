"use client";

import Image from "next/image";
import { CategoryIconPreview } from "./forms/IconUploadField";

function isImageUrl(value: string) {
  return /^https?:\/\//i.test(value) || value.startsWith("data:image/");
}

export function AdminCategoryIconCell({ icon }: { icon: string }) {
  if (isImageUrl(icon)) {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-brand-border bg-brand-cream">
        <Image src={icon} alt="Category icon" fill className="object-cover" unoptimized />
      </div>
    );
  }

  return <CategoryIconPreview icon={icon} size="sm" />;
}
