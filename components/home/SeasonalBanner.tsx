import Image from "next/image";

export function SeasonalBanner({
  banner,
}: {
  banner: { title: string; cta: string; image: string };
}) {
  if (!banner.image.trim()) return null;

  return (
    <a
      href="#"
      className="group relative block h-[160px] overflow-hidden rounded-xl sm:h-[200px] lg:h-[300px]"
    >
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 400px"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <span className="mb-2 inline-block rounded bg-brand-orange px-2.5 py-1 text-xs font-semibold text-white sm:text-sm">
          {banner.cta}
        </span>
        <p className="text-sm font-bold leading-snug text-white sm:text-base lg:text-lg">
          {banner.title}
        </p>
      </div>
    </a>
  );
}
