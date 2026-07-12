import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export interface HeroSlide {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  ctaBn: string;
  ctaEn: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroSlideInput {
  titleBn: string;
  titleEn: string;
  subtitleBn?: string;
  subtitleEn?: string;
  ctaBn?: string;
  ctaEn?: string;
  imageUrl: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const heroSlideApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listHeroSlides: builder.query<HeroSlide[], void>({
      query: () => "/hero-slides",
      transformResponse: (response: ApiSuccessResponse<HeroSlide[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((slide) => ({
                type: "HeroSlide" as const,
                id: slide.id,
              })),
              { type: "HeroSlide" as const, id: "LIST" },
            ]
          : [{ type: "HeroSlide" as const, id: "LIST" }],
    }),
    listAllHeroSlides: builder.query<HeroSlide[], void>({
      query: () => "/hero-slides/admin/all",
      transformResponse: (response: ApiSuccessResponse<HeroSlide[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((slide) => ({
                type: "HeroSlide" as const,
                id: slide.id,
              })),
              { type: "HeroSlide" as const, id: "LIST" },
            ]
          : [{ type: "HeroSlide" as const, id: "LIST" }],
    }),
    createHeroSlide: builder.mutation<HeroSlide, HeroSlideInput>({
      query: (body) => ({
        url: "/hero-slides",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<HeroSlide>) => response.data,
      invalidatesTags: [{ type: "HeroSlide", id: "LIST" }],
    }),
    updateHeroSlide: builder.mutation<
      HeroSlide,
      { id: string; body: Partial<HeroSlideInput> }
    >({
      query: ({ id, body }) => ({
        url: `/hero-slides/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<HeroSlide>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "HeroSlide", id },
        { type: "HeroSlide", id: "LIST" },
      ],
    }),
    deleteHeroSlide: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/hero-slides/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiSuccessResponse<{ id: string }>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: "HeroSlide", id },
        { type: "HeroSlide", id: "LIST" },
      ],
    }),
    uploadHeroSlideImage: builder.mutation<{ url: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("image", file);

        return {
          url: "/hero-slides/upload-image",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: ApiSuccessResponse<{ url: string }>) => response.data,
    }),
  }),
});

export const {
  useListHeroSlidesQuery,
  useListAllHeroSlidesQuery,
  useCreateHeroSlideMutation,
  useUpdateHeroSlideMutation,
  useDeleteHeroSlideMutation,
  useUploadHeroSlideImageMutation,
} = heroSlideApi;
