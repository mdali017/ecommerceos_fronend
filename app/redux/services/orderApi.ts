import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";

export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  productSlug: string | null;
  productImage: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  status: OrderStatus;
  paymentMethod: string;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  notes: string;
  itemCount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  createdAt: string;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  paymentMethod?: "cod";
  notes?: string;
  items: {
    productId: string;
    productName?: string;
    productSlug?: string;
    productImage?: string;
    unitPrice?: number;
    quantity: number;
  }[];
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderInput>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Order>) => response.data,
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
    listMyOrders: builder.query<OrderSummary[], void>({
      query: () => "/orders/me",
      transformResponse: (response: ApiSuccessResponse<OrderSummary[]>) => response.data,
      providesTags: [{ type: "Order", id: "MY_LIST" }],
    }),
    listAllOrders: builder.query<OrderSummary[], OrderStatus | void>({
      query: (status) =>
        status ? `/orders/admin/all?status=${status}` : "/orders/admin/all",
      transformResponse: (response: ApiSuccessResponse<OrderSummary[]>) => response.data,
      providesTags: [{ type: "Order", id: "LIST" }],
    }),
    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: (response: ApiSuccessResponse<Order>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
    updateOrderStatus: builder.mutation<
      Order,
      { id: string; status: OrderStatus }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: ApiSuccessResponse<Order>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Order", id },
        { type: "Order", id: "LIST" },
        { type: "Order", id: "MY_LIST" },
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useListMyOrdersQuery,
  useListAllOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
