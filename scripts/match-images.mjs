// For each given image, finds the closest-looking file in public/playground (tiny greyscale fingerprint).
// Usage: node scripts/match-images.mjs <img>...
import sharp from "sharp";
import { readdirSync } from "node:fs";
const fp = (f) => sharp(f).flatten({ background: "#fff" }).resize(16, 16, { fit: "fill" }).greyscale().raw().toBuffer();
const lib = [];
for (const n of readdirSync("public/playground")) { const f = "public/playground/" + n; const m = await sharp(f).metadata(); lib.push({ n, ar: m.width / m.height, fp: await fp(f) }); }
for (const q of process.argv.slice(2)) {
  const m = await sharp(q).metadata(); const qf = await fp(q); const ar = m.width / m.height;
  const best = lib.map((o) => ({ n: o.n, d: o.fp.reduce((s, v, i) => s + Math.abs(v - qf[i]), 0) / 256 + Math.abs(Math.log(o.ar / ar)) * 40 })).sort((a, b) => a.d - b.d);
  console.log(q.split(/[\/]/).pop(), "->", best[0].n, best[0].d.toFixed(1), "| next", best[1].n, best[1].d.toFixed(1));
}
