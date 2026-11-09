// Traces assets/abdullah.webp into SVG paths.
// Separates cream letters and coloured sparkles from the blue background,
// splits them into individual shapes, and vectorises each one with potrace.
// Output: content/name-trace.json   Run: node scripts/trace-name.mjs
import sharp from "sharp";
import potrace from "potrace";
import { writeFileSync } from "node:fs";

const SRC = "assets/abdullah.webp";
const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const px = (i) => [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];

const isCream = (r, g, b) => r > 175 && g > 160 && b > 120 && r - b < 75;
const isSpark = (r, g, b) => !isCream(r, g, b) && r > 125 && (r - b > 10 || g - b > 40);

function makeMask(test) {
  const m = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) { const [r, g, b] = px(i); if (test(r, g, b)) m[i] = 1; }
  return m;
}
function morph(m, r, dilate) {
  // separable square dilate/erode
  const tmp = new Uint8Array(W * H), out = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = dilate ? 0 : 1;
    for (let k = -r; k <= r; k++) { const xx = x + k; const s = xx < 0 || xx >= W ? 0 : m[y * W + xx]; v = dilate ? v | s : v & s; }
    tmp[y * W + x] = v;
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = dilate ? 0 : 1;
    for (let k = -r; k <= r; k++) { const yy = y + k; const s = yy < 0 || yy >= H ? 0 : tmp[yy * W + x]; v = dilate ? v | s : v & s; }
    out[y * W + x] = v;
  }
  return out;
}
const close = (m, r) => morph(morph(m, r, true), r, false);
const open = (m, r) => morph(morph(m, r, false), r, true);

function components(m, minArea) {
  const lab = new Int32Array(W * H).fill(-1);
  const comps = [];
  const stack = [];
  for (let s = 0; s < W * H; s++) {
    if (!m[s] || lab[s] !== -1) continue;
    const id = comps.length;
    let minX = W, minY = H, maxX = 0, maxY = 0, area = 0, sr = 0, sg = 0, sb = 0;
    const pixels = [];
    stack.push(s); lab[s] = id;
    while (stack.length) {
      const p = stack.pop();
      const x = p % W, y = (p / W) | 0;
      pixels.push(p); area++;
      const [r, g, b] = px(p); sr += r; sg += g; sb += b;
      if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
      for (const q of [p - 1, p + 1, p - W, p + W]) {
        if (q < 0 || q >= W * H) continue;
        if ((q === p - 1 && x === 0) || (q === p + 1 && x === W - 1)) continue;
        if (m[q] && lab[q] === -1) { lab[q] = id; stack.push(q); }
      }
    }
    comps.push({ id, area, minX, minY, maxX, maxY, pixels, color: [sr / area, sg / area, sb / area] });
  }
  return comps.filter((c) => c.area >= minArea);
}

async function traceComp(c, pad = 4) {
  const w = c.maxX - c.minX + 1 + pad * 2, h = c.maxY - c.minY + 1 + pad * 2;
  const buf = Buffer.alloc(w * h, 255);
  for (const p of c.pixels) {
    const x = (p % W) - c.minX + pad, y = ((p / W) | 0) - c.minY + pad;
    buf[y * w + x] = 0;
  }
  const png = await sharp(buf, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
  const tracer = new potrace.Potrace();
  tracer.setParameters({ threshold: 128, turdSize: 6, optCurve: true, optTolerance: 0.35, alphaMax: 1 });
  await new Promise((res, rej) => tracer.loadImage(png, (e) => (e ? rej(e) : res())));
  const tag = tracer.getPathTag();
  const d = /d="([^"]+)"/.exec(tag)[1];
  return { d, x: c.minX - pad, y: c.minY - pad };
}

const hex = ([r, g, b]) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

// Sparkles & dots
const sparkMask = open(close(makeMask(isSpark), 3), 1);
// Letters: fill the mottled texture holes, drop specks.
// Where a sparkle sits on top of a letter, the letter underneath must stay solid:
// add back sparkle pixels that fall inside the letter's (heavily closed) silhouette,
// so letters have no star-shaped cut-outs.
const cream = open(close(makeMask(isCream), 3), 1);

