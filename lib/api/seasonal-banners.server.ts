import { API_BASE_URL, cmsFetchInit } from "./config";
import type { ApiErrorResponse, ApiSuccessResponse } from "./types";
import type { Locale } from "@/lib/i18n/config";

export interface SeasonalBannerRecord {
  id: string;
  titleBn: string;
  titleEn: string;
  ctaBn: string;
  ctaEn: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export interface LocalizedSeasonalBanner {
  title: string;
  cta: string;
  image: string;
}

export async function fetchSeasonalBanners(): Promise<SeasonalBannerRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/seasonal-banners`, cmsFetchInit);

    if (!response.ok) return [];

    const json = (await response.json()) as
      | ApiSuccessResponse<SeasonalBannerRecord[]>
      | ApiErrorResponse;
    if (!json.success) return [];

    return json.data;
  } catch {
    return [];
  }
}

export function mapSeasonalBannerForLocale(
  banner: SeasonalBannerRecord,
  locale: Locale
): LocalizedSeasonalBanner {
  return {
    title: locale === "bn" ? banner.titleBn : banner.titleEn,
    cta: locale === "bn" ? banner.ctaBn : banner.ctaEn,
    image: banner.imageUrl,
  };
}

export function pickHomepageSeasonalBanner(
  banners: SeasonalBannerRecord[],
  locale: Locale
): LocalizedSeasonalBanner | null {
  const active = banners.filter((banner) => banner.isActive);
  if (active.length === 0) return null;

  const sorted = [...active].sort((a, b) => a.sortOrder - b.sortOrder);
  return mapSeasonalBannerForLocale(sorted[0], locale);
}
