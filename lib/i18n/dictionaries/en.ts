import type { Dictionary } from "../types";
import { HERO_IMAGES, SEASONAL_BANNER_IMAGE } from "../shared-content";

const en: Dictionary = {
  locale: "en",
  meta: {
    title: "Khaas Food — Pure & Natural Food Products",
    description:
      "Mango, honey, ghee, spices and more natural products — delivered straight to your door.",
  },
  header: {
    searchPlaceholder: "Search products...",
    signIn: "Sign In",
    dashboard: "Dashboard",
  },
  nav: {
    allCategories: "All Categories",
  },
  home: {
    topSelling: "Top Selling Products",
    freshMango: "Fresh Mango",
    pureHoney: "Pure Honey",
    spiceCollection: "Spice Collection",
    flashSale: "🔥 Flash Sale",
    endingIn: "Ends in:",
    hours: "Hours",
    minutes: "Min",
    seconds: "Sec",
    brands: "Our Brands",
    promoTitle: "Natural & Pure Products",
    promoSubtitle: "From farm to your doorstep",
    testimonials: "Customer Reviews",
  },
  footer: {
    about:
      "We deliver 100% pure and natural food products, sourced directly from farmers and producers to your doorstep.",
    info: "Information",
    customerService: "Customer Service",
    myAccount: "My Account",
    appDownload: "Download App",
    copyright: "© 2026 Khaas Food. All rights reserved.",
    infoLinks: ["About Us", "Contact", "Blog", "Careers"],
    serviceLinks: ["Order Tracking", "Return Policy", "Shipping Info", "FAQ"],
    accountLinks: ["Sign In", "My Orders", "Wishlist", "Addresses"],
  },
  common: {
    viewAll: "View All →",
    addToCart: "Add to Cart",
  },
  sort: {
    newest: "Newest",
    priceAsc: "Price: Low to High",
    priceDesc: "Price: High to Low",
    name: "Name",
  },
  pages: {
    home: "Home",
    products: "products",
    categoryNotFound: "Category not found",
    productNotFound: "Product not found",
    backHome: "Back to Home",
    previous: "← Previous",
    next: "Next →",
    page: "Page",
    noProductsInCategory: "No products in this category yet",
    noProductsHint: "New products will be added soon.",
    relatedProducts: "Related Products",
    seeMore: "See More",
    checkout: "Checkout",
  },
  badges: {
    new: "New",
    sale: "Sale",
    bestseller: "Best Seller",
    stock: "In Stock",
  },
  heroSlides: [
    {
      id: "1",
      title: "Healthy dates for everyday nutrition",
      subtitle: "Pure & natural — sourced directly",
      cta: "Order Now",
      image: HERO_IMAGES[0],
    },
    {
      id: "2",
      title: "Pure ghee & natural honey",
      subtitle: "100% pure — no additives",
      cta: "Browse Products",
      image: HERO_IMAGES[1],
    },
    {
      id: "3",
      title: "Premium spice collection",
      subtitle: "Bring authentic flavor to your kitchen",
      cta: "Shop Now",
      image: HERO_IMAGES[2],
    },
  ],
  seasonalBanner: {
    title: "Garden-fresh Amrapali mangoes — sweet & juicy",
    cta: "Order Now",
    image: SEASONAL_BANNER_IMAGE,
  },
  testimonials: [
    {
      id: "t1",
      name: "Rahima Begum",
      review:
        "The honey and ghee are absolutely pure. Delivery was on time too. Will order again!",
      rating: 5,
      avatar: "R",
    },
    {
      id: "t2",
      name: "Karim Hossen",
      review:
        "Amazing mango quality! Tasted just like Rajshahi mangoes. Packaging was excellent.",
      rating: 5,
      avatar: "K",
    },
    {
      id: "t3",
      name: "Sumaiya Akter",
      review:
        "Impressed by the spice quality. Adds a unique flavor to cooking. Highly recommended!",
      rating: 5,
      avatar: "S",
    },
    {
      id: "t4",
      name: "Abdullah Al Mamun",
      review:
        "I order regularly. Reasonable prices and authentic products. Support team is helpful.",
      rating: 4,
      avatar: "A",
    },
  ],
};

export default en;
