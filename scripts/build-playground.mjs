// Turns the curated Playground picks into webp files in public/playground/ and prints the list for content/site.js.
// Usage: node scripts/build-playground.mjs  (sources: incoming/playground/)
import sharp from "sharp";
import { mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const P = "incoming/playground/";
const S = P + "social/Social Media Portfolio/";
// [output name, source, alt, trim white margins?]
const picks = [
  ["under25-whats-new", P + "p2/Frame 28 (1) 1.png", "What's new in the Under 25 app"],
  ["hack-2", P + "p2/Screenshot_20240406-164456_Canva 1.png", "Hack 2.0 poster"],
  ["vibesquad-1", S + "VibeSquad (Influencer Marketing Platform)/1.png", "VibeSquad post"],
  ["zomato-gear", P + "p1/Group 28677.png", "Zomato gear", true],
  ["found-red", P + "whatsapp/WhatsApp Image 2026-11-09 at 7.15.00 PM.jpeg", "Found poster"],
  ["interviewgod-1", S + "Interview God (AI & HR Saas)/1.png", "InterviewGod post"],
  ["bode", P + "p2/Bode.png", "Bode magazine"],
  ["treasure-hunt", P + "p2/hashtag_poster_20241019_151152_0000 1.png", "Treasure Hunt poster"],
  ["vidya-1", S + "Vidya (Edtech)/1.png", "Vidya post"],
  ["metvy-1", S + "Metvy (VC and Edtech)/1.png", "Metvy post"],
  ["design-space-hq", P + "hq/design-space.png", "The Design Space website"],
  ["spray-the-word", S + "Miscellaneous /SPRAY the WORD_20240404_064644_0000 1.png", "Spray the Word poster"],
  ["rapidry-1", S + "Rapidry (Laundry & Dry Cleaning)/1.png", "Rapidry post"],
  ["edu-ocean-1", S + "EduOcean (Edtech)/I1.png", "EduOcean story"],
  ["codetrek", P + "p2/Untitled design 1.png", "CodeTrek poster"],
  ["missions-tee", P + "p1/Group 28676.png", "Missions t-shirt", "rail"],
  ["vibesquad-2", S + "VibeSquad (Influencer Marketing Platform)/2.png", "VibeSquad post"],
  ["interviewgod-genz", S + "Interview God (AI & HR Saas)/Carousel 2/Instagram post - 90.png", "InterviewGod post"],
  ["found-green", P + "whatsapp/WhatsApp Image 2026-11-09 at 7.15.01 PM.jpeg", "Found poster"],
  ["verdia-hand", P + "p2/Group 28679.png", "Verdia app", "bottom"],
  ["adarsh", S + "Adarsh Furniture (Home Decor)/3.png", "Adarsh Furniture Christmas post"],
  ["brand-brawl", P + "p2/hashtag_poster_20241020_022350_0000 1.png", "Brand Brawl poster"],
  ["vidya-2", S + "Vidya (Edtech)/2.png", "Vidya post"],
  ["troubleshoot-1", S + "Hashtag (college club)/2.png", "Troubleshoot Ideathon post"],
  ["dashboard-phones", P + "p2/iPhone 15 Pro.png", "Banking app on phones", true],
  ["metvy-4", S + "Metvy (VC and Edtech)/9.png", "Metvy post"],
  ["interviewgod-apple", S + "Interview God (AI & HR Saas)/Carousel 4/416988805.png", "InterviewGod post"],
  ["calling-all", P + "p2/Poster.png", "Calling All Enthusiasts poster"],
  ["vibesquad-3", S + "VibeSquad (Influencer Marketing Platform)/3.png", "VibeSquad post"],
  ["tees", P + "p1/Group 28678.png", "T-shirt designs", "rail"],
  ["headphones", S + "Miscellaneous /Instagram post - 1 (3).png", "Always a listener post"],
  ["nct-hashtag", P + "p2/hashtag_poster 1.png", "NCT Hashtag poster"],
  ["rapidry-2", S + "Rapidry (Laundry & Dry Cleaning)/Carousel Rapidry/Instagram post - 1.png", "Rapidry post"],
  ["interviewgod-2", S + "Interview God (AI & HR Saas)/2.png", "InterviewGod post"],
  ["prayaban", P + "p2/Frame 33 (2) 3.png", "Prayaban website"],
  ["vidya-4", S + "Vidya (Edtech)/4.png", "Vidya post"],
  ["edu-ocean-3", S + "EduOcean (Edtech)/I3.png", "EduOcean story"],
  ["found-cream", P + "whatsapp/WhatsApp Image 2026-11-09 at 7.15.01 PM (1).jpeg", "Found poster"],
  ["laptop", P + "p2/MacBook Air (2022).png", "Fashion store website on a laptop", true],
  ["vibesquad-4", S + "VibeSquad (Influencer Marketing Platform)/4.png", "VibeSquad post"],
  ["troubleshoot-2", S + "Hashtag (college club)/3.png", "Troubleshoot Ideathon post"],
  ["metvy-6", S + "Metvy (VC and Edtech)/6.png", "Metvy post"],
  ["interviewgod-pharma", S + "Interview God (AI & HR Saas)/Carousel 3/Instagram post - 184.png", "InterviewGod post"],
  ["interviewgod-did-you-know", S + "Interview God (AI & HR Saas)/Carousel 1/Instagram post - 73.png", "InterviewGod post"],
];

// remaining carousel slides, mixed across clients so the same client doesn't clump together
const IG = S + "Interview God (AI & HR Saas)/";
const groups = [
  [2, 3, 4, 5, 7, 8, 10].map((n) => ["metvy-" + n + "b", S + "Metvy (VC and Edtech)/" + n + ".png", "Metvy post"]),
  [74, 75, 76, 91, 92, 93, 185, 186, 187].map((n) => ["interviewgod-c" + n, IG + "Carousel " + (n < 90 ? 1 : n < 180 ? 2 : 3) + "/Instagram post - " + n + ".png", "InterviewGod post"])
    .concat([806, 807, 808, 809].map((n) => ["interviewgod-c" + n, IG + "Carousel 4/416988" + n + ".png", "InterviewGod post"]))
    .concat([3, 4].map((n) => ["interviewgod-" + n, IG + n + ".png", "InterviewGod post"])),
  ["C1a", "C1b", "C1c", "C1d", "I2"].map((n) => ["edu-ocean-" + n.toLowerCase(), S + "EduOcean (Edtech)/" + (n[1] === "1" ? "Carousel EDU Ocean  /" : "") + n + ".png", "EduOcean post"]),
  [3, 5, 6].map((n) => ["vidya-" + n, S + "Vidya (Edtech)/" + n + ".png", "Vidya post"]).concat([["vibesquad-5", S + "VibeSquad (Influencer Marketing Platform)/5.png", "VibeSquad post"]]),
  [2, 3, 4].map((n) => ["rapidry-c" + n, S + "Rapidry (Laundry & Dry Cleaning)/Carousel Rapidry/Instagram post - " + n + ".png", "Rapidry post"]).concat([["troubleshoot-0", S + "Hashtag (college club)/1.png", "Troubleshoot Ideathon post"]]),
];
for (let i = 0; groups.some((g) => g.length); i++) { const g = groups[i % groups.length]; if (g.length) picks.push(g.shift()); }

// everything else in the zips (user: "add all"), except exact copies of something already in
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name).split(String.fromCharCode(92)).join("/")]));
const fingerprint = async (src) => sharp(src).flatten({ background: "#fff" }).resize(16, 16, { fit: "fill" }).greyscale().raw().toBuffer();
const prints = [];
for (const p of picks) prints.push({ fp: await fingerprint(p[1]), ar: (await sharp(p[1]).metadata()).width / (await sharp(p[1]).metadata()).height });
const used = new Set(picks.map((p) => p[1]));
// cut-off pieces the user asked to leave out (text/cards sliced at the edges)
const CUT = new Set(["p0/9_20240718_125846_0001.png", "p0/Add a heading_20240625_004157_0000.png", "p2/Frame 33 (2) 2-1.png", "p2/Frame 33 (2) 2.png", "p2/Frame 33 (2) 3-1.png", "p2/Frame 33 (2) 4.png", "p2/image 117-1.png", "p2/image 117.png", "p2/image 118-1.png", "p2/image 118.png",
  // logos: better exports live in logos/ (from logos.zip); the "G" and "g" marks were dropped by the user
  ...["Frame 3", "Group 28646", "width_549 1", "width_500 1", "Screenshot_20250208-210751_Drive 1", "Screenshot_20250208-210800_Drive 1", "Screenshot_20250208-210809_Drive 1", "Screenshot_20250208-210827_Drive 1", "hashtag_1_1_20241013_142347_0000 1", "वस्त्रम् 1"].map((n) => "p0/" + n + ".png")].map((x) => P + x));
