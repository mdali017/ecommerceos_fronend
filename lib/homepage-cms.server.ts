import { fetchHomepageBrands } from "@/lib/api/homepage-brands.server";
import { fetchHeroSlides, mapHeroSlidesForLocale } from "@/lib/api/hero-slides.server";
import { fetchPromoBanners, pickHomepagePromoBanner } from "@/lib/api/promo-banners.server";
import {
  fetchSeasonalBanners,
  pickHomepageSeasonalBanner,
} from "@/lib/api/seasonal-banners.server";
import { fetchTestimonials, mapTestimonialsForLocale } from "@/lib/api/testimonials.server";
import type { BrandStripItem } from "@/components/home/BrandStrip";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary, HeroSlide, Testimonial } from "@/lib/i18n/types";
import { HERO_IMAGES } from "@/lib/i18n/shared-content";
import { brandLogos } from "@/lib/data";

export interface HomepagePromoContent {
  title: string;
  subtitle: string;
  image: string;
}

export interface HomepageSeasonalContent {
  title: string;
  cta: string;
  image: string;
}

export interface HomepageCmsContent {
  heroSlides: HeroSlide[];
  seasonalBanner: HomepageSeasonalContent;
  brandStripItems: BrandStripItem[];
  promoBanner: HomepagePromoContent;
  testimonials: Testimonial[];
}

const DEFAULT_PROMO_IMAGE = HERO_IMAGES[2];

export async function getHomepageCmsContent(
  locale: Locale,
  dictionary: Dictionary
): Promise<HomepageCmsContent> {
  const [
    heroSlideRecords,
    seasonalBannerRecords,
    homepageBrandRecords,
    promoBannerRecords,
    testimonialRecords,
  ] = await Promise.all([
    fetchHeroSlides(),
    fetchSeasonalBanners(),
    fetchHomepageBrands(),
    fetchPromoBanners(),
    fetchTestimonials(),
  ]);

  const mappedHeroSlides = mapHeroSlidesForLocale(heroSlideRecords, locale);
  const heroSlides = mappedHeroSlides.length > 0 ? mappedHeroSlides : dictionary.heroSlides;

  const seasonalBanner =
    pickHomepageSeasonalBanner(seasonalBannerRecords, locale) ?? dictionary.seasonalBanner;

  const brandStripItems: BrandStripItem[] =
    homepageBrandRecords.filter((brand) => brand.isActive).length > 0
      ? homepageBrandRecords
          .filter((brand) => brand.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((brand) => ({
            id: brand.id,
            name: brand.name,
            logoUrl: brand.logoUrl || undefined,
          }))
      : brandLogos.map((name, index) => ({
          id: `fallback-${index}`,
          name,
        }));

  const promoBanner: HomepagePromoContent =
    pickHomepagePromoBanner(promoBannerRecords, locale) ?? {
      title: dictionary.home.promoTitle,
      subtitle: dictionary.home.promoSubtitle,
      image: DEFAULT_PROMO_IMAGE,
    };

  const mappedTestimonials = mapTestimonialsForLocale(testimonialRecords, locale);
  const testimonials =
    mappedTestimonials.length > 0 ? mappedTestimonials : dictionary.testimonials;

  return {
    heroSlides,
    seasonalBanner,
    brandStripItems,
    promoBanner,
    testimonials,
  };
}
