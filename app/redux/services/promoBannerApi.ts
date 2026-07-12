import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export interface PromoBanner {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PromoBannerInput {
  titleBn: string;
  titleEn: string;
  subtitleBn?: string;
  subtitleEn?: string;
  imageUrl: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const promoBannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPromoBanners: builder.query<PromoBanner[], void>({
      query: () => "/promo-banners",
      transformResponse: (response: ApiSuccessResponse<PromoBanner[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((banner) => ({
                type: "PromoBanner" as const,
                id: banner.id,
              })),
              { type: "PromoBanner" as const, id: "LIST" },
            ]
          : [{ type: "PromoBanner" as const, id: "LIST" }],
    }),
    listAllPromoBanners: builder.query<PromoBanner[], void>({
      query: () => "/promo-banners/admin/all",
      transformResponse: (response: ApiSuccessResponse<PromoBanner[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((banner) => ({
                type: "PromoBanner" as const,
                id: banner.id,
              })),
              { type: "PromoBanner" as const, id: "LIST" },
            ]
          : [{ type: "PromoBanner" as const, id: "LIST" }],
    }),
    createPromoBanner: builder.mutation<PromoBanner, PromoBannerInput>({
      query: (body) => ({
        url: "/promo-banners",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<PromoBanner>) => response.data,
      invalidatesTags: [{ type: "PromoBanner", id: "LIST" }],
    }),
    updatePromoBanner: builder.mutation<
      PromoBanner,
      { id: string; body: Partial<PromoBannerInput> }
    >({
      query: ({ id, body }) => ({
        url: `/promo-banners/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<PromoBanner>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PromoBanner", id },
        { type: "PromoBanner", id: "LIST" },
      ],
    }),
    deletePromoBanner: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/promo-banners/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiSuccessResponse<{ id: string }>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: "PromoBanner", id },
        { type: "PromoBanner", id: "LIST" },
      ],
    }),
    uploadPromoBannerImage: builder.mutation<{ url: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("image", file);

        return {
          url: "/promo-banners/upload-image",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: ApiSuccessResponse<{ url: string }>) => response.data,
    }),
  }),
});

export const {
  useListPromoBannersQuery,
  useListAllPromoBannersQuery,
  useCreatePromoBannerMutation,
  useUpdatePromoBannerMutation,
  useDeletePromoBannerMutation,
  useUploadPromoBannerImageMutation,
} = promoBannerApi;