const restAll = walk(P).filter((x) => !CUT.has(x) && /.(png|jpe?g|webp)$/i.test(x) && !used.has(x));
const area = async (x) => { const m = await sharp(x).metadata(); return m.width * m.height; };
const sized = await Promise.all(restAll.map(async (x) => [x, await area(x)]));
const rest = sized.sort((a, b) => b[1] - a[1]).map((x) => x[0]); // biggest first, so a full-size copy beats a thumbnail
let k = 0;
for (const src of rest) {
  const m = await sharp(src).metadata();
  const fp = await fingerprint(src);
  const dup = prints.find((o) => Math.abs(o.ar - m.width / m.height) < 0.03 && o.fp.reduce((s, v, i) => s + Math.abs(v - fp[i]), 0) / 256 < 3);
  if (dup) { console.log("skip copy:", src); continue; }
  prints.push({ fp, ar: m.width / m.height });
  ++k; picks.push(["w-" + src.slice(P.length).replace(/.[a-z]+$/i, "").toLowerCase().replace(/[()]/g, "_").replace(/[^a-z0-9_]+/g, "-").replace(/^-|-$/g, ""), src, "Design work"]); // name comes from the source file, so it never changes between runs
}
// spread these through the grid instead of piling them at the end
const base = picks.splice(0, picks.length - k), more = picks.splice(0);
for (let i = 0; i < base.length || more.length; i++) { if (i < base.length) picks.push(base[i]); if (i % 2 === 1 && more.length) picks.push(more.shift()); }

