import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export type HomepageSectionType = "grid" | "carousel" | "flash_sale";
export type HomepageProductSource = "featured" | "on_sale" | "category" | "manual";

export interface HomepageProductSection {
  id: string;
  titleBn: string;
  titleEn: string;
  sectionType: HomepageSectionType;
  productSource: HomepageProductSource;
  categorySlug: string;
  categoryKeywords: string;
  productSkus: string;
  maxProducts: number;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomepageProductSectionInput {
  titleBn: string;
  titleEn?: string;
  sectionType?: HomepageSectionType;
  productSource?: HomepageProductSource;
  categorySlug?: string;
  categoryKeywords?: string;
  productSkus?: string;
  maxProducts?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export const homepageProductSectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listHomepageProductSections: builder.query<HomepageProductSection[], void>({
      query: () => "/homepage-product-sections/admin/all",
      transformResponse: (response: ApiSuccessResponse<HomepageProductSection[]>) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "HomepageProductSection" as const,
                id: item.id,
              })),
              { type: "HomepageProductSection" as const, id: "LIST" },
            ]
          : [{ type: "HomepageProductSection" as const, id: "LIST" }],
    }),
    createHomepageProductSection: builder.mutation<
      HomepageProductSection,
      HomepageProductSectionInput
    >({
      query: (body) => ({
        url: "/homepage-product-sections",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<HomepageProductSection>) =>
        response.data,
      invalidatesTags: [{ type: "HomepageProductSection", id: "LIST" }],
    }),
    updateHomepageProductSection: builder.mutation<
      HomepageProductSection,
      { id: string; body: Partial<HomepageProductSectionInput> }
    >({
      query: ({ id, body }) => ({
        url: `/homepage-product-sections/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<HomepageProductSection>) =>
        response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "HomepageProductSection", id },
        { type: "HomepageProductSection", id: "LIST" },
      ],
    }),
    deleteHomepageProductSection: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/homepage-product-sections/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiSuccessResponse<{ id: string }>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: "HomepageProductSection", id },
        { type: "HomepageProductSection", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useListHomepageProductSectionsQuery,
  useCreateHomepageProductSectionMutation,
  useUpdateHomepageProductSectionMutation,
  useDeleteHomepageProductSectionMutation,
} = homepageProductSectionApi;
