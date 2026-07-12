import { apiRequest } from "./client";
import type { AdminAuthData, AuthTokens, CustomerAuthData } from "./types";

export function loginCustomer(input: {
  identifier: string;
  password: string;
  method: "phone" | "email";
}) {
  return apiRequest<CustomerAuthData>("/auth/customer/login", {
    method: "POST",
    body: input,
  });
}

export function registerCustomer(input: {
  name: string;
  phone: string;
  email: string;
  address: string;
  source?: "campaign" | "default" | "checkout";
  password?: string;
}) {
  return apiRequest<CustomerAuthData>("/auth/customer/register", {
    method: "POST",
    body: input,
  });
}

export function loginAdmin(input: { email: string; password: string }) {
  return apiRequest<AdminAuthData>("/auth/admin/login", {
    method: "POST",
    body: input,
  });
}

export function logout(refreshToken: string) {
  return apiRequest<null>("/auth/logout", {
    method: "POST",
    body: { refreshToken },
  });
}

export function refreshAuth(refreshToken: string) {
  return apiRequest<{ tokens: AuthTokens }>("/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });
}
