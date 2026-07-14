/**
 * Generate PWA PNG icons from brand SVG (leaf on green).
 * Run: node scripts/generate-pwa-icons.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, "..", "public", "icons");
const publicDir = join(__dirname, "..", "public");

function renderSvg(svgPath, size, outPath) {
  const svg = readFileSync(svgPath);
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
  });
  const png = resvg.render().asPng();
  writeFileSync(outPath, png);
  console.log(`Wrote ${outPath} (${size}x${size})`);
}

const anySvg = join(iconsDir, "icon.svg");
const maskableSvg = join(iconsDir, "icon-maskable.svg");

renderSvg(anySvg, 192, join(iconsDir, "icon-192.png"));
renderSvg(anySvg, 512, join(iconsDir, "icon-512.png"));
renderSvg(maskableSvg, 512, join(iconsDir, "icon-512-maskable.png"));
renderSvg(anySvg, 180, join(publicDir, "apple-touch-icon.png"));
