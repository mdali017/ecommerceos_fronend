export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

/** Homepage CMS data — always fresh so admin edits show immediately. */
export const cmsFetchInit: RequestInit = { cache: "no-store" };
