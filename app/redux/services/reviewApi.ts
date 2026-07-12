import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export interface ProductReview {
  id: string;
  productId: string;
  customerId: string | null;
  authorName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface ProductReviewSummary {
  averageRating: number;
  totalReviews: number;
  reviews: ProductReview[];
}

export interface CreateReviewInput {
  authorName: string;
  rating: number;
  comment: string;
}

export interface AdminProductReview extends ProductReview {
  productName: string;
  productSlug: string;
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query<ProductReviewSummary, string>({
      query: (slug) => `/reviews/public/${slug}`,
      transformResponse: (response: ApiSuccessResponse<ProductReviewSummary>) => response.data,
      providesTags: (_result, _error, slug) => [{ type: "Review", id: slug }],
    }),
    createProductReview: builder.mutation<
      ProductReview,
      { slug: string; body: CreateReviewInput }
    >({
      query: ({ slug, body }) => ({
        url: `/reviews/public/${slug}`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<ProductReview>) => response.data,
      invalidatesTags: (_result, _error, { slug }) => [{ type: "Review", id: slug }],
    }),
    listAllReviews: builder.query<AdminProductReview[], void>({
      query: () => "/reviews/admin/all",
      transformResponse: (response: ApiSuccessResponse<AdminProductReview[]>) => response.data,
      providesTags: [{ type: "Review", id: "ADMIN_LIST" }],
    }),
    updateReviewStatus: builder.mutation<
      ProductReview,
      { id: string; isApproved: boolean }
    >({
      query: ({ id, isApproved }) => ({
        url: `/reviews/${id}/status`,
        method: "PATCH",
        body: { isApproved },
      }),
      transformResponse: (response: ApiSuccessResponse<ProductReview>) => response.data,
      invalidatesTags: [{ type: "Review", id: "ADMIN_LIST" }],
    }),
    deleteReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Review", id: "ADMIN_LIST" }],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useCreateProductReviewMutation,
  useListAllReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} = reviewApi;
