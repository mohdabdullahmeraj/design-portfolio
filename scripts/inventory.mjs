// Lists every image under a folder with its size, and flags exact / near duplicates.
// Usage: node scripts/inventory.mjs <folder>
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const root = process.argv[2];
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));

const rows = [];
const exts = {};
for (const f of walk(root)) {
  const ext = extname(f).toLowerCase();
  exts[ext] = (exts[ext] || 0) + 1;
  try {
    const m = await sharp(f).metadata();
    // tiny 8x8 greyscale fingerprint to spot the same picture saved twice
    const fp = await sharp(f).resize(8, 8, { fit: "fill" }).greyscale().raw().toBuffer();
    rows.push({ f: relative(root, f), w: m.width, h: m.height, kb: (statSync(f).size / 1024) | 0, fp });
  } catch {
    rows.push({ f: relative(root, f), bad: true });
  }
}
const same = (a, b) => a.fp.reduce((s, v, i) => s + Math.abs(v - b.fp[i]), 0) / 64 < 6;
for (const [i, r] of rows.entries()) {
  if (r.bad) { console.log(`NOT IMAGE  ${r.f}`); continue; }
  const dup = rows.slice(0, i).find((o) => !o.bad && Math.abs(o.w / o.h - r.w / r.h) < 0.02 && same(o, r));
  console.log(`${i}\t${r.w}x${r.h}\t${r.kb}KB\t${r.f}${dup ? `\t<- DUPLICATE of ${dup.f}` : ""}`);
}
console.log("\nby type:", JSON.stringify(exts), "| files:", rows.length);
