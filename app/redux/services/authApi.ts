import { baseApi } from "../baseApi/baseApi";
import type {
  AdminAuthData,
  ApiSuccessResponse,
  AuthTokens,
  CustomerAuthData,
  CustomerProfile,
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

export interface CustomerUpdateProfileInput {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface CustomerUpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

interface MeResponse {
  role: "customer" | "admin";
  user: CustomerProfile | { id: string; name: string; email: string };
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
    getMe: builder.query<CustomerProfile, void>({
      query: () => "/auth/me",
      transformResponse: (response: ApiSuccessResponse<MeResponse>) => {
        if (response.data.role !== "customer") {
          throw new Error("Not a customer session");
        }
        return response.data.user as CustomerProfile;
      },
      providesTags: [{ type: "Auth", id: "ME" }],
    }),
    updateProfile: builder.mutation<CustomerProfile, CustomerUpdateProfileInput>({
      query: (body) => ({
        url: "/auth/customer/profile",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<CustomerProfile>) =>
        response.data,
      invalidatesTags: [{ type: "Auth", id: "ME" }],
    }),
    updatePassword: builder.mutation<null, CustomerUpdatePasswordInput>({
      query: (body) => ({
        url: "/auth/customer/password",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<null>) => response.data,
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
  useGetMeQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useLoginAdminMutation,
  useLogoutMutation,
  useRefreshAuthMutation,
} = authApi;
