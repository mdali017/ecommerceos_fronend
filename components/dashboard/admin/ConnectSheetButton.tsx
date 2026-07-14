"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/api/products";
import { LAST_SHEET_URL_KEY, storeSampleSheetExport } from "@/lib/google-sheets";
import Swal from "sweetalert2";

const CONNECT_SHEET_PATH = "/admin/products/connect-sheet";

export function ConnectSheetButton({ products }: { products: Product[] }) {
  const [lastSheetUrl, setLastSheetUrl] = useState<string | null>(null);

  useEffect(() => {
    setLastSheetUrl(sessionStorage.getItem(LAST_SHEET_URL_KEY));
  }, []);

  const handleConnect = async () => {
    try {
      storeSampleSheetExport(products);
      const sheetTab = window.open(CONNECT_SHEET_PATH, "_blank");

      if (!sheetTab) {
        await Swal.fire({
          icon: "warning",
          title: "Pop-up Blocked",
          text: "Allow pop-ups for this site, then click Connect Sheet again.",
          confirmButtonColor: "#f58220",
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not start Google Sheet connection.";

      await Swal.fire({
        icon: "error",
        title: "Connect Sheet Failed",
        text: message,
        confirmButtonColor: "#f58220",
      });
    }
  };

  const handleOpenLastSheet = () => {
    if (!lastSheetUrl) return;
    window.open(lastSheetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => void handleConnect()}
        className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:border-blue-700 dark:hover:bg-blue-950/60"
      >
        Connect Sheet
      </button>

      {lastSheetUrl ? (
        <button
          type="button"
          onClick={handleOpenLastSheet}
          className="rounded-xl border border-brand-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-brand-gray"
        >
          Open Last Sheet
        </button>
      ) : null}
    </div>
  );
}