// Round (disk) morphology so filled areas have no blocky corners
function diskMorph(m, r, dilate) {
  const out = new Uint8Array(W * H);
  const offs = [];
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r) offs.push([dx, dy]);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let v = dilate ? 0 : 1;
    for (const [dx, dy] of offs) {
      const xx = x + dx, yy = y + dy;
      const s = xx < 0 || yy < 0 || xx >= W || yy >= H ? 0 : m[yy * W + xx];
      if (dilate ? s : !s) { v = dilate ? 1 : 0; break; }
    }
    out[y * W + x] = v;
  }
  return out;
}
const diskClose = (m, r) => diskMorph(diskMorph(m, r, true), r, false);

/*
  Rebuild the letter under every star.
  For each star: take its footprint (star grown by a few px) as "unknown",
  and the ring of visible pixels around it as "known" (letter or background).
  - If the known ring is split by one straight edge (the usual case for these
    letters), fit that line and extend it under the star.
  - Otherwise (corners, two letters), copy each hidden pixel from the
    nearest visible pixel.
*/
const sparks = components(sparkMask, 60);
const letterMask = cream.slice();
const hiddenAll = new Uint8Array(W * H); // every pixel that sits under a star

/* Edge-model rebuild: fit up to TWO straight edges to the letter boundary visible
   around the star (one edge = straight side, two edges = a corner), then fill
   each hidden pixel with whatever the visible pixels on the same side(s) are. */
