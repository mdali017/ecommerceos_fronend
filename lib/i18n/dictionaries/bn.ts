import type { Dictionary } from "../types";
import { HERO_IMAGES, SEASONAL_BANNER_IMAGE } from "../shared-content";

const bn: Dictionary = {
  locale: "bn",
  meta: {
    title: "Khaas Food — খাঁটি ও প্রাকৃতিক খাদ্য পণ্য",
    description:
      "আম, মধু, ঘি, মশলা ও আরও অনেক প্রাকৃতিক পণ্য — সরাসরি আপনার দোরগোড়ায়।",
  },
  header: {
    searchPlaceholder: "পণ্য খুঁজুন...",
    signIn: "সাইন ইন",
    dashboard: "ড্যাশবোর্ড",
  },
  nav: {
    allCategories: "সব ক্যাটাগরি",
  },
  home: {
    topSelling: "টপ সেলিং পণ্য",
    freshMango: "তাজা আম",
    pureHoney: "খাঁটি মধু",
    spiceCollection: "মশলা সংগ্রহ",
    flashSale: "🔥 ফ্ল্যাশ সেল",
    endingIn: "শেষ হচ্ছে:",
    hours: "ঘণ্টা",
    minutes: "মিনিট",
    seconds: "সেকেন্ড",
    brands: "আমাদের ব্র্যান্ডসমূহ",
    promoTitle: "প্রাকৃতিক ও খাঁটি পণ্য",
    promoSubtitle: "সরাসরি কৃষকের কাছ থেকে আপনার দোরগোড়ায়",
    testimonials: "গ্রাহকদের মতামত",
  },
  footer: {
    about:
      "আমরা সরবরাহ করি ১০০% খাঁটি ও প্রাকৃতিক খাদ্য পণ্য। সরাসরি কৃষক ও উৎপাদকের কাছ থেকে সংগ্রহ করে আপনার দোরগোড়ায় পৌঁছে দিই।",
    info: "তথ্য",
    customerService: "গ্রাহক সেবা",
    myAccount: "আমার অ্যাকাউন্ট",
    appDownload: "অ্যাপ ডাউনলোড",
    copyright: "© ২০২৬ Khaas Food. সর্বস্বত্ব সংরক্ষিত।",
    infoLinks: ["আমাদের সম্পর্কে", "যোগাযোগ", "ব্লগ", "ক্যারিয়ার"],
    serviceLinks: ["অর্ডার ট্র্যাকিং", "রিটার্ন পলিসি", "শিপিং তথ্য", "সাধারণ প্রশ্ন"],
    accountLinks: ["সাইন ইন", "আমার অর্ডার", "উইশলিস্ট", "ঠিকানা"],
  },
  common: {
    viewAll: "সব দেখুন →",
    addToCart: "কার্টে যোগ করুন",
  },
  sort: {
    newest: "নতুন",
    priceAsc: "দাম — কম থেকে বেশি",
    priceDesc: "দাম — বেশি থেকে কম",
    name: "নাম",
  },
  pages: {
    home: "হোম",
    products: "টি পণ্য",
    categoryNotFound: "ক্যাটাগরি পাওয়া যায়নি",
    productNotFound: "পণ্য পাওয়া যায়নি",
    backHome: "হোমে ফিরে যান",
    previous: "← আগের",
    next: "পরের →",
    page: "পৃষ্ঠা",
    noProductsInCategory: "এই ক্যাটাগরিতে এখনো কোনো পণ্য নেই",
    noProductsHint: "শীঘ্রই নতুন পণ্য যোগ করা হবে।",
    relatedProducts: "সম্পর্কিত পণ্য",
    seeMore: "আরও দেখুন",
    checkout: "চেকআউট",
  },
  badges: {
    new: "নতুন",
    sale: "সেল",
    bestseller: "বেস্ট সেলার",
    stock: "স্টকে আছে",
  },
  heroSlides: [
    {
      id: "1",
      title: "প্রতিদিনের পুষ্টি যোগাতে স্বাস্থ্যকর খেজুর",
      subtitle: "খাঁটি ও প্রাকৃতিক — সরাসরি সংগ্রহ",
      cta: "এখনই অর্ডার করুন",
      image: HERO_IMAGES[0],
    },
    {
      id: "2",
      title: "খাঁটি ঘি ও প্রাকৃতিক মধু",
      subtitle: "১০০% খাঁটি — কোনো মিশ্রণ নেই",
      cta: "দেখুন সব পণ্য",
      image: HERO_IMAGES[1],
    },
    {
      id: "3",
      title: "বিশ্বমানের মশলা সংগ্রহ",
      subtitle: "রান্নায় দিন আসল স্বাদ",
      cta: "কিনুন এখন",
      image: HERO_IMAGES[2],
    },
  ],
  seasonalBanner: {
    title: "মিষ্টি-রসালে স্বাদে অনন্য বাগানের সেরা আম্রপালি",
    cta: "অর্ডার চলছে",
    image: SEASONAL_BANNER_IMAGE,
  },
  testimonials: [
    {
      id: "t1",
      name: "রাহিমা বেগম",
      review:
        "মধু ও ঘি একদম খাঁটি। ডেলিভারিও সময়মতো হয়েছে। আরও অর্ডার করবো ইনশাআল্লাহ।",
      rating: 5,
      avatar: "র",
    },
    {
      id: "t2",
      name: "করিম হোসেন",
      review:
        "আমের মান অসাধারণ! রাজশাহীর মতো স্বাদ পেয়েছি। প্যাকেজিংও খুব ভালো ছিল।",
      rating: 5,
      avatar: "ক",
    },
    {
      id: "t3",
      name: "সুমাইয়া আক্তার",
      review:
        "মশলার গুণমান দেখে মুগ্ধ। রান্নায় স্বাদ একদম আলাদা। সবাইকে রেকমেন্ড করি।",
      rating: 5,
      avatar: "স",
    },
    {
      id: "t4",
      name: "আব্দুল্লাহ আল মামুন",
      review:
        "বারবার অর্ডার করছি। দাম reasonable এবং প্রোডাক্ট authentic। সাপোর্ট টিমও helpful।",
      rating: 4,
      avatar: "আ",
    },
  ],
};

export default bn;
