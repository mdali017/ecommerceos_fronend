const LOCAL_API_URL = "http://localhost:4000/api/v1";
const PRODUCTION_API_URL = "https://ecommerceos-backend.vercel.app/api/v1";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development" ? LOCAL_API_URL : PRODUCTION_API_URL);

/** Homepage CMS data — always fresh so admin edits show immediately. */
export const cmsFetchInit: RequestInit = { cache: "no-store" };
