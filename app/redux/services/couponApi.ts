import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export type CouponDiscountType = "fixed" | "percent";

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  perUserLimit: number;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  freeShipping: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponValidationResult {
  valid: boolean;
  code: string;
  discountAmount: number;
  freeShipping: boolean;
  message: string;
  couponId?: string;
}

export interface CouponUpsertInput {
  code: string;
  description?: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  perUserLimit?: number;
  startsAt?: string | null;
  expiresAt?: string | null;
  isActive?: boolean;
  freeShipping?: boolean;
}

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    validateCoupon: builder.mutation<
      CouponValidationResult,
      { code: string; subtotal: number }
    >({
      query: (body) => ({
        url: "/coupons/validate",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<CouponValidationResult>) => response.data,
    }),
    listCoupons: builder.query<Coupon[], void>({
      query: () => "/coupons/admin/all",
      transformResponse: (response: ApiSuccessResponse<Coupon[]>) => response.data,
      providesTags: [{ type: "Coupon", id: "LIST" }],
    }),
    createCoupon: builder.mutation<Coupon, CouponUpsertInput>({
      query: (body) => ({
        url: "/coupons",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Coupon>) => response.data,
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),
    updateCoupon: builder.mutation<Coupon, { id: string; body: Partial<CouponUpsertInput> }>({
      query: ({ id, body }) => ({
        url: `/coupons/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Coupon>) => response.data,
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),
    deleteCoupon: builder.mutation<void, string>({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useListCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
