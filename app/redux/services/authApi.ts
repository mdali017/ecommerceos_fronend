import { baseApi } from "../baseApi/baseApi";
import type {
  AdminAuthData,
  ApiSuccessResponse,
  AuthTokens,
  CustomerAuthData,
} from "@/lib/api/types";

export interface CustomerLoginInput {
  identifier: string;
  password: string;
  method: "phone" | "email";
}

export interface CustomerRegisterInput {
  name: string;
  phone: string;
  email: string;
  address: string;
  source?: "campaign" | "default" | "checkout";
  password?: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginCustomer: builder.mutation<CustomerAuthData, CustomerLoginInput>({
      query: (body) => ({
        url: "/auth/customer/login",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<CustomerAuthData>) =>
        response.data,
    }),
    registerCustomer: builder.mutation<CustomerAuthData, CustomerRegisterInput>({
      query: (body) => ({
        url: "/auth/customer/register",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<CustomerAuthData>) =>
        response.data,
    }),
    loginAdmin: builder.mutation<AdminAuthData, AdminLoginInput>({
      query: (body) => ({
        url: "/auth/admin/login",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<AdminAuthData>) =>
        response.data,
    }),
    logout: builder.mutation<null, string>({
      query: (refreshToken) => ({
        url: "/auth/logout",
        method: "POST",
        body: { refreshToken },
      }),
      transformResponse: (response: ApiSuccessResponse<null>) => response.data,
    }),
    refreshAuth: builder.mutation<{ tokens: AuthTokens }, string>({
      query: (refreshToken) => ({
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken },
      }),
      transformResponse: (
        response: ApiSuccessResponse<{ tokens: AuthTokens }>
      ) => response.data,
    }),
  }),
});

export const {
  useLoginCustomerMutation,
  useRegisterCustomerMutation,
  useLoginAdminMutation,
  useLogoutMutation,
  useRefreshAuthMutation,
} = authApi;
