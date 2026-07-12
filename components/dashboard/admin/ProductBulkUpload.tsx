"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  type BulkProductRow,
  getSampleCsvContent,
  mapRawRowsToBulkProducts,
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
  const [error, setError] = useState("");

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
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleClose]);

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
    const blob = new Blob([getSampleCsvContent()], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "product-bulk-upload-sample.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleChangeFile = () => {
    clearRowImages(rowImagesRef.current);
    setRows([]);
    setRowImages({});
    setFileName("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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

    try {
      const payload = await Promise.all(
        rows.map(async (row, index) => {
          const files = rowImages[index] ?? [];
          let uploadedUrls: string[] = [];

          if (files.length > 0) {
            const uploadResult = await uploadProductImages(files, accessToken);
            uploadedUrls = uploadResult.urls;
          }

          const csvImageUrl = row.imageUrl.trim();
          const imageUrls = [
            ...(csvImageUrl ? [csvImageUrl] : []),
            ...uploadedUrls,
          ].filter((url, i, arr) => arr.indexOf(url) === i);

          return {
            ...row,
            imageUrls,
          };
        })
      );

      const result = await bulkUploadProducts(payload, accessToken);

      const failedHtml =
        result.failed.length > 0
          ? `<p style="margin-top:12px;font-size:13px;color:#dc2626">${result.failed.length}টি row ব্যর্থ হয়েছে।</p>`
          : "";

      await Swal.fire({
        icon: result.failed.length > 0 ? "warning" : "success",
        title: "Bulk Upload সম্পন্ন",
        html: `<p style="color:#6b7280;margin-top:8px">${result.created}টি নতুন, ${result.updated}টি আপডেট হয়েছে।</p>${failedHtml}`,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#f58220",
      });

      onSuccess?.();
      handleClose();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "ইমপোর্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
      await showValidationError(message);
    } finally {
      setImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close modal"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className={`relative flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl ${
          hasPreview ? "max-h-[85vh] max-w-5xl" : "max-w-md"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-brand-border px-4 py-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Bulk Upload</h2>
            {hasPreview && (
              <p className="mt-0.5 text-xs text-gray-500">
                {fileName} · {rows.length} products
              </p>
            )}
          </div>
          {hasPreview ? (
            <button
              type="button"
              onClick={handleChangeFile}
              className="text-xs font-semibold text-brand-green hover:text-brand-orange"
            >
              Change file
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDownloadSample}
              className="text-xs font-semibold text-brand-green hover:text-brand-orange"
            >
              Sample CSV
            </button>
          )}
        </div>

        <div className={`flex-1 overflow-y-auto ${hasPreview ? "p-0" : "p-4"}`}>
          {!hasPreview ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="rounded-xl border border-dashed border-brand-border bg-brand-gray/20 px-4 py-6 text-center"
            >
              <p className="text-sm text-gray-600">CSV বা XLSX ফাইল আপলোড করুন</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={parsing}
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
            />
          )}
        </div>

        <div className="flex shrink-0 gap-2 border-t border-brand-border px-4 py-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-brand-gray"
          >
            বাতিল
          </button>
          {hasPreview && (
            <button
              type="button"
              onClick={() => void handleImport()}
              disabled={importing}
              className="ml-auto rounded-lg bg-brand-orange px-4 py-2 text-sm font-bold text-white hover:bg-brand-orange-dark disabled:opacity-60"
            >
              {importing ? "ইমপোর্ট..." : `ইমপোর্ট (${rows.length})`}
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
        className="rounded-xl border border-brand-green bg-white px-5 py-2.5 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green hover:text-white"
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
