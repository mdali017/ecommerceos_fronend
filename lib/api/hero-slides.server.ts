import { API_BASE_URL, cmsFetchInit } from "./config";
import type { ApiErrorResponse, ApiSuccessResponse } from "./types";
import type { Locale } from "@/lib/i18n/config";
import type { HeroSlide } from "@/lib/i18n/types";

export interface HeroSlideRecord {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  ctaBn: string;
  ctaEn: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export async function fetchHeroSlides(): Promise<HeroSlideRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/hero-slides`, cmsFetchInit);

    if (!response.ok) return [];

    const json = (await response.json()) as ApiSuccessResponse<HeroSlideRecord[]> | ApiErrorResponse;
    if (!json.success) return [];

    return json.data;
  } catch {
    return [];
  }
}

export function mapHeroSlidesForLocale(slides: HeroSlideRecord[], locale: Locale): HeroSlide[] {
  return slides
    .filter((slide) => slide.isActive && slide.imageUrl.trim())
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((slide) => ({
      id: slide.id,
      title: locale === "bn" ? slide.titleBn : slide.titleEn,
      subtitle: locale === "bn" ? slide.subtitleBn : slide.subtitleEn,
      cta: locale === "bn" ? slide.ctaBn : slide.ctaEn,
      image: slide.imageUrl,
    }));
}
