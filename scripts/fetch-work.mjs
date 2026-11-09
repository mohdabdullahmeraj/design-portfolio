// Saves project images into public/work/<slug>/ as optimised webp.
// Sources: Behance CDN URLs (the user's own projects) or local files (Figma exports).
// Usage: node scripts/fetch-work.mjs <figmaRawDir>
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const be = (id) => `https://mir-s3-cdn-cf.behance.net/project_modules/fs_webp/${id}.png`;
const raw = process.argv[2];

// [slug, outName, source, options]
const jobs = [
  // Under 25 (Figma exports)
  ["under-25", "s-onboarding", join(raw, "s-onboarding.png"), { w: 828 }],
  ["under-25", "s-home", join(raw, "s-home-1.png"), { w: 828 }],
  ["under-25", "s-home-old", join(raw, "s-home-old.png"), { w: 768 }],
  ["under-25", "s-opp-2", join(raw, "s-opp-2.png"), { w: 828 }],
  ["under-25", "s-opp-3", join(raw, "s-opp-3.png"), { w: 828 }],
  ["under-25", "s-opp-old", join(raw, "s-opp-old.png"), { w: 768 }],
  ["under-25", "s-mission", join(raw, "s-mission.png"), { w: 828 }],
  ["under-25", "web", be("4ee786234016403.68baac742ab96"), {}],
  ["under-25", "poster", be("03e225234016403.68baac7434979"), {}],
  // XPulse (from the portfolio deck until Figma exports are available)
  ["xpulse", "cover", be("4da742234016403.68baac742dc02"), {}],
  // Plantry
  ["plantry", "hero", be("e2c68c236049735.68e4106821717"), {}],
  ["plantry", "logo", be("ba5946236049735.68e410681b4e5"), {}],
  ["plantry", "type", be("80d484236049735.68e410681e657"), {}],
  ["plantry", "pack-1", be("2d5214236049735.68e410681f43a"), {}],
  ["plantry", "pack-2", be("6db93b236049735.68e4106821ec3"), {}],
  ["plantry", "cover", be("2ec1d4236049735.68e4106822bd0"), {}],
  ["plantry", "web-1", be("9141e6236049735.68e41068201ad"), {}],
  ["plantry", "web-2", be("09d3f0236049735.68e410681faa1"), {}],
  // Brew & Chill
  ["brew-and-chill", "logo", be("b00712236867353.68f514475e488"), {}],
  ["brew-and-chill", "type", be("62656f236867353.68f514475f2a0"), {}],
  ["brew-and-chill", "site", be("dba7bf236867353.68f514475eba7"), { w: 1400, tall: true }],
  ["brew-and-chill", "cover", be("dba7bf236867353.68f514475eba7"), { coverTop: true }],
  // Troubleshoot Ideathon
  ["troubleshoot", "title", be("0d60fc234042077.68bb0eb019c13"), {}],
  ["troubleshoot", "type", be("577e98234042077.68bb0eb01d994"), {}],
  ["troubleshoot", "cover", be("5bfe6d234042077.68bb0eb01a3ef"), {}],
  ["troubleshoot", "signage", be("442ddc234042077.68bb0eb01b950"), {}],
  ["troubleshoot", "id-cards", be("9d8d66234042077.68bb0eb01ce43"), {}],
  ["troubleshoot", "certificates", be("5b2fb3234042077.68bb0eb01d446"), {}],
];

for (const [slug, name, src, o] of jobs) {
  mkdirSync(join("public/work", slug), { recursive: true });
  const input = src.startsWith("http") ? Buffer.from(await (await fetch(src)).arrayBuffer()) : src;
  let img = sharp(input);
  if (o.coverTop) {
    // 3:2 crop from the top of a tall page design
    const m = await sharp(input).metadata();
    img = img.extract({ left: 0, top: 0, width: m.width, height: Math.round(m.width / 1.5) });
  }
  img = img.resize(o.w || 1800, null, { withoutEnlargement: true });
  const info = await img.webp({ quality: o.tall ? 80 : 84 }).toFile(join("public/work", slug, name + ".webp"));
  console.log(`${slug}/${name}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}
