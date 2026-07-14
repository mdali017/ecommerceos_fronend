import type { Product } from "@/lib/api/products";
import { productsToSampleSheetValues } from "@/lib/product-bulk-upload";

export const SHEET_EXPORT_STORAGE_KEY = "admin_google_sheet_export";

const GOOGLE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

export function getGoogleClientId() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  if (!clientId) {
    throw new Error(
      "Google Client ID is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your frontend .env file."
    );
  }
  return clientId;
}

export function getGoogleSheetCallbackUrl() {
  if (typeof window === "undefined") {
    return "/admin/products/connect-sheet/callback";
  }
  return `${window.location.origin}/admin/products/connect-sheet/callback`;
}

export function buildGoogleSheetOAuthUrl() {
  const clientId = getGoogleClientId();
  const redirectUri = getGoogleSheetCallbackUrl();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "token",
    scope: GOOGLE_SHEETS_SCOPE,
    include_granted_scopes: "true",
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function storeSampleSheetExport(products: Product[]) {
  sessionStorage.setItem(
    SHEET_EXPORT_STORAGE_KEY,
    JSON.stringify(productsToSampleSheetValues(products))
  );
}

export function readStoredSheetExport(): string[][] {
  const raw = sessionStorage.getItem(SHEET_EXPORT_STORAGE_KEY);
  if (!raw) {
    throw new Error("Sheet export data not found. Go back and click Connect Sheet again.");
  }

  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid sheet export data.");
  }

  return parsed as string[][];
}

export function clearStoredSheetExport() {
  sessionStorage.removeItem(SHEET_EXPORT_STORAGE_KEY);
}

function columnLetter(count: number) {
  let letter = "";
  let num = Math.max(1, count);

  while (num > 0) {
    const remainder = (num - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    num = Math.floor((num - 1) / 26);
  }

  return letter;
}

async function createSpreadsheet(accessToken: string, title: string) {
  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [{ properties: { title: "Products" } }],
    }),
  });

  const data = (await response.json()) as {
    spreadsheetId?: string;
    spreadsheetUrl?: string;
    error?: { message?: string };
  };

  if (!response.ok || !data.spreadsheetId || !data.spreadsheetUrl) {
    throw new Error(data.error?.message ?? "Failed to create Google Sheet.");
  }

  return {
    spreadsheetId: data.spreadsheetId,
    spreadsheetUrl: data.spreadsheetUrl,
  };
}

async function writeSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  values: string[][]
) {
  const range = `Products!A1:${columnLetter(values[0]?.length ?? 1)}${values.length}`;
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values }),
    }
  );

  const data = (await response.json()) as { error?: { message?: string } };
  if (!response.ok) {
    throw new Error(data.error?.message ?? "Failed to write product data to Google Sheet.");
  }
}

export async function createGoogleSheetFromValues(accessToken: string, values: string[][]) {
  const sheetTitle = `Ecommerce OS Products Sample - ${new Date().toLocaleDateString("en-GB")}`;
  const { spreadsheetId, spreadsheetUrl } = await createSpreadsheet(accessToken, sheetTitle);
  await writeSpreadsheetValues(accessToken, spreadsheetId, values);
  return spreadsheetUrl;
}

export function parseAccessTokenFromHash(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const accessToken = params.get("access_token");
  const error = params.get("error");

  if (error) {
    throw new Error(
      error === "access_denied"
        ? "Google access denied. Add your Gmail as a Test user in Google Cloud Console."
        : params.get("error_description") ?? "Google sign-in failed."
    );
  }

  if (!accessToken) {
    throw new Error("Google access token not found. Please try Connect Sheet again.");
  }

  return accessToken;
}

export const LAST_SHEET_URL_KEY = "admin_last_google_sheet_url";
