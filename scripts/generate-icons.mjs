import sharp from "sharp";
import { mkdir } from "node:fs/promises";
await mkdir("public/icons", { recursive: true });
const svg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="#f8f5ef"/><circle cx="256" cy="256" r="181" fill="none" stroke="#99815b" stroke-width="2"/><text x="256" y="315" text-anchor="middle" font-family="Georgia,serif" font-size="185" fill="#302b26">D</text><path d="M256 101 L260 116 L275 120 L260 124 L256 139 L252 124 L237 120 L252 116Z" fill="#99815b"/><text x="256" y="368" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" letter-spacing="6" fill="#99815b">MAKEUP BY DIMA</text></svg>`,
);
for (const [size, path] of [
  [192, "public/icons/icon-192.png"],
  [512, "public/icons/icon-512.png"],
  [180, "public/apple-icon.png"],
  [64, "public/icon.png"],
])
  await sharp(svg).resize(size, size).png().toFile(path);
console.log("PWA icons generated.");
