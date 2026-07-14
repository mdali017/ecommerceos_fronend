/** Storefront brand — single source of truth for display name & contact. */
export const BRAND = {
  name: "Ecommerce OS",
  namePrimary: "Ecommerce",
  nameAccent: "OS",
  email: "support@ecommerceos.com",
  taglineEn: "Your complete e-commerce operating system",
  taglineBn: "আপনার সম্পূর্ণ ই-কমার্স অপারেটিং সিস্টেম",
  metaTitleEn: "Ecommerce OS — Complete E-commerce Platform",
  metaTitleBn: "Ecommerce OS — সম্পূর্ণ ই-কমার্স প্ল্যাটফর্ম",
  metaDescriptionEn:
    "Sell online with Ecommerce OS — products, orders, POS, and storefront in one platform.",
  metaDescriptionBn:
    "Ecommerce OS দিয়ে অনলাইনে বিক্রি করুন — পণ্য, অর্ডার, POS ও স্টোরফ্রন্ট এক প্ল্যাটফর্মে।",
} as const;

export function brandTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} — ${BRAND.name}` : BRAND.name;
}
