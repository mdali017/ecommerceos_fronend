"use client";

import { useEffect, useState } from "react";
import {
  clearStoredSheetExport,
  createGoogleSheetFromValues,
  LAST_SHEET_URL_KEY,
  parseAccessTokenFromHash,
  readStoredSheetExport,
} from "@/lib/google-sheets";

export function ConnectSheetCallback() {
  const [message, setMessage] = useState("Creating your Google Sheet...");

  useEffect(() => {
    void (async () => {
      try {
        const accessToken = parseAccessTokenFromHash(window.location.hash);
        const values = readStoredSheetExport();
        const sheetUrl = await createGoogleSheetFromValues(accessToken, values);

        sessionStorage.setItem(LAST_SHEET_URL_KEY, sheetUrl);
        clearStoredSheetExport();

        window.location.replace(sheetUrl);
      } catch (error) {
        const text =
          error instanceof Error ? error.message : "Could not create Google Sheet.";
        setMessage(text);
      }
    })();
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-lg font-bold text-foreground">Google Sheet</p>
      <p className="mt-2 max-w-md text-sm text-muted">{message}</p>
    </div>
  );
}
