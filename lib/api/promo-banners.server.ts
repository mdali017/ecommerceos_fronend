import { API_BASE_URL, cmsFetchInit } from "./config";
import type { ApiErrorResponse, ApiSuccessResponse } from "./types";
import type { Locale } from "@/lib/i18n/config";

export interface PromoBannerRecord {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export interface LocalizedPromoBanner {
  title: string;
  subtitle: string;
  image: string;
}

export async function fetchPromoBanners(): Promise<PromoBannerRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/promo-banners`, cmsFetchInit);

    if (!response.ok) return [];

    const json = (await response.json()) as
      | ApiSuccessResponse<PromoBannerRecord[]>
      | ApiErrorResponse;
    if (!json.success) return [];

    return json.data;
  } catch {
    return [];
  }
}

export function mapPromoBannerForLocale(
  banner: PromoBannerRecord,
  locale: Locale
): LocalizedPromoBanner {
  return {
    title: locale === "bn" ? banner.titleBn : banner.titleEn,
    subtitle: locale === "bn" ? banner.subtitleBn : banner.subtitleEn,
    image: banner.imageUrl,
  };
}

export function pickHomepagePromoBanner(
  banners: PromoBannerRecord[],
  locale: Locale
): LocalizedPromoBanner | null {
  const active = banners.filter((banner) => banner.isActive);
  if (active.length === 0) return null;

  const sorted = [...active].sort((a, b) => a.sortOrder - b.sortOrder);
  return mapPromoBannerForLocale(sorted[0], locale);
}
