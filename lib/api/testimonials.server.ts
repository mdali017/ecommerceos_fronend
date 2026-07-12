import { API_BASE_URL, cmsFetchInit } from "./config";
import type { ApiErrorResponse, ApiSuccessResponse } from "./types";
import type { Locale } from "@/lib/i18n/config";
import type { Testimonial } from "@/lib/i18n/types";

export interface TestimonialRecord {
  id: string;
  nameBn: string;
  nameEn: string;
  reviewBn: string;
  reviewEn: string;
  rating: number;
  avatar: string;
  sortOrder: number;
  isActive: boolean;
}

export async function fetchTestimonials(): Promise<TestimonialRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/testimonials`, cmsFetchInit);

    if (!response.ok) return [];

    const json = (await response.json()) as
      | ApiSuccessResponse<TestimonialRecord[]>
      | ApiErrorResponse;
    if (!json.success) return [];

    return json.data;
  } catch {
    return [];
  }
}

export function mapTestimonialsForLocale(
  testimonials: TestimonialRecord[],
  locale: Locale
): Testimonial[] {
  return testimonials
    .filter((item) => item.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => {
      const name =
        locale === "bn" ? item.nameBn : item.nameEn.trim() || item.nameBn;
      const review =
        locale === "bn" ? item.reviewBn : item.reviewEn.trim() || item.reviewBn;
      const avatar =
        locale === "en" && item.nameEn.trim()
          ? item.nameEn.trim().charAt(0).toUpperCase()
          : item.avatar || item.nameBn.charAt(0) || "?";

      return {
        id: item.id,
        name,
        review,
        rating: item.rating,
        avatar,
      };
    });
}
