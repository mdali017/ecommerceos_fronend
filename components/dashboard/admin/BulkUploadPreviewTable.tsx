"use client";

import { useEffect, useRef, useState } from "react";
import { BULK_UPLOAD_COLUMNS, type BulkProductRow } from "@/lib/product-bulk-upload";

export type RowImageMap = Record<number, File[]>;

interface BulkUploadPreviewTableProps {
  rows: BulkProductRow[];
  rowImages: RowImageMap;
  onUpdateRow: (index: number, key: keyof BulkProductRow, value: string) => void;
  onUpdateImages: (index: number, files: File[]) => void;
  onRemoveRow: (index: number) => void;
  selectionMode?: boolean;
  selectedIndices?: Set<number>;
  onToggleSelect?: (index: number) => void;
  onToggleSelectAll?: () => void;
}

const CHECKBOX_WIDTH = 40;
const STICKY_INDEX_WIDTH = 40;
const STICKY_NAME_WIDTH = 180;

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
      className={`w-full min-w-0 rounded border border-transparent bg-transparent px-1.5 py-1 text-xs text-foreground outline-none transition-colors hover:border-brand-border focus:border-brand-orange focus:bg-card ${
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
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-brand-border bg-card text-sm text-muted hover:border-brand-orange hover:text-brand-orange"
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
            <span className="text-[10px] font-semibold text-muted">+{previews.length - 2}</span>
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
  onRemoveRow,
  selectionMode = false,
  selectedIndices = new Set(),
  onToggleSelect,
  onToggleSelectAll,
}: BulkUploadPreviewTableProps) {
  const scrollColumns = BULK_UPLOAD_COLUMNS.filter((col) => col.key !== "productName");
  const allSelected = rows.length > 0 && selectedIndices.size === rows.length;
  const someSelected = selectedIndices.size > 0 && !allSelected;

  const indexLeft = selectionMode ? CHECKBOX_WIDTH : 0;
  const nameLeft = indexLeft + STICKY_INDEX_WIDTH;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1180px] border-collapse text-xs">
        <thead>
          <tr className="border-b border-brand-border bg-brand-gray/50 text-left uppercase tracking-wider text-muted">
            {selectionMode && (
              <th
                className="sticky left-0 z-30 border-r border-brand-border bg-brand-gray/50 px-2 py-2 shadow-[2px_0_4px_rgba(0,0,0,0.04)]"
                style={{ width: CHECKBOX_WIDTH, minWidth: CHECKBOX_WIDTH }}
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={() => onToggleSelectAll?.()}
                  aria-label="Select all rows"
                  className="h-3.5 w-3.5 cursor-pointer accent-brand-orange"
                />
              </th>
            )}
            <th
              className="sticky z-30 border-r border-brand-border bg-brand-gray/50 px-3 py-2 shadow-[2px_0_4px_rgba(0,0,0,0.04)]"
              style={{
                left: indexLeft,
                width: STICKY_INDEX_WIDTH,
                minWidth: STICKY_INDEX_WIDTH,
              }}
            >
              #
            </th>
            <th
              className="sticky z-30 border-r border-brand-border bg-brand-gray/50 px-3 py-2 shadow-[2px_0_4px_rgba(0,0,0,0.04)]"
              style={{
                left: nameLeft,
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
            <th className="sticky right-0 z-30 whitespace-nowrap border-l border-brand-border bg-brand-gray/50 px-3 py-2 text-center shadow-[-2px_0_4px_rgba(0,0,0,0.04)]">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const isSelected = selectedIndices.has(index);

            return (
              <tr
                key={`${row.sku}-${index}`}
                className={`group border-b border-brand-border last:border-0 hover:bg-brand-gray/20 ${
                  isSelected ? "bg-orange-50/50 dark:bg-orange-950/20" : ""
                }`}
              >
                {selectionMode && (
                  <td
                    className={`sticky left-0 z-20 border-r border-brand-border px-2 py-1.5 shadow-[2px_0_4px_rgba(0,0,0,0.04)] ${
                      isSelected
                        ? "bg-orange-50 dark:bg-orange-950/30"
                        : "bg-card group-hover:bg-brand-gray/20"
                    }`}
                    style={{ width: CHECKBOX_WIDTH, minWidth: CHECKBOX_WIDTH }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect?.(index)}
                      aria-label={`Select row ${index + 1}`}
                      className="h-3.5 w-3.5 cursor-pointer accent-brand-orange"
                    />
                  </td>
                )}
                <td
                  className={`sticky z-20 border-r border-brand-border px-3 py-1.5 text-muted shadow-[2px_0_4px_rgba(0,0,0,0.04)] ${
                    isSelected
                      ? "bg-orange-50 dark:bg-orange-950/30"
                      : "bg-card group-hover:bg-brand-gray/20"
                  }`}
                  style={{
                    left: indexLeft,
                    width: STICKY_INDEX_WIDTH,
                    minWidth: STICKY_INDEX_WIDTH,
                  }}
                >
                  {index + 1}
                </td>
                <td
                  className={`sticky z-20 border-r border-brand-border px-2 py-1 shadow-[2px_0_4px_rgba(0,0,0,0.04)] ${
                    isSelected
                      ? "bg-orange-50 dark:bg-orange-950/30"
                      : "bg-card group-hover:bg-brand-gray/20"
                  }`}
                  style={{
                    left: nameLeft,
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
                <td
                  className={`sticky right-0 z-20 border-l border-brand-border px-2 py-1.5 text-center shadow-[-2px_0_4px_rgba(0,0,0,0.04)] ${
                    isSelected
                      ? "bg-orange-50 dark:bg-orange-950/30"
                      : "bg-card group-hover:bg-brand-gray/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onRemoveRow(index)}
                    className="rounded-lg border border-red-200 px-2.5 py-1 text-[11px] font-semibold text-red-500 transition-colors hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function clearRowImages(_rowImages: RowImageMap) {
  // File objects don't need explicit cleanup
}
