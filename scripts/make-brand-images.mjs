// Makes the site icons and the link-preview image from code (no design files needed):
//   app/icon.svg              favicon: the googly eyes
//   app/apple-icon.png        180×180 home-screen icon (eyes on paper)
//   app/opengraph-image.png   1200×630 preview shown when the link is shared (WhatsApp, LinkedIn, X…)
// Run: node scripts/make-brand-images.mjs
import fs from "node:fs";
import sharp from "sharp";

const INK = "#141412", PAPER = "#f1eee9", WHITE = "#ffffff";
const RED = "#e5391f", BLUE = "#1f4fd1", YELLOW = "#f2b705";

// googly eyes (same shapes as components/GooglyEyes.jsx: viewBox 122×72), pupils looking a little down-right
function eyes({ x = 0, y = 0, scale = 1, line = 3.2, look = [3.5, 4] } = {}) {
  const E = [{ cx: 35, cy: 36 }, { cx: 87, cy: 36 }];
  return `<g transform="translate(${x} ${y}) scale(${scale})">${E.map((e) => `
    <ellipse cx="${e.cx}" cy="${e.cy}" rx="25" ry="29" fill="${WHITE}" stroke="${INK}" stroke-width="${line}"/>
    <circle cx="${e.cx + look[0]}" cy="${e.cy + look[1]}" r="10" fill="${INK}"/>
    <circle cx="${e.cx + look[0] - 3.2}" cy="${e.cy + look[1] - 3.4}" r="2.6" fill="${WHITE}" opacity="0.85"/>`).join("")}
  </g>`;
}

// 1) favicon (SVG, scales to any size). Thick outline so it reads at 16px.
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122 122">${eyes({ y: 25, line: 6, look: [3, 3] })}</svg>`;
fs.writeFileSync("app/icon.svg", icon);

// 2) apple icon: eyes on paper, padded
const apple = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="${PAPER}"/>${eyes({ x: 22, y: 52, scale: 1.12, line: 4.5 })}</svg>`;
await sharp(Buffer.from(apple)).png().toFile("app/apple-icon.png");

// 3) Open Graph image: the ABDULLAH lettering + sparkles + eyes on paper, a line about him below
const trace = JSON.parse(fs.readFileSync("content/name-trace.json", "utf8"));
const half = (s) => (s.type === "dot" ? [s.r, s.r] : [s.w / 2, s.h / 2]);
let box = trace.letters.reduce((b, l) => [Math.min(b[0], l.box[0]), Math.min(b[1], l.box[1]), Math.max(b[2], l.box[2]), Math.max(b[3], l.box[3])], [Infinity, Infinity, -Infinity, -Infinity]);
box = trace.sparkles.reduce((b, s) => { const [hw, hh] = half(s); return [Math.min(b[0], s.cx - hw), Math.min(b[1], s.cy - hh), Math.max(b[2], s.cx + hw), Math.max(b[3], s.cy + hh)]; }, box);
const [bx, by, bw, bh] = [box[0], box[1], box[2] - box[0], box[3] - box[1]];
const starPath = (hw, hh) => {
  const n = 0.64, pts = [];
  for (let i = 0; i < 96; i++) {
    const t = (i / 96) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
    pts.push(`${(Math.sign(c) * Math.abs(c) ** (2 / n) * hw).toFixed(1)} ${(Math.sign(s) * Math.abs(s) ** (2 / n) * hh).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
};
const sparkColor = (hex, i) => {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16);
  return g > r * 0.85 ? YELLOW : i % 3 === 0 ? BLUE : RED;
};
const W = 1200, H = 630, markH = 330, scale = markH / bh, markW = bw * scale;
const mx = (W - markW) / 2, my = 92;
const letters = trace.letters.map((l) => `<path transform="translate(${l.x} ${l.y})" d="${l.d}" fill="${INK}" fill-rule="evenodd"/>`).join("");
const sparks = trace.sparkles.map((s, i) => s.type === "dot"
  ? `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${sparkColor(s.color, i)}"/>`
  : `<path transform="translate(${s.cx} ${s.cy})" d="${starPath(s.w / 2, s.h / 2)}" fill="${sparkColor(s.color, i)}"/>`).join("");
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>
  <g transform="translate(${mx} ${my}) scale(${scale}) translate(${-bx} ${-by})">${letters}${sparks}</g>
  ${eyes({ x: mx + markW - 106, y: my - 14, scale: 1.05, line: 3.6 })}
  <text x="${W / 2}" y="${my + markH + 78}" text-anchor="middle" font-family="Inter, 'Segoe UI', Arial, sans-serif" font-size="34" font-weight="500" fill="${INK}">Mohd. Abdullah Meraj · Product &amp; visual designer</text>
  <text x="${W / 2}" y="${my + markH + 122}" text-anchor="middle" font-family="Inter, 'Segoe UI', Arial, sans-serif" font-size="24" fill="#7a756b">UI/UX · branding · graphic design — New Delhi, India</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile("app/opengraph-image.png");
fs.writeFileSync("app/opengraph-image.alt.txt", "ABDULLAH in hand-drawn lettering with sparkles and googly eyes. Mohd. Abdullah Meraj, product and visual designer from New Delhi.");
console.log("wrote app/icon.svg, app/apple-icon.png, app/opengraph-image.png (+ alt text)");
