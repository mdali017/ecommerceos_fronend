"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  type BulkProductRow,
  downloadProductBulkTemplate,
  mapRawRowsToBulkProducts,
  prepareBulkRowForApi,
} from "@/lib/product-bulk-upload";
import {
  BulkUploadPreviewTable,
  clearRowImages,
  type RowImageMap,
} from "@/components/dashboard/admin/BulkUploadPreviewTable";
import { useAdminToken } from "@/lib/hooks/useAdminToken";
import { bulkUploadProducts, uploadProductImages } from "@/lib/api/products";
import { ApiError } from "@/lib/api/client";
import { showValidationError } from "@/lib/swal";
import Swal from "sweetalert2";

const ACCEPTED_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

interface ProductBulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

async function parseSpreadsheetFile(file: File): Promise<BulkProductRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("ফাইলে কোনো শিট পাওয়া যায়নি।");
  }

  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });

  return mapRawRowsToBulkProducts(rawRows);
}

function isAcceptedFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension === "csv" || extension === "xlsx" || extension === "xls" || ACCEPTED_TYPES.includes(file.type);
}

export function ProductBulkUploadModal({ isOpen, onClose, onSuccess }: ProductBulkUploadModalProps) {
  const { getValidAccessToken } = useAdminToken();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<BulkProductRow[]>([]);
  const [rowImages, setRowImages] = useState<RowImageMap>({});
  const rowImagesRef = useRef<RowImageMap>({});
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [error, setError] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const hasPreview = rows.length > 0;

  useEffect(() => {
    rowImagesRef.current = rowImages;
  }, [rowImages]);

  const resetState = useCallback(() => {
    clearRowImages(rowImagesRef.current);
    setFileName("");
    setRows([]);
    setRowImages({});
    setParsing(false);
    setImporting(false);
    setProgress(0);
    setProgressLabel("");
    setError("");
    setSelectionMode(false);
    setSelectedIndices(new Set());
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleClose = useCallback(() => {
    if (importing) return;
    resetState();
    onClose();
  }, [importing, onClose, resetState]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !importing) handleClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleClose, importing]);

  const processFile = async (file: File) => {
    if (!isAcceptedFile(file)) {
      setError("শুধু CSV বা XLSX ফাইল আপলোড করা যাবে।");
      return;
    }

    setParsing(true);
    setError("");

    try {
      const parsedRows = await parseSpreadsheetFile(file);
      if (parsedRows.length === 0) {
        setError("ফাইলে কোনো প্রোডাক্ট ডেটা পাওয়া যায়নি।");
        setRows([]);
        setFileName("");
        return;
      }
      setFileName(file.name);
      setRowImages({});
      setRows(parsedRows);
      setSelectionMode(false);
      setSelectedIndices(new Set());
    } catch {
      setError("ফাইল পড়তে সমস্যা হয়েছে। ফরম্যাট চেক করে আবার চেষ্টা করুন।");
      setRows([]);
      setFileName("");
    } finally {
      setParsing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void processFile(file);
  };

  const handleDownloadSample = () => {
    downloadProductBulkTemplate();
  };

  const handleChangeFile = () => {
    if (importing) return;
    clearRowImages(rowImagesRef.current);
    setRows([]);
    setRowImages({});
    setFileName("");
    setError("");
    setSelectionMode(false);
    setSelectedIndices(new Set());
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const remapRowImages = (prevImages: RowImageMap, keepIndices: number[]) => {
    const next: RowImageMap = {};
    keepIndices.forEach((oldIndex, newIndex) => {
      if (prevImages[oldIndex]?.length) {
        next[newIndex] = prevImages[oldIndex];
      }
    });
    return next;
  };

  const removeRowsAtIndices = (indices: number[]) => {
    if (indices.length === 0) return;
    const removeSet = new Set(indices);

    setRows((prevRows) => {
      const keepIndices = prevRows.map((_, i) => i).filter((i) => !removeSet.has(i));
      setRowImages((prevImages) => remapRowImages(prevImages, keepIndices));
      const nextRows = prevRows.filter((_, i) => !removeSet.has(i));
      if (nextRows.length === 0) {
        setSelectionMode(false);
      }
      return nextRows;
    });
    setSelectedIndices(new Set());
  };

  const handleRemoveRow = (index: number) => {
    removeRowsAtIndices([index]);
  };

  const handleToggleSelect = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    setSelectedIndices((prev) => {
      if (prev.size === rows.length) return new Set();
      return new Set(rows.map((_, i) => i));
    });
  };

  const handleToggleBulkDeleteMode = () => {
    if (selectionMode) {
      setSelectionMode(false);
      setSelectedIndices(new Set());
      return;
    }
    setSelectionMode(true);
  };

  const handleDeleteSelected = () => {
    if (selectedIndices.size === 0) return;
    removeRowsAtIndices([...selectedIndices]);
  };

  const updateRow = (index: number, key: keyof BulkProductRow, value: string) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  };

  const updateRowImages = (index: number, files: File[]) => {
    setRowImages((prev) => {
      const next = { ...prev };
      if (files.length === 0) {
        delete next[index];
      } else {
        next[index] = files;
      }
      return next;
    });
  };

  const handleImport = async () => {
    const accessToken = await getValidAccessToken();
    if (!accessToken) {
      await showValidationError("Session expired. Please login again.");
      return;
    }

    if (rows.length === 0) {
      await showValidationError("আগে CSV বা XLSX ফাইল আপলোড করুন।");
      return;
    }

    const invalidRows = rows.filter((row) => !row.productName.trim() || !row.sku.trim());
    if (invalidRows.length > 0) {
      await showValidationError(`${invalidRows.length}টি row-এ SKU বা Product Name নেই।`);
      return;
    }

    setImporting(true);
    setProgress(0);
    setProgressLabel("প্রস্তুত হচ্ছে...");

    try {
      const total = rows.length;
      const payload = [];

      for (let index = 0; index < total; index++) {
        const row = rows[index];
        const files = rowImages[index] ?? [];
        let uploadedUrls: string[] = [];

        const rowPct = Math.round(((index) / total) * 90);
        setProgress(rowPct);
        setProgressLabel(
          files.length > 0
            ? `ইমেজ আপলোড হচ্ছে... ${index + 1}/${total}`
            : `প্রোডাক্ট প্রসেস হচ্ছে... ${index + 1}/${total}`
        );

        if (files.length > 0) {
          const uploadResult = await uploadProductImages(files, accessToken);
          uploadedUrls = uploadResult.urls;
        }

        const csvImageUrl = row.imageUrl.trim();
        const imageUrls = [
          ...(csvImageUrl ? [csvImageUrl] : []),
          ...uploadedUrls,
        ].filter((url, i, arr) => arr.indexOf(url) === i);

        payload.push(
          prepareBulkRowForApi({
            ...row,
            imageUrls,
          })
        );

        setProgress(Math.round(((index + 1) / total) * 90));
      }

      setProgress(92);
      setProgressLabel("ডাটাবেসে সেভ হচ্ছে...");

      const result = await bulkUploadProducts(payload, accessToken);

      setProgress(100);
      setProgressLabel("সম্পন্ন হয়েছে!");

      const failedHtml =
        result.failed.length > 0
          ? `<p style="margin-top:12px;font-size:13px;color:#dc2626">${result.failed.length}টি row ব্যর্থ হয়েছে।</p>`
          : "";

      await Swal.fire({
        icon: result.failed.length > 0 ? "warning" : "success",
        title: result.failed.length > 0 ? "ইমপোর্ট আংশিক সম্পন্ন" : "ইমপোর্ট সফল হয়েছে!",
        html: `<p style="color:#6b7280;margin-top:8px">${result.created}টি নতুন তৈরি হয়েছে, ${result.updated}টি আপডেট হয়েছে।</p><p style="color:#6b7280;margin-top:8px;font-size:13px">একই SKU ইতিমধ্যে ডাটাবেসে থাকলে আপডেট হয় — প্রোডাক্ট সংখ্যা একই থাকতে পারে।</p>${failedHtml}`,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#f58220",
      });

      onSuccess?.();
      setImporting(false);
      setProgress(0);
      setProgressLabel("");
      resetState();
      onClose();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "ইমপোর্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
      setImporting(false);
      setProgress(0);
      setProgressLabel("");
      await showValidationError(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        disabled={importing}
        aria-label="Close modal"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
        disabled={importing}
      />

      <div
        className={`relative flex w-full flex-col overflow-hidden rounded-xl bg-card shadow-2xl ${
          hasPreview ? "max-h-[85vh] max-w-5xl" : "max-w-md"
        }`}
        aria-busy={importing}
      >
        {importing && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-card/90 px-6 backdrop-blur-[2px]">
            <div className="w-full max-w-sm space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/40">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground">{progress}%</p>
                <p className="mt-1 text-sm text-muted">{progressLabel}</p>
                <p className="mt-2 text-xs text-muted">
                  অনুগ্রহ করে অপেক্ষা করুন — আপলোড চলাকালীন উইন্ডো বন্ধ করবেন না
                </p>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-gray">
                <div
                  className="h-full rounded-full bg-brand-orange transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-brand-border px-4 py-3">
          <div>
            <h2 className="text-base font-bold text-foreground">Bulk Upload</h2>
            {hasPreview && (
              <p className="mt-0.5 text-xs text-muted">
                {fileName} · {rows.length} products
                {selectionMode && selectedIndices.size > 0
                  ? ` · ${selectedIndices.size} selected`
                  : ""}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {hasPreview && (
              <>
                {selectionMode && selectedIndices.size > 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    disabled={importing}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-40 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                  >
                    Delete selected ({selectedIndices.size})
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleToggleBulkDeleteMode}
                  disabled={importing}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-40 ${
                    selectionMode
                      ? "border-brand-border bg-brand-gray text-foreground"
                      : "border-red-200 text-red-500 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30"
                  }`}
                >
                  {selectionMode ? "Cancel select" : "Bulk Delete"}
                </button>
                <button
                  type="button"
                  onClick={handleChangeFile}
                  disabled={importing}
                  className="text-xs font-semibold text-brand-green hover:text-brand-orange disabled:opacity-40"
                >
                  Change file
                </button>
              </>
            )}
            {!hasPreview && (
              <button
                type="button"
                onClick={handleDownloadSample}
                disabled={importing}
                className="text-xs font-semibold text-brand-green hover:text-brand-orange disabled:opacity-40"
              >
                Sample XLSX
              </button>
            )}
          </div>
        </div>

        <div
          className={`flex-1 overflow-y-auto ${hasPreview ? "p-0" : "p-4"} ${
            importing ? "pointer-events-none select-none" : ""
          }`}
        >
          {!hasPreview ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-xl border border-dashed border-brand-border bg-brand-gray/20 px-4 py-6 text-center"
            >
              <p className="text-sm text-muted">CSV বা XLSX ফাইল আপলোড করুন</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={parsing || importing}
                className="mt-3 rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-dark disabled:opacity-60"
              >
                {parsing ? "পার্স হচ্ছে..." : "ফাইল নির্বাচন"}
              </button>
              {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
            </div>
          ) : (
            <BulkUploadPreviewTable
              rows={rows}
              rowImages={rowImages}
              onUpdateRow={updateRow}
              onUpdateImages={updateRowImages}
              onRemoveRow={handleRemoveRow}
              selectionMode={selectionMode}
              selectedIndices={selectedIndices}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
            />
          )}
        </div>

        <div className="flex shrink-0 gap-2 border-t border-brand-border px-4 py-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={importing}
            className="rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-muted hover:bg-brand-gray disabled:cursor-not-allowed disabled:opacity-40"
          >
            বাতিল
          </button>
          {hasPreview && (
            <button
              type="button"
              onClick={() => void handleImport()}
              disabled={importing || rows.length === 0}
              className="ml-auto rounded-lg bg-brand-orange px-4 py-2 text-sm font-bold text-white hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {importing ? `${progress}%` : `ইমপোর্ট (${rows.length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductBulkUploadButton({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl border border-brand-green bg-card px-5 py-2.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green hover:text-white dark:hover:bg-emerald-600 dark:hover:border-emerald-600"
      >
        Bulk Upload
      </button>
      <ProductBulkUploadModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSuccess={onSuccess}
      />
    </>
  );
}
