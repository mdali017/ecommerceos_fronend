import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export interface Testimonial {
  id: string;
  nameBn: string;
  nameEn: string;
  reviewBn: string;
  reviewEn: string;
  rating: number;
  avatar: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimonialInput {
  nameBn: string;
  nameEn?: string;
  reviewBn: string;
  reviewEn?: string;
  rating?: number;
  avatar?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const testimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTestimonials: builder.query<Testimonial[], void>({
      query: () => "/testimonials",
      transformResponse: (response: ApiSuccessResponse<Testimonial[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "Testimonial" as const,
                id: item.id,
              })),
              { type: "Testimonial" as const, id: "LIST" },
            ]
          : [{ type: "Testimonial" as const, id: "LIST" }],
    }),
    listAllTestimonials: builder.query<Testimonial[], void>({
      query: () => "/testimonials/admin/all",
      transformResponse: (response: ApiSuccessResponse<Testimonial[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "Testimonial" as const,
                id: item.id,
              })),
              { type: "Testimonial" as const, id: "LIST" },
            ]
          : [{ type: "Testimonial" as const, id: "LIST" }],
    }),
    createTestimonial: builder.mutation<Testimonial, TestimonialInput>({
      query: (body) => ({
        url: "/testimonials",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Testimonial>) => response.data,
      invalidatesTags: [{ type: "Testimonial", id: "LIST" }],
    }),
    updateTestimonial: builder.mutation<
      Testimonial,
      { id: string; body: Partial<TestimonialInput> }
    >({
      query: ({ id, body }) => ({
        url: `/testimonials/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Testimonial>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Testimonial", id },
        { type: "Testimonial", id: "LIST" },
      ],
    }),
    deleteTestimonial: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/testimonials/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiSuccessResponse<{ id: string }>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: "Testimonial", id },
        { type: "Testimonial", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListTestimonialsQuery,
  useListAllTestimonialsQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = testimonialApi;
