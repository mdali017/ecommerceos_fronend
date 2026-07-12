import { HeroSlider } from "@/components/home/HeroSlider";
import { SeasonalBanner } from "@/components/home/SeasonalBanner";

export function HeroSection({
  slides,
  seasonal,
}: {
  slides: Parameters<typeof HeroSlider>[0]["slides"];
  seasonal: Parameters<typeof SeasonalBanner>[0]["banner"];
}) {
  const hasSeasonal = Boolean(seasonal.image?.trim());

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5">
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        <div className={hasSeasonal ? "lg:col-span-2" : "lg:col-span-3"}>
          <HeroSlider slides={slides} />
        </div>
        {hasSeasonal ? (
          <div className="lg:col-span-1">
            <SeasonalBanner banner={seasonal} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
