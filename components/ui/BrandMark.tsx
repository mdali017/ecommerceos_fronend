import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function BrandMark({
  href,
  size = "md",
  showText = true,
  hideTextOnMobile = false,
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  hideTextOnMobile?: boolean;
}) {
  const iconSize =
    size === "sm"
      ? "h-8 w-8 text-base"
      : size === "lg"
        ? "h-11 w-11 text-xl"
        : "h-9 w-9 text-lg sm:h-10 sm:w-10 sm:text-xl";
  const textSize =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg sm:text-xl";
  const textVisibility = hideTextOnMobile ? "hidden sm:inline" : "";

  const content = (
    <>
      <div
        className={`flex flex-shrink-0 items-center justify-center rounded-full bg-brand-green ${iconSize}`}
      >
        <span aria-hidden>🌿</span>
      </div>
      {showText ? (
        <span className={`font-bold leading-none ${textSize} ${textVisibility}`}>
          <span className="text-brand-green">{BRAND.namePrimary}</span>
          <span className="text-brand-orange"> {BRAND.nameAccent}</span>
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return <div className="flex items-center gap-2">{content}</div>;
  }

  return (
    <Link href={href} className="flex flex-shrink-0 items-center gap-2">
      {content}
    </Link>
  );
}
