export interface Product {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  originalPrice?: number;
  image: string;
  weight?: string;
  badge?: "new" | "sale" | "bestseller" | "stock";
  discount?: number;
  slug?: string;
}

export interface Category {
  id: string;
  nameBn: string;
  icon: string;
}

export const navCategories = [
  "আম",
  "খেজুর",
  "মধু",
  "তেল",
  "ঘি",
  "মশলা",
  "চাল",
  "ডাল",
  "বাদাম",
  "শুকনো ফল",
  "চা-কফি",
  "স্বাস্থ্য",
];

export interface FallbackCategory {
  slug: string;
  nameBn: string;
  name: string;
  icon: string;
}

export const fallbackCategories: FallbackCategory[] = [
  { slug: "am", nameBn: "আম", name: "Mango", icon: "🥭" },
  { slug: "khejur", nameBn: "খেজুর", name: "Dates", icon: "🌴" },
  { slug: "modhu", nameBn: "মধু", name: "Honey", icon: "🍯" },
  { slug: "tel", nameBn: "তেল", name: "Oil", icon: "🫒" },
  { slug: "ghi", nameBn: "ঘি", name: "Ghee", icon: "🧈" },
  { slug: "moshla", nameBn: "মশলা", name: "Spice", icon: "🌶️" },
  { slug: "chal", nameBn: "চাল", name: "Rice", icon: "🌾" },
  { slug: "dal", nameBn: "ডাল", name: "Lentils", icon: "🫘" },
  { slug: "badam", nameBn: "বাদাম", name: "Nuts", icon: "🥜" },
  { slug: "shukno-fol", nameBn: "শুকনো ফল", name: "Dried Fruits", icon: "🍇" },
  { slug: "cha-kofi", nameBn: "চা-কফি", name: "Tea & Coffee", icon: "🍵" },
  { slug: "shastho", nameBn: "স্বাস্থ্য", name: "Health", icon: "💚" },
];

export const categoryIcons: Category[] = [
  { id: "1", nameBn: "মধু", icon: "🍯" },
  { id: "2", nameBn: "ঘি", icon: "🧈" },
  { id: "3", nameBn: "তেল", icon: "🫒" },
  { id: "4", nameBn: "মশলা", icon: "🌶️" },
  { id: "5", nameBn: "বাদাম", icon: "🥜" },
  { id: "6", nameBn: "চাল", icon: "🌾" },
  { id: "7", nameBn: "ডাল", icon: "🫘" },
  { id: "8", nameBn: "চা", icon: "🍵" },
  { id: "9", nameBn: "আম", icon: "🥭" },
  { id: "10", nameBn: "খেজুর", icon: "🌴" },
];

export const seasonalBanner = {
  titleBn: "মিষ্টি-রসালে স্বাদে অনন্য বাগানের সেরা আম্রপালি",
  cta: "অর্ডার চলছে",
  image:
    "https://images.unsplash.com/photo-1553279768-865489fd8dcc?w=600&h=700&fit=crop",
};

export const heroSlides = [
  {
    id: "1",
    titleBn: "প্রতিদিনের পুষ্টি যোগাতে স্বাস্থ্যকর খেজুর",
    subtitleBn: "খাঁটি ও প্রাকৃতিক — সরাসরি সংগ্রহ",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1000&h=500&fit=crop",
    cta: "এখনই অর্ডার করুন",
  },
  {
    id: "2",
    titleBn: "খাঁটি ঘি ও প্রাকৃতিক মধু",
    subtitleBn: "১০০% খাঁটি — কোনো মিশ্রণ নেই",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1400&h=500&fit=crop",
    cta: "দেখুন সব পণ্য",
  },
  {
    id: "3",
    titleBn: "বিশ্বমানের মশলা সংগ্রহ",
    subtitleBn: "রান্নায় দিন আসল স্বাদ",
    image:
      "https://images.unsplash.com/photo-1596040033229-a0b451c4f2a6?w=1400&h=500&fit=crop",
    cta: "কিনুন এখন",
  },
];

export const topSellingProducts: Product[] = [
  {
    id: "ts1",
    name: "Pure Mustard Honey",
    nameBn: "খাঁটি সরিষার মধু",
    price: 850,
    originalPrice: 950,
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    weight: "৫০০ গ্রাম",
    badge: "bestseller",
    discount: 10,
  },
  {
    id: "ts2",
    name: "Desi Ghee",
    nameBn: "দেশি ঘি",
    price: 1200,
    originalPrice: 1350,
    image:
      "https://images.unsplash.com/photo-1631452180519-014549103de4?w=400&h=400&fit=crop",
    weight: "৫০০ গ্রাম",
    badge: "bestseller",
    discount: 11,
    slug: "gawa-ghee-1kg",
  },
  {
    id: "ts3",
    name: "Black Cumin Oil",
    nameBn: "কালোজিরা তেল",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
    weight: "১০০ মি.লি.",
    badge: "stock",
  },
  {
    id: "ts4",
    name: "Mixed Dry Fruits",
    nameBn: "মিক্সড ড্রাই ফ্রুটস",
    price: 680,
    originalPrice: 750,
    image:
      "https://images.unsplash.com/photo-1599599810769-bcde5a16019e?w=400&h=400&fit=crop",
    weight: "২৫০ গ্রাম",
    discount: 9,
  },
  {
    id: "ts5",
    name: "Ajwa Dates",
    nameBn: "আজওয়া খেজুর",
    price: 1100,
    originalPrice: 1250,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    weight: "৫০০ গ্রাম",
    badge: "bestseller",
    discount: 12,
  },
  {
    id: "ts6",
    name: "Turmeric Powder",
    nameBn: "হলুদ গুঁড়া",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1596040033229-a0b451c4f2a6?w=400&h=400&fit=crop",
    weight: "২০০ গ্রাম",
    badge: "new",
  },
];

