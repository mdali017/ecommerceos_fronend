import type { Product } from "@/lib/data";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCardHorizontal } from "@/components/ui/ProductCardHorizontal";

export function TopSellingSection({
  products,
  title,
}: {
  products: Product[];
  title: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <SectionTitle title={title} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {products.map((product) => (
          <ProductCardHorizontal key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
