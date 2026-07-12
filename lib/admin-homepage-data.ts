export interface AdminNavCategory {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export interface AdminHeroSlide {
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

export interface AdminSeasonalBanner {
  id: string;
  titleBn: string;
  titleEn: string;
  ctaBn: string;
  ctaEn: string;
  imageUrl: string;
  isActive: boolean;
}

export interface AdminBrand {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface AdminPromoBanner {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  imageUrl: string;
  isActive: boolean;
}

export interface AdminTestimonial {
  id: string;
  nameBn: string;
  nameEn: string;
  reviewBn: string;
  reviewEn: string;
  rating: number;
  avatar: string;
  isActive: boolean;
}

export const adminNavCategories: AdminNavCategory[] = [
  { id: "1", slug: "am", nameBn: "আম", nameEn: "Mango", icon: "🥭", sortOrder: 1, isActive: true },
  { id: "2", slug: "khejur", nameBn: "খেজুর", nameEn: "Dates", icon: "🌴", sortOrder: 2, isActive: true },
  { id: "3", slug: "modhu", nameBn: "মধু", nameEn: "Honey", icon: "🍯", sortOrder: 3, isActive: true },
  { id: "4", slug: "tel", nameBn: "তেল", nameEn: "Oil", icon: "🫒", sortOrder: 4, isActive: true },
  { id: "5", slug: "ghi", nameBn: "ঘি", nameEn: "Ghee", icon: "🧈", sortOrder: 5, isActive: true },
  { id: "6", slug: "moshla", nameBn: "মশলা", nameEn: "Spice", icon: "🌶️", sortOrder: 6, isActive: true },
  { id: "7", slug: "chal", nameBn: "চাল", nameEn: "Rice", icon: "🌾", sortOrder: 7, isActive: true },
  { id: "8", slug: "dal", nameBn: "ডাল", nameEn: "Lentils", icon: "🫘", sortOrder: 8, isActive: true },
  { id: "9", slug: "badam", nameBn: "বাদাম", nameEn: "Nuts", icon: "🥜", sortOrder: 9, isActive: true },
  { id: "10", slug: "shukno-fol", nameBn: "শুকনো ফল", nameEn: "Dried Fruits", icon: "🍇", sortOrder: 10, isActive: true },
  { id: "11", slug: "cha-kofi", nameBn: "চা-কফি", nameEn: "Tea & Coffee", icon: "🍵", sortOrder: 11, isActive: true },
  { id: "12", slug: "shastho", nameBn: "স্বাস্থ্য", nameEn: "Health", icon: "💚", sortOrder: 12, isActive: true },
];

export const adminHeroSlides: AdminHeroSlide[] = [
  {
    id: "1",
    titleBn: "প্রতিদিনের পুষ্টি যোগাতে স্বাস্থ্যকর খেজুর",
    titleEn: "Healthy dates for everyday nutrition",
    subtitleBn: "খাঁটি ও প্রাকৃতিক — সরাসরি সংগ্রহ",
    subtitleEn: "Pure & natural — sourced directly",
    ctaBn: "এখনই অর্ডার করুন",
    ctaEn: "Order Now",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1000&h=500&fit=crop",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "2",
    titleBn: "খাঁটি ঘি ও প্রাকৃতিক মধু",
    titleEn: "Pure ghee & natural honey",
    subtitleBn: "১০০% খাঁটি — কোনো মিশ্রণ নেই",
    subtitleEn: "100% pure — no additives",
    ctaBn: "দেখুন সব পণ্য",
    ctaEn: "Browse Products",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1400&h=500&fit=crop",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "3",
    titleBn: "বিশ্বমানের মশলা সংগ্রহ",
    titleEn: "Premium spice collection",
    subtitleBn: "রান্নায় দিন আসল স্বাদ",
    subtitleEn: "Bring authentic flavor to your kitchen",
    ctaBn: "কিনুন এখন",
    ctaEn: "Shop Now",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a0b451c4f2a6?w=1400&h=500&fit=crop",
    sortOrder: 3,
    isActive: true,
  },
];

export const adminSeasonalBanners: AdminSeasonalBanner[] = [
  {
    id: "1",
    titleBn: "মিষ্টি-রসালে স্বাদে অনন্য বাগানের সেরা আম্রপালি",
    titleEn: "Garden-fresh Amrapali mangoes — sweet & juicy",
    ctaBn: "অর্ডার চলছে",
    ctaEn: "Order Now",
    imageUrl: "https://images.unsplash.com/photo-1553279768-865489fd8dcc?w=600&h=700&fit=crop",
    isActive: true,
  },
];

export const adminBrands: AdminBrand[] = [
  { id: "1", name: "Khaas Organic", sortOrder: 1, isActive: true },
  { id: "2", name: "Farm Fresh", sortOrder: 2, isActive: true },
  { id: "3", name: "Pure Harvest", sortOrder: 3, isActive: true },
  { id: "4", name: "Nature's Best", sortOrder: 4, isActive: true },
  { id: "5", name: "Green Valley", sortOrder: 5, isActive: true },
  { id: "6", name: "Golden Grain", sortOrder: 6, isActive: true },
];

export const adminPromoBanners: AdminPromoBanner[] = [
  {
    id: "1",
    titleBn: "প্রাকৃতিক ও খাঁটি পণ্য",
    titleEn: "Natural & Pure Products",
    subtitleBn: "সরাসরি কৃষকের কাছ থেকে আপনার দোরগোড়ায়",
    subtitleEn: "From farm to your doorstep",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a0b451c4f2a6?w=1400&h=400&fit=crop",
    isActive: true,
  },
];

export const adminTestimonials: AdminTestimonial[] = [
  {
    id: "1",
    nameBn: "রাহিমা বেগম",
    nameEn: "Rahima Begum",
    reviewBn: "মধু ও ঘি একদম খাঁটি। ডেলিভারিও সময়মতো হয়েছে।",
    reviewEn: "The honey and ghee are absolutely pure. Delivery was on time too.",
    rating: 5,
    avatar: "র",
    isActive: true,
  },
  {
    id: "2",
    nameBn: "করিম হোসেন",
    nameEn: "Karim Hossen",
    reviewBn: "আমের মান অসাধারণ! রাজশাহীর মতো স্বাদ পেয়েছি।",
    reviewEn: "Amazing mango quality! Tasted just like Rajshahi mangoes.",
    rating: 5,
    avatar: "ক",
    isActive: true,
  },
  {
    id: "3",
    nameBn: "সুমাইয়া আক্তার",
    nameEn: "Sumaiya Akter",
    reviewBn: "মশলার গুণমান দেখে মুগ্ধ। সবাইকে রেকমেন্ড করি।",
    reviewEn: "Impressed by the spice quality. Highly recommended!",
    rating: 5,
    avatar: "স",
    isActive: true,
  },
  {
    id: "4",
    nameBn: "আব্দুল্লাহ আল মামুন",
    nameEn: "Abdullah Al Mamun",
    reviewBn: "বারবার অর্ডার করছি। দাম reasonable এবং প্রোডাক্ট authentic।",
    reviewEn: "I order regularly. Reasonable prices and authentic products.",
    rating: 4,
    avatar: "আ",
    isActive: true,
  },
];

export const homepageSections = [
  {
    id: "categories",
    title: "Nav Categories",
    description: "Top navbar & category icon row",
    href: "/admin/homepage/categories",
    icon: "📂",
    count: adminNavCategories.length,
    activeCount: adminNavCategories.filter((item) => item.isActive).length,
    color: "bg-green-50 text-green-600",
  },
  {
    id: "hero-slides",
    title: "Hero Slider",
    description: "Main homepage banner carousel",
    href: "/admin/homepage/hero-slides",
    icon: "🖼️",
    count: adminHeroSlides.length,
    activeCount: adminHeroSlides.filter((item) => item.isActive).length,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "seasonal-banner",
    title: "Seasonal Banner",
    description: "Side banner next to hero slider",
    href: "/admin/homepage/seasonal-banner",
    icon: "🥭",
    count: adminSeasonalBanners.length,
    activeCount: adminSeasonalBanners.filter((item) => item.isActive).length,
    color: "bg-orange-50 text-brand-orange",
  },
  {
    id: "brands",
    title: "Brand Strip",
    description: "Our brands logo section",
    href: "/admin/homepage/brands",
    icon: "🏷️",
    count: adminBrands.length,
    activeCount: adminBrands.filter((item) => item.isActive).length,
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: "promo-banner",
    title: "Promo Banner",
    description: "Mid-page promotional banner",
    href: "/admin/homepage/promo-banner",
    icon: "📢",
    count: adminPromoBanners.length,
    activeCount: adminPromoBanners.filter((item) => item.isActive).length,
    color: "bg-teal-50 text-teal-600",
  },
  {
    id: "testimonials",
    title: "Testimonials",
    description: "Customer reviews section",
    href: "/admin/homepage/testimonials",
    icon: "⭐",
    count: adminTestimonials.length,
    activeCount: adminTestimonials.filter((item) => item.isActive).length,
    color: "bg-yellow-50 text-yellow-600",
  },
] as const;