export const mangoProducts: Product[] = [
  {
    id: "m1",
    name: "Amrapali Mango",
    nameBn: "আম্রপালি আম",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1553279768-865489fd8dcc?w=300&h=300&fit=crop",
    weight: "১ কেজি",
    badge: "new",
  },
  {
    id: "m2",
    name: "Langra Mango",
    nameBn: "ল্যাংড়া আম",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1605027990121-cf7364c3c8a0?w=300&h=300&fit=crop",
    weight: "১ কেজি",
  },
  {
    id: "m3",
    name: "Himsagar Mango",
    nameBn: "হিমসাগর আম",
    price: 180,
    originalPrice: 200,
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop",
    weight: "১ কেজি",
    badge: "sale",
    discount: 10,
  },
  {
    id: "m4",
    name: "Fazli Mango",
    nameBn: "ফজলি আম",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1591071625789-5a68e2fb4c69?w=300&h=300&fit=crop",
    weight: "১ কেজি",
  },
  {
    id: "m5",
    name: "Gopalbhog Mango",
    nameBn: "গোপালভোগ আম",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1628191010215-e59a00ff3416?w=300&h=300&fit=crop",
    weight: "১ কেজি",
    badge: "new",
  },
];

export const honeyProducts: Product[] = [
  {
    id: "h1",
    name: "Sundarbans Honey",
    nameBn: "সুন্দরবনের মধু",
    price: 950,
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop",
    weight: "৫০০ গ্রাম",
    badge: "bestseller",
  },
  {
    id: "h2",
    name: "Mustard Honey",
    nameBn: "সরিষার মধু",
    price: 750,
    originalPrice: 850,
    image:
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&h=300&fit=crop",
    weight: "৫০০ গ্রাম",
    discount: 12,
  },
  {
    id: "h3",
    name: "Litchi Honey",
    nameBn: "লিচু মধু",
    price: 800,
    image:
      "https://images.unsplash.com/photo-1471943311420-636f4e4e9e9e?w=300&h=300&fit=crop",
    weight: "৫০০ গ্রাম",
  },
  {
    id: "h4",
    name: "Black Seed Honey",
    nameBn: "কালোজিরা মধু",
    price: 1100,
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop",
    weight: "৫০০ গ্রাম",
    badge: "new",
  },
  {
    id: "h5",
    name: "Multiflora Honey",
    nameBn: "মাল্টিফ্লোরা মধু",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop",
    weight: "২৫০ গ্রাম",
  },
];

export const spiceProducts: Product[] = [
  {
    id: "s1",
    name: "Turmeric Powder",
    nameBn: "হলুদ গুঁড়া",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1596040033229-a0b451c4f2a6?w=300&h=300&fit=crop",
    weight: "২০০ গ্রাম",
  },
  {
    id: "s2",
    name: "Cumin Powder",
    nameBn: "জিরা গুঁড়া",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=300&h=300&fit=crop",
    weight: "২০০ গ্রাম",
  },
  {
    id: "s3",
    name: "Coriander Powder",
    nameBn: "ধনিয়া গুঁড়া",
    price: 150,
    originalPrice: 180,
    image:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop",
    weight: "২০০ গ্রাম",
    discount: 17,
  },
  {
    id: "s4",
    name: "Red Chili Powder",
    nameBn: "লাল মরিচ গুঁড়া",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1583225214461-3c3004f4cc4d?w=300&h=300&fit=crop",
    weight: "২০০ গ্রাম",
    badge: "sale",
  },
  {
    id: "s5",
    name: "Garam Masala",
    nameBn: "গরম মসলা",
    price: 280,
    image:
      "https://images.unsplash.com/photo-1596040033229-a0b451c4f2a6?w=300&h=300&fit=crop",
    weight: "১০০ গ্রাম",
    badge: "bestseller",
  },
];

export const flashSaleProducts: Product[] = [
  {
    id: "f1",
    name: "Organic Brown Rice",
    nameBn: "অর্গানিক ব্রাউন রাইস",
    price: 320,
    originalPrice: 400,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop",
    weight: "১ কেজি",
    discount: 20,
  },
  {
    id: "f2",
    name: "Red Lentils",
    nameBn: "মসুর ডাল",
    price: 140,
    originalPrice: 170,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop",
    weight: "১ কেজি",
    discount: 18,
  },
  {
    id: "f3",
    name: "Almonds",
    nameBn: "কাঠবাদাম",
    price: 550,
    originalPrice: 650,
    image:
      "https://images.unsplash.com/photo-1599599810769-bcde5a16019e?w=300&h=300&fit=crop",
    weight: "২৫০ গ্রাম",
    discount: 15,
  },
  {
    id: "f4",
    name: "Green Tea",
    nameBn: "গ্রিন টি",
    price: 280,
    originalPrice: 350,
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=300&fit=crop",
    weight: "১০০ গ্রাম",
    discount: 20,
  },
  {
    id: "f5",
    name: "Olive Oil",
    nameBn: "অলিভ অয়েল",
    price: 890,
    originalPrice: 1050,
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop",
    weight: "৫০০ মি.লি.",
    discount: 15,
  },
];

export const brandLogos = [
  "EOS Organic",
  "Farm Fresh",
  "Pure Harvest",
  "Nature's Best",
  "Green Valley",
  "Golden Grain",
];

export const testimonials = [
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
];
