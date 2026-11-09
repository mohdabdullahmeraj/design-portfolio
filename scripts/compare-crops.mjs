// Debug helper: renders original vs traced letters side by side for given regions.
// Usage: node scripts/compare-crops.mjs <outfile.png> x,y,w,h [x,y,w,h ...]
import sharp from "sharp";
import { readFileSync } from "node:fs";

const t = JSON.parse(readFileSync("content/name-trace.json", "utf8"));
const [out, ...regions] = process.argv.slice(2);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${t.width}" height="${t.height}"><rect width="100%" height="100%" fill="#2b2fdc"/>${t.letters
  .map((l) => `<path transform="translate(${l.x} ${l.y})" d="${l.d}" fill="#efe3c8" fill-rule="evenodd"/>`)
  .join("")}${t.sparkles.map((s) => `<path transform="translate(${s.x} ${s.y})" d="${s.d}" fill="none" stroke="#ff00aa" stroke-width="1.5"/>`).join("")}</svg>`;
const traced = await sharp(Buffer.from(svg)).png().toBuffer();
const rows = [];
let totalW = 0, totalH = 0;
for (const r of regions) {
  const [left, top, width, height] = r.split(",").map(Number);
  const scale = 2;
  const a = await sharp("assets/abdullah.webp").extract({ left, top, width, height }).resize(width * scale).png().toBuffer();
  const b = await sharp(traced).extract({ left, top, width, height }).resize(width * scale).png().toBuffer();
  rows.push({ a, b, w: width * scale, h: height * scale, y: totalH });
  totalW = Math.max(totalW, width * scale * 2 + 10);
  totalH += height * scale + 10;
}
const comps = rows.flatMap((r) => [{ input: r.a, left: 0, top: r.y }, { input: r.b, left: r.w + 10, top: r.y }]);
await sharp({ create: { width: totalW, height: totalH, channels: 3, background: "#fff" } }).composite(comps).png().toFile(out);
console.log("ok", out);
