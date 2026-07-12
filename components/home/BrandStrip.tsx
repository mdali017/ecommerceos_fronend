import Image from "next/image";

export interface BrandStripItem {
  id: string;
  name: string;
  logoUrl?: string;
}

export function BrandStrip({
  title,
  brands,
}: {
  title: string;
  brands: BrandStripItem[];
}) {
  if (brands.length === 0) return null;

  return (
    <section className="border-y border-brand-border bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wider text-gray-500 sm:mb-6">
          {title}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex h-12 min-w-[100px] items-center justify-center rounded-lg border border-brand-border bg-brand-gray px-4 sm:h-14 sm:min-w-[130px]"
            >
              {brand.logoUrl ? (
                <div className="relative h-8 w-24 sm:h-10 sm:w-28">
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    sizes="112px"
                  />
                </div>
              ) : (
                <span className="text-xs font-semibold text-gray-600 sm:text-sm">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
