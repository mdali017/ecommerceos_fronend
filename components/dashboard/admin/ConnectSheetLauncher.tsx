"use client";

import { useEffect } from "react";
import { buildGoogleSheetOAuthUrl } from "@/lib/google-sheets";

export function ConnectSheetLauncher() {
  useEffect(() => {
    try {
      window.location.replace(buildGoogleSheetOAuthUrl());
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not start Google sign-in.";
      document.body.innerHTML = `
        <div style="font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;background:#fff5f5;color:#991b1b;padding:24px;text-align:center;">
          <div>
            <p style="font-size:18px;font-weight:700;margin:0 0 8px;">Connect Sheet Failed</p>
            <p style="font-size:14px;margin:0;">${message}</p>
          </div>
        </div>
      `;
    }
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-lg font-bold text-foreground">Connecting to Google...</p>
      <p className="mt-2 text-sm text-muted">Please complete Google sign-in to create your sheet.</p>
    </div>
  );
}
