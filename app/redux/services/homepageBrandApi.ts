import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export interface HomepageBrand {
  id: string;
  name: string;
  logoUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomepageBrandInput {
  name: string;
  logoUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const homepageBrandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listHomepageBrands: builder.query<HomepageBrand[], void>({
      query: () => "/brands",
      transformResponse: (response: ApiSuccessResponse<HomepageBrand[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((brand) => ({
                type: "HomepageBrand" as const,
                id: brand.id,
              })),
              { type: "HomepageBrand" as const, id: "LIST" },
            ]
          : [{ type: "HomepageBrand" as const, id: "LIST" }],
    }),
    listAllHomepageBrands: builder.query<HomepageBrand[], void>({
      query: () => "/brands/admin/all",
      transformResponse: (response: ApiSuccessResponse<HomepageBrand[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((brand) => ({
                type: "HomepageBrand" as const,
                id: brand.id,
              })),
              { type: "HomepageBrand" as const, id: "LIST" },
            ]
          : [{ type: "HomepageBrand" as const, id: "LIST" }],
    }),
    createHomepageBrand: builder.mutation<HomepageBrand, HomepageBrandInput>({
      query: (body) => ({
        url: "/brands",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<HomepageBrand>) => response.data,
      invalidatesTags: [{ type: "HomepageBrand", id: "LIST" }],
    }),
    updateHomepageBrand: builder.mutation<
      HomepageBrand,
      { id: string; body: Partial<HomepageBrandInput> }
    >({
      query: ({ id, body }) => ({
        url: `/brands/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<HomepageBrand>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "HomepageBrand", id },
        { type: "HomepageBrand", id: "LIST" },
      ],
    }),
    deleteHomepageBrand: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiSuccessResponse<{ id: string }>) => response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: "HomepageBrand", id },
        { type: "HomepageBrand", id: "LIST" },
      ],
    }),
    uploadHomepageBrandLogo: builder.mutation<{ url: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("logo", file);

        return {
          url: "/brands/upload-logo",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: ApiSuccessResponse<{ url: string }>) => response.data,
    }),
  }),
});

export const {
  useListHomepageBrandsQuery,
  useListAllHomepageBrandsQuery,
  useCreateHomepageBrandMutation,
  useUpdateHomepageBrandMutation,
  useDeleteHomepageBrandMutation,
  useUploadHomepageBrandLogoMutation,
} = homepageBrandApi;
