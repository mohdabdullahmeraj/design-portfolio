// Turns brand logo files into one-colour shapes for the "Companies & brands" grid.
// Each pixel's opacity = how much "ink" it has (dark or coloured = solid, white = see-through),
// so white text inside a dark badge becomes a cut-out. Output: black-on-transparent PNG in public/logos/.
// Usage: node scripts/make-logos.mjs   (edit the list below)
import sharp from "sharp";

const D = "incoming/logos-user/";
const list = [
  ["found", D + "found.png"],
  ["across-the-globe", D + "image 2.png"],
  ["edu-ocean", D + "logo 2.png"],
  ["dream-india-network", D + "image 124.png"],
  ["career-saarthi", D + "image 123.png"],
  ["tagsen", D + "image 122.png"],
  ["third-wave-coffee", D + "TWC_logo_without_R-01.png"],
  ["adarsh-furniture", D + "image 120.png"],
  ["under-25", D + "unnamed.png"],
  ["texium", D + "image 57.png"],
  ["interviewgod", D + "Group 28673.png"],
];

for (const [name, src] of list) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < data.length; i += 4) {
    const ink = 255 - Math.min(data[i], data[i + 1], data[i + 2]); // 0 = white, 255 = black/fully coloured
    const a = Math.min(255, Math.max(0, (ink - 25) * 2.4)) * (data[i + 3] / 255);
    out[i + 3] = a; // rgb stays 0 (black); only the shape matters
  }
  const img = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png().toBuffer();
  const t = await sharp(img).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  // upscale small files so the mask edge stays smooth on retina screens
  const scale = Math.max(1, 240 / t.info.height);
  const r = await sharp(t.data).resize({ height: Math.round(t.info.height * scale), kernel: "lanczos3" }).png().toFile(`public/logos/${name}.png`);
  console.log(`${name}\t${r.width}x${r.height}\tratio ${(r.width / r.height).toFixed(3)}`);
}
