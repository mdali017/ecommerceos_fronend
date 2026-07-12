import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { adminLogout, updateAdminTokens } from "../features/admin/adminSlice";
import type { RootState } from "../store";
import { API_BASE_URL } from "@/lib/api/config";
import type { ApiSuccessResponse, AuthTokens } from "@/lib/api/types";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.admin.accessToken ?? state.auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.admin.refreshToken;

    if (!refreshToken) return result;

    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    const refreshData = refreshResult.data as
      | ApiSuccessResponse<{ tokens: AuthTokens }>
      | undefined;

    if (refreshData?.success) {
      api.dispatch(updateAdminTokens(refreshData.data.tokens));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(adminLogout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Category", "HeroSlide", "SeasonalBanner", "HomepageBrand", "PromoBanner", "Testimonial", "Auth", "Order"],
  endpoints: () => ({}),
});

export default baseApi;
