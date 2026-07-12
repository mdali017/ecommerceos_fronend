import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export type ReturnStatus = "pending" | "approved" | "rejected" | "refunded" | "completed";
export type RefundStatus = "pending" | "processing" | "refunded" | "rejected";

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerId: string | null;
  reason: string;
  description: string;
  status: ReturnStatus;
  refundStatus: RefundStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminReturnRequest extends ReturnRequest {
  orderNumber: string;
  customerName: string;
  orderTotal: number;
}

export const returnApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReturnRequest: builder.mutation<
      ReturnRequest,
      { orderId: string; reason: string; description?: string }
    >({
      query: (body) => ({ url: "/returns", method: "POST", body }),
      transformResponse: (response: ApiSuccessResponse<ReturnRequest>) => response.data,
      invalidatesTags: [{ type: "Return", id: "LIST" }],
    }),
    listMyReturns: builder.query<ReturnRequest[], void>({
      query: () => "/returns/me",
      transformResponse: (response: ApiSuccessResponse<ReturnRequest[]>) => response.data,
      providesTags: [{ type: "Return", id: "MY_LIST" }],
    }),
    listAllReturns: builder.query<AdminReturnRequest[], void>({
      query: () => "/returns/admin/all",
      transformResponse: (response: ApiSuccessResponse<AdminReturnRequest[]>) => response.data,
      providesTags: [{ type: "Return", id: "LIST" }],
    }),
    updateReturnStatus: builder.mutation<
      AdminReturnRequest,
      { id: string; status: ReturnStatus; refundStatus?: RefundStatus; adminNotes?: string }
    >({
      query: ({ id, ...body }) => ({ url: `/returns/${id}/status`, method: "PATCH", body }),
      transformResponse: (response: ApiSuccessResponse<AdminReturnRequest>) => response.data,
      invalidatesTags: [{ type: "Return", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateReturnRequestMutation,
  useListMyReturnsQuery,
  useListAllReturnsQuery,
  useUpdateReturnStatusMutation,
} = returnApi;
