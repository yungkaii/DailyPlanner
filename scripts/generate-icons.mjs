// Generates PWA icon set from the brand SVG mark using sharp.
// Run: node scripts/generate-icons.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');

mkdirSync(publicDir, { recursive: true });

const BRAND = '#C05D3B';
const PAPER = '#F7F3EC';
const INK = '#2A2521';

// The brand glyph from index.html: a "flow" mark (vertical stroke + two arcs).
const glyph = (stroke, strokeWidth = 2) => `
  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
        fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"
        stroke-linecap="round" stroke-linejoin="round"/>`;

// Standard icon: cream paper background, brand glyph.
const standardSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
  <rect width="24" height="24" rx="5" fill="${PAPER}"/>
  <rect x="0.75" y="0.75" width="22.5" height="22.5" rx="4.25" fill="none" stroke="${BRAND}" stroke-opacity="0.35" stroke-width="1.5"/>
  <g transform="translate(12 12) scale(0.72) translate(-12 -12)">${glyph(BRAND)}</g>
</svg>`;

// Maskable icon: brand-tinted full bleed, glyph inside the 80% safe zone.
const maskableSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
  <rect width="24" height="24" fill="${BRAND}"/>
  <g transform="translate(12 12) scale(0.48) translate(-12 -12)">${glyph(PAPER)}</g>
</svg>`;

// Apple touch icon: no transparency, no rounding (OS applies its mask).
const appleSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
  <rect width="24" height="24" fill="${PAPER}"/>
  <g transform="translate(12 12) scale(0.66) translate(-12 -12)">${glyph(BRAND)}</g>
</svg>`;

const targets = [
  { file: 'pwa-192x192.png', svg: standardSvg, size: 192 },
  { file: 'pwa-512x512.png', svg: standardSvg, size: 512 },
  { file: 'pwa-64x64.png', svg: standardSvg, size: 64 },
  { file: 'maskable-512x512.png', svg: maskableSvg, size: 512 },
  { file: 'apple-touch-icon.png', svg: appleSvg, size: 180 },
];

for (const { file, svg, size } of targets) {
  const out = await sharp(Buffer.from(svg(size)))
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(resolve(publicDir, file), out);
  console.log(`✓ public/${file} (${size}x${size})`);
}

// Vector favicon so modern browsers skip the raster path entirely.
const faviconSvg = standardSvg(24).replace('<rect width="24" height="24" rx="5"', '<rect width="24" height="24" rx="5"');
writeFileSync(resolve(publicDir, 'favicon.svg'), faviconSvg);
console.log('✓ public/favicon.svg');