// pieces the user asked to remove from the Playground (by output name)
const DROP = new Set(["w-logos-screenshot_20250208-210827_drive-1","w-p0-under-25-11-_1_","interviewgod-c808","interviewgod-c809","interviewgod-c186","w-p0-add-a-heading-1","w-p0-add-a-heading","w-p0-1_1-adarsh_20241025_214518_0001-1","w-p0-add-a-heading-_1_","w-p0-8_20240718_125846_0000","w-p0-1_1-adarsh_20241121_144035_0000","w-p0-25_20240706_152156_0001","w-p0-1_1-adarsh_20241121_144035_0000-1","w-p0-1_1-adarsh_20241025_214518_0003","w-p0-1_1-adarsh_20241025_214518_0003-1"]);
for (let i = picks.length - 1; i >= 0; i--) if (DROP.has(picks[i][0])) picks.splice(i, 1);

mkdirSync("public/playground", { recursive: true });
const out = [];
for (const [name, src, alt, trim] of picks) {
  let img = sharp(src).flatten({ background: "#ffffff" });
  if (trim) {
    const buf = await img.png().toBuffer();
    img = sharp(buf).trim({ background: "#ffffff", threshold: 12 });
    const t = await img.png().toBuffer();
    const m = await sharp(t).metadata();
    const pad = Math.round(Math.max(m.width, m.height) * 0.08);
    // "rail" = t-shirts hanging on a line: crop to the line's ends so it runs edge to edge (pad top/bottom only)
    const side = trim === "rail" ? 0 : pad;
    // "bottom" = something cut off at the bottom (e.g. a hand holding a phone): no padding below, so it runs off the edge
    img = sharp(t).extend({ top: pad, bottom: trim === "bottom" ? 0 : pad, left: side, right: side, background: "#ffffff" });
  }
  const buf = await img.png().toBuffer();
  const meta = await sharp(buf).metadata();
  const small = Math.max(meta.width, meta.height) < 1000; // tiny originals: upscale properly instead of letting the browser stretch them
  const info = await (small
    ? sharp(buf).resize({ width: 1000, height: 1000, fit: "inside", kernel: "lanczos3" }).sharpen({ sigma: 0.8 })
    : sharp(buf).resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })).webp({ quality: 84 }).toFile(`public/playground/${name}.webp`);
  out.push({ src: `/playground/${name}.webp`, alt, w: info.width, h: info.height, from: src });
  console.log(name, info.width + "x" + info.height);
}
writeFileSync("incoming/playground/list.json", JSON.stringify(out, null, 1));