function rebuildWithEdges(c) {
  const PAD = 44, GROW = 6, NEAR = 34;
  const x0 = Math.max(0, c.minX - PAD), y0 = Math.max(0, c.minY - PAD);
  const x1 = Math.min(W - 1, c.maxX + PAD), y1 = Math.min(H - 1, c.maxY + PAD);
  const ww = x1 - x0 + 1, wh = y1 - y0 + 1;
  const at = (x, y) => cream[(y + y0) * W + (x + x0)];
  // hidden footprint: star grown so its blended rim is included
  const F = new Uint8Array(ww * wh);
  for (const p of c.pixels) {
    const px0 = (p % W) - x0, py0 = ((p / W) | 0) - y0;
    for (let dy = -GROW; dy <= GROW; dy++) for (let dx = -GROW; dx <= GROW; dx++) {
      const xx = px0 + dx, yy = py0 + dy;
      if (xx >= 0 && yy >= 0 && xx < ww && yy < wh && dx * dx + dy * dy <= GROW * GROW) F[yy * ww + xx] = 1;
    }
  }
  // distance from footprint (to pick the "near ring" used for voting)
  const dist = new Int16Array(ww * wh).fill(-1);
  const q = [];
  for (let i = 0; i < ww * wh; i++) if (F[i]) { dist[i] = 0; q.push(i); }
  for (let h = 0; h < q.length; h++) {
    const i = q[h], x = i % ww, y = (i / ww) | 0;
    if (dist[i] >= NEAR) continue;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= ww || yy >= wh) continue;
      const j = yy * ww + xx;
      if (dist[j] === -1) { dist[j] = dist[i] + 1; q.push(j); }
    }
  }
  let nearCream = 0, nearAll = 0;
  for (let i = 0; i < ww * wh; i++) if (dist[i] > 0) { nearAll++; if (at(i % ww, (i / ww) | 0)) nearCream++; }
  if (nearCream < 15) return "skip"; // star floating on blue
  if (nearCream === nearAll) { for (let i = 0; i < ww * wh; i++) if (F[i]) letterMask[((i / ww) | 0) * W + y0 * W + (i % ww) + x0] = 1; return "inside"; }

  // boundary points of the visible letter (cream next to visible blue)
  const pts = [];
  for (let y = 1; y < wh - 1; y++) for (let x = 1; x < ww - 1; x++) {
    const i = y * ww + x;
    if (F[i] || !at(x, y) || dist[i] < 1 || dist[i] > NEAR) continue; // only edges right next to the star
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const j = (y + dy) * ww + (x + dx);
      if (!F[j] && !at(x + dx, y + dy)) { pts.push([x, y]); break; }
    }
  }
  // seeded RANSAC line fit + PCA refinement
  let seed = c.minX * 7919 + c.minY;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  function fitLine(points) {
    if (points.length < 10) return null;
    let best = null, bestIn = [];
    for (let it = 0; it < 400; it++) {
      const a = points[(rnd() * points.length) | 0], b = points[(rnd() * points.length) | 0];
      const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
      if (len < 8) continue;
      const nx = -dy / len, ny = dx / len, d = nx * a[0] + ny * a[1];
      const inl = points.filter((p) => Math.abs(nx * p[0] + ny * p[1] - d) < 1.8);
      if (inl.length > bestIn.length) { bestIn = inl; best = { nx, ny, d }; }
    }
    if (!best || bestIn.length < 10) return null;
    // PCA refine on inliers
    const mx = bestIn.reduce((s, p) => s + p[0], 0) / bestIn.length, my = bestIn.reduce((s, p) => s + p[1], 0) / bestIn.length;
    let sxx = 0, sxy = 0, syy = 0;
    for (const [x, y] of bestIn) { sxx += (x - mx) ** 2; sxy += (x - mx) * (y - my); syy += (y - my) ** 2; }
    const ang = 0.5 * Math.atan2(2 * sxy, sxx - syy); // direction of the line
    const nx = -Math.sin(ang), ny = Math.cos(ang);
    return { nx, ny, d: nx * mx + ny * my, inliers: bestIn };
  }
  const lines = [];
  const l1 = fitLine(pts);
  if (l1) {
    lines.push(l1);
    const rest = pts.filter((p) => Math.abs(l1.nx * p[0] + l1.ny * p[1] - l1.d) > 3);
    const l2 = fitLine(rest);
    if (l2) {
      const cos = Math.abs(l1.nx * l2.nx + l1.ny * l2.ny);
      if (cos < 0.94 || l2.inliers.length >= 12) { // a new direction, or a parallel edge further away (e.g. the other side of a narrow gap)
        lines.push(l2); // only a real second direction (≈ >20°)
        // a third edge (e.g. a gap between two letters meeting a base line)
        const rest2 = rest.filter((p) => Math.abs(l2.nx * p[0] + l2.ny * p[1] - l2.d) > 3);
        const l3 = fitLine(rest2);
        if (l3 && l3.inliers.length >= 14) {
          lines.push(l3);
          const rest3 = rest2.filter((p) => Math.abs(l3.nx * p[0] + l3.ny * p[1] - l3.d) > 3);
          const l4 = fitLine(rest3);
          if (l4 && l4.inliers.length >= 14) {
            lines.push(l4);
            const l5 = fitLine(rest3.filter((p) => Math.abs(l4.nx * p[0] + l4.ny * p[1] - l4.d) > 3));
            if (l5 && l5.inliers.length >= 14) lines.push(l5);
          }
        }
      }
    }
  }
  globalThis.__lines = lines.map((l) => l.inliers.length + "pts@" + Math.round(Math.atan2(l.ny, l.nx) * 180 / Math.PI) + "°").join(" ") + " (boundary pts " + pts.length + ")";
  if (!lines.length) return "none";
  const key = (x, y) => lines.map((l) => (l.nx * x + l.ny * y - l.d > 0 ? 1 : 0)).join("");
  // vote per region using the near ring only
  const votes = {};
  for (let i = 0; i < ww * wh; i++) {
    if (dist[i] <= 0) continue;
    const x = i % ww, y = (i / ww) | 0, k = key(x, y);
    votes[k] ??= [0, 0];
    votes[k][at(x, y) ? 1 : 0]++;
  }
  for (let i = 0; i < ww * wh; i++) {
    if (!F[i]) continue;
    const x = i % ww, y = (i / ww) | 0;
    const v = votes[key(x, y)];
    const val = v ? (v[1] > v[0] ? 1 : 0) : 0;
    letterMask[(y + y0) * W + (x + x0)] = val;
    hiddenAll[(y + y0) * W + (x + x0)] = 1;
  }
  return ["", "edge", "corner", "3-edge", "4-edge", "5-edge"][lines.length];
}
const stats = {};
for (const c of sparks) { const r = rebuildWithEdges(c); stats[r] = (stats[r] || 0) + 1; if (r !== "skip") console.log("  star at", Math.round((c.minX + c.maxX) / 2), Math.round((c.minY + c.maxY) / 2), "->", r, globalThis.__lines || ""); }
console.log("rebuilt under stars:", JSON.stringify(stats));
// Smooth only the rebuilt (hidden) pixels: removes tiny dents/stubs where edge lines cross.
{
  const sm = open(close(letterMask, 3), 2);
  for (let i = 0; i < W * H; i++) if (hiddenAll[i]) letterMask[i] = sm[i];
}

