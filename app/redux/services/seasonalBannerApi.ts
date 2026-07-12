import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export interface SeasonalBanner {
  id: string;
  titleBn: string;
  titleEn: string;
  ctaBn: string;
  ctaEn: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SeasonalBannerInput {
  titleBn: string;
  titleEn: string;
  ctaBn?: string;
  ctaEn?: string;
  imageUrl: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const seasonalBannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listSeasonalBanners: builder.query<SeasonalBanner[], void>({
      query: () => "/seasonal-banners",
      transformResponse: (response: ApiSuccessResponse<SeasonalBanner[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((banner) => ({
                type: "SeasonalBanner" as const,
                id: banner.id,
              })),
              { type: "SeasonalBanner" as const, id: "LIST" },
            ]
          : [{ type: "SeasonalBanner" as const, id: "LIST" }],
    }),
    listAllSeasonalBanners: builder.query<SeasonalBanner[], void>({
      query: () => "/seasonal-banners/admin/all",
      transformResponse: (response: ApiSuccessResponse<SeasonalBanner[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((banner) => ({
                type: "SeasonalBanner" as const,
                id: banner.id,
              })),
              { type: "SeasonalBanner" as const, id: "LIST" },
            ]
          : [{ type: "SeasonalBanner" as const, id: "LIST" }],
    }),
    createSeasonalBanner: builder.mutation<SeasonalBanner, SeasonalBannerInput>({
      query: (body) => ({
        url: "/seasonal-banners",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<SeasonalBanner>) => response.data,
      invalidatesTags: [{ type: "SeasonalBanner", id: "LIST" }],
    }),
    updateSeasonalBanner: builder.mutation<
      SeasonalBanner,
      { id: string; body: Partial<SeasonalBannerInput> }
    >({
      query: ({ id, body }) => ({
        url: `/seasonal-banners/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<SeasonalBanner>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SeasonalBanner", id },
        { type: "SeasonalBanner", id: "LIST" },
      ],
    }),
    deleteSeasonalBanner: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/seasonal-banners/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiSuccessResponse<{ id: string }>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: "SeasonalBanner", id },
        { type: "SeasonalBanner", id: "LIST" },
      ],
    }),
    uploadSeasonalBannerImage: builder.mutation<{ url: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("image", file);

        return {
          url: "/seasonal-banners/upload-image",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: ApiSuccessResponse<{ url: string }>) => response.data,
    }),
  }),
});

export const {
  useListSeasonalBannersQuery,
  useListAllSeasonalBannersQuery,
  useCreateSeasonalBannerMutation,
  useUpdateSeasonalBannerMutation,
  useDeleteSeasonalBannerMutation,
  useUploadSeasonalBannerImageMutation,
} = seasonalBannerApi;
