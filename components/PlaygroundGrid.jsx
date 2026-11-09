"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import GooglyEyes from "./GooglyEyes";
import { playground } from "@/content/site";
import { play } from "@/lib/sound";

/*
  One clean rectangle of work (justified rows): every row runs edge to edge,
  each piece keeps its own proportions, and row heights alternate so the
  sizes vary. The last row is stretched to close off the rectangle.
*/
const GAP = 12;
const HEIGHTS = [320, 270, 350, 290]; // regular row heights (px), cycled — a bit smaller than featured
const LEAD = 0; // featured rows forced to the very top (0 = top is a mix of regular and featured rows)
const BIG_H = 540; // featured rows (items marked big: true) stay clearly the biggest
const LEANS = ["-1.2deg", "0.9deg", "-0.6deg", "1.4deg", "-1deg", "0.6deg"];

// Packs items into rows that each fill the width exactly (justified rows).
// Featured pieces get their own taller rows: one after every two regular rows.
function rowsFor(width, items) {
  const mobile = width < 640;
  const normal = [], big = [];
  items.forEach((it, i) => (it.big && !mobile ? big : normal).push(i));
  const rows = [];
  const fill = (queue, target, tall) => {
    const idx = [];
    let sum = 0;
    if (tall) {
      // featured rows: look a few pieces ahead and add whichever lands nearest the target height
      while (queue.length) {
        const prevH = idx.length ? (width - GAP * (idx.length - 1)) / sum : Infinity;
        let best = 0, bestH = 0, bestCost = 0;
        queue.slice(0, 3).forEach((i, k) => { // only peek a little ahead, so the order in site.js mostly holds
          const h = (width - GAP * idx.length) / (sum + items[i].w / items[i].h);
          // skipping ahead costs a little, so pieces stay close to their place in the list
          const cost = Math.abs(h - target) + k * 120;
          if (k === 0 || cost < bestCost) { best = k; bestH = h; bestCost = cost; }
        });
        if (idx.length && Math.abs(prevH - target) <= Math.abs(bestH - target)) return { idx, h: prevH };
        const [i] = queue.splice(best, 1);
        idx.push(i); sum += items[i].w / items[i].h;
      }
      return { idx, h: (width - GAP * (idx.length - 1)) / sum, last: true };
    }
    while (queue.length) {
      const i = queue[0];
      const ar = items[i].w / items[i].h;
      const prevH = idx.length ? (width - GAP * (idx.length - 1)) / sum : Infinity;
      const h = (width - GAP * idx.length) / (sum + ar);
      // close the row at whichever count lands nearest the target height
      // (featured rows lean taller: they keep fewer pieces if that stays within 30% of the target)
      if (h <= target && idx.length && (tall ? prevH <= target * 1.3 : prevH - target < target - h)) return { idx, h: prevH };
      queue.shift(); idx.push(i); sum += ar;
      if (h <= target) return { idx, h };
    }
    return idx.length ? { idx, h: Math.min(target, (width - GAP * (idx.length - 1)) / sum), last: true } : null;
  };
  // build each kind of row on its own…
  const width0 = (r) => r.idx.reduce((s, i) => s + items[i].w / items[i].h, 0);
  const build = (queue, targetAt, tall) => {
    const out = [];
    while (queue.length) { const r = fill(queue, targetAt(out.length), tall); if (r) out.push(r); }
    // a leftover last row that can't fill the width at a sensible height joins the row before it
    const r = out.at(-1);
    const natural = r && (width - GAP * (r.idx.length - 1)) / width0(r);
    if (out.length > 1 && r.last && natural > targetAt(out.length - 1) * 1.15) {
      const prev = out.at(-2);
      prev.idx.push(...r.idx);
      prev.h = (width - GAP * (prev.idx.length - 1)) / width0(prev);
      out.pop();
    }
    // a leftover featured row that still doesn't fill at a sensible height is capped (crops a little)
    out.forEach((r, k) => { if (r.last) r.h = Math.min(r.h, targetAt(k) * 1.3); });
    return out;
  };
  const normalRows = build(normal, (k) => (mobile ? 170 : HEIGHTS[k % HEIGHTS.length]), false);
  const bigRows = build(big, () => BIG_H, true);
  // …open the grid with the featured pieces (the user's best work), then spread the rest evenly
  rows.push(...bigRows.splice(0, mobile ? 0 : LEAD).map((r) => ({ ...r, big: true })));
  const N = normalRows.length, B = bigRows.length;
  // featured row j goes just before regular row floor(j * N / B): the grid starts with a featured row, then mixes
  normalRows.forEach((r, k) => {
    while (bigRows.length && Math.floor((B - bigRows.length) * N / B) <= k) rows.push({ ...bigRows.shift(), big: true });
    rows.push(r);
  });
  rows.push(...bigRows.map((r) => ({ ...r, big: true })));
  return rows;
}

