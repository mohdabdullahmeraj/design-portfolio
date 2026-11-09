// Builds a numbered contact sheet from a list of image URLs/paths (for reviewing a project).
// Usage: node scripts/contact-sheet.mjs <out.png> <url-or-path> [...]
import sharp from "sharp";

const [out, ...srcs] = process.argv.slice(2);
const W = 300, cols = 5;
const tiles = [];
for (const [i, s] of srcs.entries()) {
  const buf = s.startsWith("http") ? Buffer.from(await (await fetch(s)).arrayBuffer()) : s;
  const img = await sharp(buf).resize(W, null).png().toBuffer();
  const { height } = await sharp(img).metadata();
  const label = Buffer.from(`<svg width="${W}" height="22"><rect width="34" height="22" fill="#e5391f"/><text x="6" y="16" font-size="15" font-family="sans-serif" fill="#fff">${i + 1}</text></svg>`);
  tiles.push({ img, height, label });
}
const rows = Math.ceil(tiles.length / cols);
const rowH = Array.from({ length: rows }, (_, r) => Math.max(...tiles.slice(r * cols, r * cols + cols).map((t) => t.height)));
const comps = [];
let y = 0;
for (let r = 0; r < rows; r++) {
  tiles.slice(r * cols, r * cols + cols).forEach((t, c) => {
    comps.push({ input: t.img, left: c * (W + 8), top: y }, { input: t.label, left: c * (W + 8), top: y });
  });
  y += rowH[r] + 8;
}
await sharp({ create: { width: cols * (W + 8), height: y, channels: 3, background: "#ffffff" } }).composite(comps).png().toFile(out);
console.log("ok", out);
