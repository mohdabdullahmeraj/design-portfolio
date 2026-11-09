// Crops exported Figma presentation boards down to their screens (drops the long text
// panel) and saves web-ready images.
// Usage: node scripts/crop-boards.mjs <rawDir> <outDir> <boards.json>
// boards.json: [{ "file": "home", "W": 6842, "textX": 3744, "top": 640, "bottom": 1880 }, ...]
//   W = board width in Figma units, textX = where the text panel starts,
//   top/bottom = vertical range to keep (Figma units). Optional { "cover": "cover" } entry
//   just resizes that file to 1800px wide.
import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const [rawDir, outDir, boardsFile] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
for (const b of JSON.parse(readFileSync(boardsFile, "utf8"))) {
  const src = join(rawDir, (b.cover || b.file) + ".png");
  if (b.cover) {
    const c = await sharp(src).resize(1800).webp({ quality: 84 }).toFile(join(outDir, b.cover + ".webp"));
    console.log(b.cover, `${c.width}x${c.height}`, Math.round(c.size / 1024) + "KB");
    continue;
  }
  const m = await sharp(src).metadata();
  const s = m.width / b.W;
  const left = Math.round(120 * s), right = Math.round((b.textX - 140) * s);
  const top = Math.round(b.top * s), bottom = Math.min(m.height, Math.round((b.bottom + 110) * s));
  const info = await sharp(src)
    .extract({ left, top, width: right - left, height: bottom - top })
    .webp({ quality: 86 })
    .toFile(join(outDir, b.file + ".webp"));
  console.log(b.file, `${info.width}x${info.height}`, Math.round(info.size / 1024) + "KB");
}
