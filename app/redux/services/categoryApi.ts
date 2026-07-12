import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  icon: string;
  parentId: string | null;
  sortOrder: number;
  keywords: string;
  isActive: boolean;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryInput {
  slug: string;
  name: string;
  nameBn: string;
  icon: string;
  sortOrder?: number;
  keywords?: string;
  isActive?: boolean;
  parentId?: string | null;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCategories: builder.query<Category[], void>({
      query: () => "/categories",
      transformResponse: (response: ApiSuccessResponse<Category[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((category) => ({
                type: "Category" as const,
                id: category.id,
              })),
              { type: "Category" as const, id: "LIST" },
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),
    listAllCategories: builder.query<Category[], void>({
      query: () => "/categories/admin/all",
      transformResponse: (response: ApiSuccessResponse<Category[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((category) => ({
                type: "Category" as const,
                id: category.id,
              })),
              { type: "Category" as const, id: "LIST" },
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),
    createCategory: builder.mutation<Category, CategoryInput>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Category>) => response.data,
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: builder.mutation<
      Category,
      { id: string; body: Partial<CategoryInput> }
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiSuccessResponse<Category>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
    deleteCategory: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiSuccessResponse<{ id: string }>) =>
        response.data,
      invalidatesTags: (_result, _error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
    uploadCategoryIcon: builder.mutation<{ url: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("icon", file);

        return {
          url: "/categories/upload-icon",
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: ApiSuccessResponse<{ url: string }>) =>
        response.data,
    }),
  }),
});

export const {
  useListCategoriesQuery,
  useListAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUploadCategoryIconMutation,
} = categoryApi;
