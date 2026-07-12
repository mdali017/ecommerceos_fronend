import type { Locale } from "./config";

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  review: string;
  rating: number;
  avatar: string;
}

export interface Dictionary {
  locale: Locale;
  meta: {
    title: string;
    description: string;
  };
  header: {
    searchPlaceholder: string;
    signIn: string;
    dashboard: string;
  };
  nav: {
    allCategories: string;
  };
  home: {
    topSelling: string;
    freshMango: string;
    pureHoney: string;
    spiceCollection: string;
    flashSale: string;
    endingIn: string;
    hours: string;
    minutes: string;
    seconds: string;
    brands: string;
    promoTitle: string;
    promoSubtitle: string;
    testimonials: string;
  };
  footer: {
    about: string;
    info: string;
    customerService: string;
    myAccount: string;
    appDownload: string;
    copyright: string;
    infoLinks: string[];
    serviceLinks: string[];
    accountLinks: string[];
  };
  common: {
    viewAll: string;
    addToCart: string;
  };
  sort: {
    newest: string;
    priceAsc: string;
    priceDesc: string;
    name: string;
  };
  pages: {
    home: string;
    products: string;
    categoryNotFound: string;
    productNotFound: string;
    backHome: string;
    previous: string;
    next: string;
    page: string;
    noProductsInCategory: string;
    noProductsHint: string;
    relatedProducts: string;
    seeMore: string;
    checkout: string;
  };
  badges: {
    new: string;
    sale: string;
    bestseller: string;
    stock: string;
  };
  heroSlides: HeroSlide[];
  seasonalBanner: {
    title: string;
    cta: string;
    image: string;
  };
  testimonials: Testimonial[];
}
