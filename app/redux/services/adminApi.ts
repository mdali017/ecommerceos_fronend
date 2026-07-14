import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";
import type { OrderStatus } from "./orderApi";

export interface AdminDashboardStats {
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  todaySales: number;
  pendingOrders: number;
  lowStock: number;
}

export interface AdminRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface AdminCustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  source: string;
  orderCount: number;
  completedOrderCount: number;
  createdAt: string;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  recentOrders: AdminRecentOrder[];
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<AdminDashboardData, void>({
      query: () => "/admin/stats",
      transformResponse: (response: ApiSuccessResponse<AdminDashboardData>) => response.data,
      providesTags: [{ type: "Admin", id: "STATS" }],
    }),
    listCustomers: builder.query<AdminCustomerSummary[], void>({
      query: () => "/admin/customers",
      transformResponse: (response: ApiSuccessResponse<AdminCustomerSummary[]>) => response.data,
      providesTags: [{ type: "Admin", id: "CUSTOMERS" }],
    }),
  }),
});

export const { useGetDashboardStatsQuery, useListCustomersQuery } = adminApi;