const OLD_METHOD = false;
const PAD = 14, GROW = 4;
let lineFits = 0, nearestFits = 0;
for (const c of OLD_METHOD ? sparks : []) {
  const x0 = Math.max(0, c.minX - PAD), y0 = Math.max(0, c.minY - PAD);
  const x1 = Math.min(W - 1, c.maxX + PAD), y1 = Math.min(H - 1, c.maxY + PAD);
  const ww = x1 - x0 + 1, wh = y1 - y0 + 1;
  const F = new Uint8Array(ww * wh);
  for (const p of c.pixels) {
    const px0 = (p % W) - x0, py0 = ((p / W) | 0) - y0;
    for (let dy = -GROW; dy <= GROW; dy++) for (let dx = -GROW; dx <= GROW; dx++) {
      const xx = px0 + dx, yy = py0 + dy;
      if (xx >= 0 && yy >= 0 && xx < ww && yy < wh && dx * dx + dy * dy <= GROW * GROW) F[yy * ww + xx] = 1;
    }
  }
  // known ring
  const kx = [], ky = [], kl = [];
  let pos = 0;
  for (let y = 0; y < wh; y++) for (let x = 0; x < ww; x++) {
    if (F[y * ww + x]) continue;
    const v = cream[(y + y0) * W + (x + x0)] ? 1 : -1;
    kx.push(x - ww / 2); ky.push(y - wh / 2); kl.push(v);
    if (v > 0) pos++;
  }
  if (pos < 15) continue; // star floating on the background: nothing to rebuild
  const n = kl.length;
  let fill;
  if (pos === n) {
    fill = () => 1; // star fully inside a letter
  } else {
    // least-squares fit: label ≈ a·x + b·y + c
    let sxx = 0, sxy = 0, syy = 0, sx = 0, sy = 0, sxl = 0, syl = 0, sl = 0;
    for (let i = 0; i < n; i++) {
      const x = kx[i], y = ky[i], l = kl[i];
      sxx += x * x; sxy += x * y; syy += y * y; sx += x; sy += y; sxl += x * l; syl += y * l; sl += l;
    }
    const M = [[sxx, sxy, sx], [sxy, syy, sy], [sx, sy, n]], v = [sxl, syl, sl];
    const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    const D = det(M);
    const col = (k) => M.map((row, r) => row.map((val, j) => (j === k ? v[r] : val)));
    const [a, b, cc] = [det(col(0)) / D, det(col(1)) / D, det(col(2)) / D];
    let ok = 0;
    for (let i = 0; i < n; i++) if ((a * kx[i] + b * ky[i] + cc > 0 ? 1 : -1) === kl[i]) ok++;
    if (ok / n >= 0.92) {
      lineFits++;
      fill = (x, y) => (a * (x - ww / 2) + b * (y - wh / 2) + cc > 0 ? 1 : 0);
    } else {
      // nearest visible pixel: multi-source BFS from the ring into the footprint
      nearestFits++;
      const lab = new Int8Array(ww * wh);
      const q = [];
      for (let y = 0; y < wh; y++) for (let x = 0; x < ww; x++) {
        const i = y * ww + x;
        if (!F[i]) { lab[i] = cream[(y + y0) * W + (x + x0)] ? 1 : -1; q.push(i); }
      }
      for (let h = 0; h < q.length; h++) {
        const i = q[h], x = i % ww, y = (i / ww) | 0;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
          const xx = x + dx, yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= ww || yy >= wh) continue;
          const j = yy * ww + xx;
          if (!lab[j]) { lab[j] = lab[i]; q.push(j); }
        }
      }
      fill = (x, y) => (lab[y * ww + x] > 0 ? 1 : 0);
    }
  }
  for (let y = 0; y < wh; y++) for (let x = 0; x < ww; x++) {
    if (F[y * ww + x]) letterMask[(y + y0) * W + (x + x0)] = fill(x, y);
  }
}
console.log(`rebuilt under stars: ${lineFits} straight-edge, ${nearestFits} nearest-pixel`);
const letters = components(open(close(letterMask, 2), 2), 2500).sort((a, b) => a.minX - b.minX);

