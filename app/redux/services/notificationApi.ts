import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export type NotificationType = "order_placed" | "order_status" | "promo" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listNotifications: builder.query<Notification[], void>({
      query: () => "/notifications",
      transformResponse: (response: ApiSuccessResponse<Notification[]>) => response.data,
      providesTags: [{ type: "Notification", id: "LIST" }],
    }),
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => "/notifications/unread-count",
      transformResponse: (response: ApiSuccessResponse<{ count: number }>) => response.data,
      providesTags: [{ type: "Notification", id: "COUNT" }],
    }),
    markNotificationRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiSuccessResponse<Notification>) => response.data,
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "COUNT" },
      ],
    }),
    markAllNotificationsRead: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "COUNT" },
      ],
    }),
  }),
});

export const {
  useListNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationApi;
