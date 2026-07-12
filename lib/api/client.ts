import { API_BASE_URL } from "./config";
import type { ApiErrorResponse, ApiSuccessResponse } from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string | null;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, token, headers, ...rest } = options;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Cannot connect to API server. Start the backend with: cd ecommerceos_backend && npm run dev",
      0,
      "NETWORK_ERROR"
    );
  }

  let json: ApiSuccessResponse<T> | ApiErrorResponse;
  try {
    json = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;
  } catch {
    throw new ApiError("Invalid response from API server.", response.status);
  }

  if (!response.ok || !json.success) {
    const message =
      !json.success ? json.error.message : "Request failed";
    const code = !json.success ? json.error.code : undefined;
    throw new ApiError(message, response.status, code);
  }

  return json.data;
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
  token?: string | null
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const json = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;

  if (!response.ok || !json.success) {
    const message =
      !json.success ? json.error.message : "Upload failed";
    const code = !json.success ? json.error.code : undefined;
    throw new ApiError(message, response.status, code);
  }

  return json.data;
}
