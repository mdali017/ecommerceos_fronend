import { baseApi } from "../baseApi/baseApi";
import type { ApiSuccessResponse } from "@/lib/api/types";

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  slug: string;
  sellingPrice: number;
  offerPrice: number;
  unit: string;
  packSize: string;
  imageUrl: string;
  inStock: boolean;
  createdAt: string;
}

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listWishlist: builder.query<WishlistItem[], void>({
      query: () => "/wishlist",
      transformResponse: (response: ApiSuccessResponse<WishlistItem[]>) => response.data,
      providesTags: [{ type: "Wishlist", id: "LIST" }],
    }),
    listWishlistIds: builder.query<string[], void>({
      query: () => "/wishlist/ids",
      transformResponse: (response: ApiSuccessResponse<string[]>) => response.data,
      providesTags: [{ type: "Wishlist", id: "IDS" }],
    }),
    addToWishlist: builder.mutation<WishlistItem, string>({
      query: (productId) => ({
        url: "/wishlist",
        method: "POST",
        body: { productId },
      }),
      transformResponse: (response: ApiSuccessResponse<WishlistItem>) => response.data,
      invalidatesTags: [
        { type: "Wishlist", id: "LIST" },
        { type: "Wishlist", id: "IDS" },
      ],
    }),
    removeFromWishlist: builder.mutation<void, string>({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Wishlist", id: "LIST" },
        { type: "Wishlist", id: "IDS" },
      ],
    }),
  }),
});

export const {
  useListWishlistQuery,
  useListWishlistIdsQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
