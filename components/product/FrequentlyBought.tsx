import Image from "next/image";
import type { Product } from "@/lib/data";

function formatPrice(price: number) {
  return `৳${price.toLocaleString("bn-BD")}`;
}

export function FrequentlyBought({
  products,
  mainPrice,
}: {
  products: Product[];
  mainPrice: number;
}) {
  const total = mainPrice + products.reduce((sum, p) => sum + p.price, 0);

  return (
    <section className="border-y border-brand-border bg-brand-cream/50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-5 text-lg font-bold text-gray-900">
          একসাথে কেনা হয়
        </h2>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {products.map((product, i) => (
              <div key={product.id} className="flex items-center gap-3 sm:gap-4">
                {i > 0 && (
                  <span className="text-xl font-light text-gray-400">+</span>
                )}
                <div className="flex w-[140px] flex-col items-center rounded-lg border border-brand-border bg-white p-3 sm:w-[160px]">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-brand-gray">
                    <Image
                      src={product.image}
                      alt={product.nameBn}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-center text-xs font-medium text-gray-800">
                    {product.nameBn}
                  </p>
                  <p className="mt-1 text-sm font-bold text-brand-orange">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 rounded-xl border border-brand-border bg-white p-5 sm:min-w-[220px]">
            <p className="text-sm text-gray-600">মোট মূল্য</p>
            <p className="text-2xl font-bold text-brand-orange">
              {formatPrice(total)}
            </p>
            <button
              type="button"
              className="w-full rounded-lg bg-brand-orange px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-orange-dark"
            >
              সব কার্টে যোগ করুন
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
