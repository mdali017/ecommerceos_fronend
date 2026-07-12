"use client";

import { useEffect, useRef, useState } from "react";
import { BULK_UPLOAD_COLUMNS, type BulkProductRow } from "@/lib/product-bulk-upload";

export type RowImageMap = Record<number, File[]>;

interface BulkUploadPreviewTableProps {
  rows: BulkProductRow[];
  rowImages: RowImageMap;
  onUpdateRow: (index: number, key: keyof BulkProductRow, value: string) => void;
  onUpdateImages: (index: number, files: File[]) => void;
}

const STICKY_INDEX_WIDTH = 40;
const STICKY_NAME_WIDTH = 180;
const STICKY_NAME_LEFT = STICKY_INDEX_WIDTH;

function EditableCell({
  value,
  onChange,
  wide,
}: {
  value: string;
  onChange: (value: string) => void;
  wide?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full min-w-0 rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-gray-700 outline-none transition-colors hover:border-brand-border focus:border-brand-orange focus:bg-white ${
        wide ? "min-w-[160px]" : "min-w-[88px]"
      }`}
      placeholder="—"
    />
  );
}

function ImageUploadCell({
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    onChange([...files, ...Array.from(fileList)]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeImage = (imageIndex: number) => {
    onChange(files.filter((_, i) => i !== imageIndex));
  };

  return (
    <div className="flex min-w-[72px] items-center gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        title="Upload images"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-brand-border bg-white text-sm text-gray-500 hover:border-brand-orange hover:text-brand-orange"
      >
        +
      </button>
      {previews.length > 0 && (
        <div className="flex items-center gap-0.5">
          {previews.slice(0, 2).map((src, i) => (
            <div
              key={src}
              className="group relative h-7 w-7 shrink-0 overflow-hidden rounded border border-brand-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] text-white opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
          {previews.length > 2 && (
            <span className="text-[10px] font-semibold text-gray-500">+{previews.length - 2}</span>
          )}
        </div>
      )}
    </div>
  );
}

export function BulkUploadPreviewTable({
  rows,
  rowImages,
  onUpdateRow,
  onUpdateImages,
}: BulkUploadPreviewTableProps) {
  const scrollColumns = BULK_UPLOAD_COLUMNS.filter((col) => col.key !== "productName");

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] border-collapse text-xs">
        <thead>
          <tr className="border-b border-brand-border bg-brand-gray/50 text-left uppercase tracking-wider text-gray-500">
            <th
              className="sticky left-0 z-30 border-r border-brand-border bg-brand-gray/50 px-3 py-2 shadow-[2px_0_4px_rgba(0,0,0,0.04)]"
              style={{ width: STICKY_INDEX_WIDTH, minWidth: STICKY_INDEX_WIDTH }}
            >
              #
            </th>
            <th
              className="sticky z-30 border-r border-brand-border bg-brand-gray/50 px-3 py-2 shadow-[2px_0_4px_rgba(0,0,0,0.04)]"
              style={{
                left: STICKY_NAME_LEFT,
                width: STICKY_NAME_WIDTH,
                minWidth: STICKY_NAME_WIDTH,
              }}
            >
              Product Name
            </th>
            <th className="whitespace-nowrap px-3 py-2">Images</th>
            {scrollColumns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-3 py-2">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${row.sku}-${index}`}
              className="group border-b border-brand-border last:border-0 hover:bg-brand-gray/20"
            >
              <td
                className="sticky left-0 z-20 border-r border-brand-border bg-white px-3 py-1.5 text-gray-500 group-hover:bg-brand-gray/20 shadow-[2px_0_4px_rgba(0,0,0,0.04)]"
                style={{ width: STICKY_INDEX_WIDTH, minWidth: STICKY_INDEX_WIDTH }}
              >
                {index + 1}
              </td>
              <td
                className="sticky z-20 border-r border-brand-border bg-white px-2 py-1 group-hover:bg-brand-gray/20 shadow-[2px_0_4px_rgba(0,0,0,0.04)]"
                style={{
                  left: STICKY_NAME_LEFT,
                  width: STICKY_NAME_WIDTH,
                  minWidth: STICKY_NAME_WIDTH,
                }}
              >
                <EditableCell
                  value={row.productName}
                  onChange={(value) => onUpdateRow(index, "productName", value)}
                  wide
                />
              </td>
              <td className="px-2 py-1.5">
                <ImageUploadCell
                  files={rowImages[index] ?? []}
                  onChange={(files) => onUpdateImages(index, files)}
                />
              </td>
              {scrollColumns.map((col) => (
                <td key={col.key} className="px-2 py-1">
                  <EditableCell
                    value={row[col.key]}
                    onChange={(value) => onUpdateRow(index, col.key, value)}
                    wide={col.key === "description" || col.key === "notes"}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function clearRowImages(_rowImages: RowImageMap) {
  // File objects don't need explicit cleanup
}
