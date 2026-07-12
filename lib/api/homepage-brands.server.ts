import { API_BASE_URL, cmsFetchInit } from "./config";
import type { ApiErrorResponse, ApiSuccessResponse } from "./types";

export interface HomepageBrandRecord {
  id: string;
  name: string;
  logoUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export async function fetchHomepageBrands(): Promise<HomepageBrandRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/brands`, cmsFetchInit);

    if (!response.ok) return [];

    const json = (await response.json()) as
      | ApiSuccessResponse<HomepageBrandRecord[]>
      | ApiErrorResponse;
    if (!json.success) return [];

    return json.data;
  } catch {
    return [];
  }
}
