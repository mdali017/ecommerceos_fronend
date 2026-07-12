import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export interface ShippingZone {
  id: string;
  name: string;
  nameBn: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  isActive: boolean;
  sortOrder: number;
}

export interface ShippingQuote {
  zoneId: string | null;
  zoneName: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  estimatedDelivery: string;
  isFreeDelivery: boolean;
}

export interface ShippingZoneInput {
  name: string;
  nameBn?: string;
  deliveryFee: number;
  freeDeliveryThreshold?: number;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  isActive?: boolean;
  sortOrder?: number;
}

export const shippingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listShippingZones: builder.query<ShippingZone[], void>({
      query: () => "/shipping/zones",
      transformResponse: (response: ApiSuccessResponse<ShippingZone[]>) => response.data,
      providesTags: [{ type: "Shipping", id: "ZONES" }],
    }),
    listAllShippingZones: builder.query<ShippingZone[], void>({
      query: () => "/shipping/admin/zones",
      transformResponse: (response: ApiSuccessResponse<ShippingZone[]>) => response.data,
      providesTags: [{ type: "Shipping", id: "ADMIN_ZONES" }],
    }),
    getShippingQuote: builder.mutation<
      ShippingQuote,
      { subtotal: number; zoneId?: string; freeShipping?: boolean }
    >({
      query: (body) => ({ url: "/shipping/quote", method: "POST", body }),
      transformResponse: (response: ApiSuccessResponse<ShippingQuote>) => response.data,
    }),
    createShippingZone: builder.mutation<ShippingZone, ShippingZoneInput>({
      query: (body) => ({ url: "/shipping/admin/zones", method: "POST", body }),
      transformResponse: (response: ApiSuccessResponse<ShippingZone>) => response.data,
      invalidatesTags: [{ type: "Shipping", id: "ADMIN_ZONES" }, { type: "Shipping", id: "ZONES" }],
    }),
    updateShippingZone: builder.mutation<ShippingZone, { id: string; body: Partial<ShippingZoneInput> }>({
      query: ({ id, body }) => ({ url: `/shipping/admin/zones/${id}`, method: "PUT", body }),
      transformResponse: (response: ApiSuccessResponse<ShippingZone>) => response.data,
      invalidatesTags: [{ type: "Shipping", id: "ADMIN_ZONES" }, { type: "Shipping", id: "ZONES" }],
    }),
    deleteShippingZone: builder.mutation<void, string>({
      query: (id) => ({ url: `/shipping/admin/zones/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Shipping", id: "ADMIN_ZONES" }, { type: "Shipping", id: "ZONES" }],
    }),
  }),
});

export const {
  useListShippingZonesQuery,
  useListAllShippingZonesQuery,
  useGetShippingQuoteMutation,
  useCreateShippingZoneMutation,
  useUpdateShippingZoneMutation,
  useDeleteShippingZoneMutation,
} = shippingApi;