console.log("letters:", letters.map((c) => `${c.minX}-${c.maxX} (${c.area})`).join(" | "));
console.log("sparkles:", sparks.length);

const out = { width: W, height: H, letters: [], sparkles: [] };
for (const c of letters) out.letters.push({ ...(await traceComp(c)), box: [c.minX, c.minY, c.maxX, c.maxY] });
// Which letter (if any) each sparkle sits on — those must appear with their letter
const owner = new Int16Array(W * H).fill(-1);
letters.forEach((c, li) => { for (const p of c.pixels) owner[p] = li; });
/*
  Stars are all the same simple shape (4-point, curved sides), so instead of keeping
  their messy traced outlines we measure each one — centre, width, height, colour —
  and the component draws a clean star there. Round dots become circles, two
  overlapping stars of different colours are split, and tiny fragments are dropped.
*/
const isYellow = (p) => { const [r, g] = px(p); return g > r * 0.85; };
function measure(pixels) {
  let minX = W, minY = H, maxX = 0, maxY = 0, sr = 0, sg = 0, sb = 0;
  for (const p of pixels) {
    const x = p % W, y = (p / W) | 0;
    if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
    const [r, g, b] = px(p); sr += r; sg += g; sb += b;
  }
  const n = pixels.length;
  return { minX, minY, maxX, maxY, w: maxX - minX + 1, h: maxY - minY + 1, area: n, color: [sr / n, sg / n, sb / n] };
}
function onLetterOf(pixels) {
  const counts = {};
  let near = 0;
  for (const p of pixels) {
    for (const q of [p, p - 3, p + 3, p - 3 * W, p + 3 * W]) {
      if (q >= 0 && q < W * H && owner[q] >= 0) { counts[owner[q]] = (counts[owner[q]] || 0) + 1; near++; break; }
    }
  }
  const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return near / pixels.length > 0.08 ? Number(best[0]) : -1;
}
const report = [];
for (const c of sparks) {
  // split two overlapping stars of different colours
  const yel = c.pixels.filter(isYellow), oth = c.pixels.filter((p) => !isYellow(p));
  const parts = yel.length > c.area * 0.08 && oth.length > c.area * 0.08 && yel.length > 60 && oth.length > 60 ? [oth, yel] : [c.pixels];
  const major = measure(parts[0]);
  parts.forEach((pixels, k) => {
    const m = k === 0 ? major : measure(pixels);
    const size = Math.max(m.w, m.h);
    const fill = m.area / (m.w * m.h);
    const onLetter = onLetterOf(pixels);
    let item;
    if (size < 12) { report.push(`drop ${size}px`); return; }
    if (size < 30 || (fill > 0.55 && size < 40)) {
      item = { type: "dot", cx: (m.minX + m.maxX) / 2, cy: (m.minY + m.maxY) / 2, r: (m.w + m.h) / 4 };
    } else if (k === 1) {
      // the star behind: only its tip shows, so mirror the visible tip about the front star's centre
      const h = Math.max(m.h, 2 * (major.minY + major.h / 2 - m.minY));
      item = { type: "star", cx: (m.minX + m.maxX) / 2, cy: m.minY + h / 2, w: Math.max(m.w * 1.6, h * 0.62), h, behind: true };
    } else {
      item = { type: "star", cx: (m.minX + m.maxX) / 2, cy: (m.minY + m.maxY) / 2, w: m.w, h: m.h };
    }
    item.color = hex(m.color);
    item.onLetter = onLetter;
    item.size = size;
    out.sparkles.push(item);
    report.push(`${item.type}${item.behind ? "(behind)" : ""} ${Math.round(item.cx)},${Math.round(item.cy)} ${size}px fill ${fill.toFixed(2)}`);
  });
}
console.log("sparkles:\n  " + report.join("\n  "));
console.log("sparkles on letters:", out.sparkles.filter((s) => s.onLetter >= 0).map((s) => s.onLetter).join(","));
writeFileSync("content/name-trace.json", JSON.stringify(out));
console.log("wrote content/name-trace.json");
