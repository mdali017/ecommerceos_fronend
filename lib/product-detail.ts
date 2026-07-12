import type { Product } from "./data";
import {
  flashSaleProducts,
  honeyProducts,
  mangoProducts,
  spiceProducts,
  topSellingProducts,
} from "./data";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ProductDetail {
  slug: string;
  name: string;
  nameBn: string;
  price: number;
  originalPrice?: number;
  category: string;
  categoryBn: string;
  brand: string;
  brandLogo?: string;
  weight: string;
  inStock: boolean;
  images: ProductImage[];
  description: string;
  keyFeatures: string[];
  usageAndStorage: string[];
  videoId?: string;
  reviews: ProductReview[];
  frequentlyBoughtTogether: Product[];
  relatedProducts: Product[];
  crossSellProducts: Product[];
}

export const productDetails: Record<string, ProductDetail> = {
  "gawa-ghee-1kg": {
    slug: "gawa-ghee-1kg",
    name: "Gawa Ghee 1kg",
    nameBn: "গাওয়া ঘি ১ কেজি",
    price: 1930,
    category: "Oil & Ghee",
    categoryBn: "তেল ও ঘি",
    brand: "Khaas Food",
    weight: "১ কেজি",
    inStock: true,
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1631452180519-014549103de4?w=600&h=600&fit=crop",
        alt: "গাওয়া ঘি — সামনের দৃশ্য",
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1589985270824-afe5fdf2f7d0?w=600&h=600&fit=crop",
        alt: "গাওয়া ঘি — প্যাকেজ",
      },
      {
        id: "3",
        url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop",
        alt: "গাওয়া ঘি — কাছ থেকে",
      },
      {
        id: "4",
        url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop",
        alt: "গাওয়া ঘি — ব্যবহার",
      },
    ],
    description:
      "আমাদের গাওয়া ঘি তৈরি হয় ঐতিহ্যবাহী পদ্ধতিতে, খাঁটি দেশি গরুর দুধ থেকে। কোনো কৃত্রিম রঙ বা সুগন্ধি যোগ করা হয় না। রান্নায় স্বাদ বাড়ানোর পাশাপাশি স্বাস্থ্যের জন্যও উপকারী এই ঘি আপনার রান্নাঘরের অপরিহার্য উপাদান।",
    keyFeatures: [
      "১০০% খাঁটি দেশি গরুর দুধ থেকে তৈরি",
      "ঐতিহ্যবাহী হাতে তৈরি (হ্যান্ডমেইড) পদ্ধতি",
      "কোনো প্রিজারভেটিভ বা কৃত্রিম উপাদান নেই",
      "স্বর্ণাকার রঙ ও সুগন্ধি — প্রকৃত গাওয়া ঘির চিহ্ন",
      "ভিটামিন A, D, E ও K সমৃদ্ধ",
    ],
    usageAndStorage: [
      "রান্না, পরোটা, পোলাও, হালুয়া ও মিষ্টিতে ব্যবহার করুন",
      "শিশুদের খাবারে স্বাদ ও পুষ্টি যোগ করতে উপযোগী",
      "ঠান্ডা ও শুষ্ক স্থানে সংরক্ষণ করুন",
      "সরাসরি সূর্যালোক ও আর্দ্রতা থেকে দূরে রাখুন",
      "খোলার পর ৬ মাসের মধ্যে ব্যবহার করুন",
    ],
    videoId: "dQw4w9WgXcQ",
    reviews: [
      {
        id: "r1",
        author: "ফারহানা আক্তার",
        avatar: "ফ",
        rating: 5,
        date: "১৫ জুন, ২০২৬",
        comment:
          "ঘি একদম খাঁটি! গন্ধ ও স্বাদ দুটোই অসাধারণ। আগে অন্য ব্র্যান্ড ব্যবহার করতাম, এখন শুধু এটাই কিনি।",
      },
    ],
    frequentlyBoughtTogether: [
      topSellingProducts[0],
      topSellingProducts[1],
      honeyProducts[0],
    ],
    relatedProducts: topSellingProducts.slice(0, 5),
    crossSellProducts: [...honeyProducts.slice(0, 3), ...spiceProducts.slice(0, 2)],
  },
};

const allProducts = [
  ...topSellingProducts,
  ...mangoProducts,
  ...honeyProducts,
  ...spiceProducts,
  ...flashSaleProducts,
];

function getProductSlug(product: Product) {
  return product.slug ?? product.id;
}

function getGenericProductDetail(product: Product): ProductDetail {
  return {
    slug: getProductSlug(product),
    name: product.name,
    nameBn: product.nameBn,
    price: product.price,
    originalPrice: product.originalPrice,
    category: "Grocery",
    categoryBn: "গ্রোসারি",
    brand: "Khaas Food",
    weight: product.weight ?? "১ প্যাকেট",
    inStock: true,
    images: [
      {
        id: "1",
        url: product.image,
        alt: product.nameBn,
      },
      {
        id: "2",
        url: product.image,
        alt: `${product.nameBn} — বিস্তারিত ছবি`,
      },
      {
        id: "3",
        url: product.image,
        alt: `${product.nameBn} — প্যাকেজিং`,
      },
    ],
    description: `${product.nameBn} আমাদের বাছাই করা খাঁটি ও মানসম্মত পণ্যগুলোর একটি। প্রতিটি পণ্য যত্নসহকারে সংগ্রহ, প্যাকেজিং ও ডেলিভারি করা হয় যাতে আপনি ঘরে বসেই ভালো মানের খাবার পেতে পারেন।`,
    keyFeatures: [
      "ভালো মানের কাঁচামাল থেকে প্রস্তুত",
      "পরিষ্কার ও স্বাস্থ্যসম্মত প্যাকেজিং",
      "দৈনন্দিন ব্যবহারের জন্য উপযোগী",
      "দ্রুত ডেলিভারি সুবিধা",
    ],
    usageAndStorage: [
      "ঠান্ডা ও শুকনো স্থানে সংরক্ষণ করুন",
      "সরাসরি সূর্যের আলো থেকে দূরে রাখুন",
      "প্যাকেট খোলার পর ভালোভাবে বন্ধ করে রাখুন",
    ],
    reviews: [],
    frequentlyBoughtTogether: topSellingProducts.slice(0, 3),
    relatedProducts: allProducts.filter((item) => item.id !== product.id).slice(0, 5),
    crossSellProducts: [...honeyProducts.slice(0, 3), ...spiceProducts.slice(0, 2)],
  };
}

export function getProductBySlug(slug: string): ProductDetail | undefined {
  const detailedProduct = productDetails[slug];
  if (detailedProduct) return detailedProduct;

  const product = allProducts.find((item) => getProductSlug(item) === slug);
  if (!product) return undefined;

  return getGenericProductDetail(product);
}

export function getAllProductSlugs(): string[] {
  return Array.from(
    new Set([...Object.keys(productDetails), ...allProducts.map(getProductSlug)])
  );
}