export default function PlaygroundGrid() {
  const [open, setOpen] = useState(null); // index of the item in the lightbox
  const [width, setWidth] = useState(0); // 0 until measured: rows depend on the real width, so they're only built in the browser
  const gridRef = useRef(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    const measure = () => setWidth(grid.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
  }, []);

  const rows = width ? rowsFor(width, playground) : [];

  const openRef = useRef(null);
  const show = useCallback((i) => {
    // opening pops; stepping between pieces or closing is a small tick
    play(openRef.current === null && i !== null ? "pop" : "tick", 60);
    openRef.current = i;
    setOpen(i);
    if (i === null) history.replaceState(null, "", location.pathname);
    else history.replaceState(null, "", `#view-${i + 1}`);
  }, []);

  // open from a shared link like /archive#view-3
  useEffect(() => {
    const m = location.hash.match(/^#view-(\d+)$/);
    if (m) { openRef.current = Math.min(playground.length, +m[1]) - 1; setOpen(openRef.current); }
  }, []);

  // keyboard: Esc closes, arrows step through
  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") show(null);
      if (e.key === "ArrowRight") show((open + 1) % playground.length);
      if (e.key === "ArrowLeft") show((open - 1 + playground.length) % playground.length);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [open, show]);

  const item = open !== null ? playground[open] : null;

  return (
    <section className="pg" aria-labelledby="pg-title">
      <h1 id="pg-title" className="pg-title reveal" style={{ "--i": 0 }}>
        Bits &amp; piece<span className="pg-perch">s<span className="pg-eyes"><GooglyEyes size={70} /></span></span>
      </h1>

      <div className="pg-grid" ref={gridRef} style={{ "--gap": `${GAP}px` }}>
        {rows.map((r, ri) => (
          <div key={ri} className="pg-row" style={{ height: `${r.h}px` }}>
            {r.idx.map((i) => {
              const it = playground[i];
              return (
                <div key={it.src} className="pg-tile reveal" style={{ flexGrow: Math.round((it.w / it.h) * 1000), "--i": 1 + (ri % 6), "--lean": LEANS[i % LEANS.length] }}>
                  <button onClick={() => show(i)} data-cursor="View" aria-label={`View ${it.alt}`}>
                    <img src={it.src} alt={it.alt} width={it.w} height={it.h} loading={ri < 4 ? "eager" : "lazy"} draggable="false" />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {item && (
        <div className="pg-lightbox" role="dialog" aria-modal="true" aria-label={item.alt} onClick={() => show(null)}>
          <img src={item.src} alt={item.alt} onClick={(e) => e.stopPropagation()} />
          <button className="pg-nav prev" onClick={(e) => { e.stopPropagation(); show((open - 1 + playground.length) % playground.length); }} aria-label="Previous">←</button>
          <button className="pg-nav next" onClick={(e) => { e.stopPropagation(); show((open + 1) % playground.length); }} aria-label="Next">→</button>
          <button className="pg-close" onClick={() => show(null)} aria-label="Close">✕</button>
        </div>
      )}
    </section>
  );
}
