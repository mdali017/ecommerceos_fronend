import Image from "next/image";

export function PromoBanner({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle: string;
  image: string;
}) {
  if (!title.trim() && !subtitle.trim()) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="relative aspect-[21/6] min-h-[120px] overflow-hidden rounded-xl sm:min-h-[160px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1280px"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-white/90 sm:text-base">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
