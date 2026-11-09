"use client";
import { useEffect, useRef, useState } from "react";
import { play } from "@/lib/sound";

/*
  Googly eyes that watch the visitor.
  - pupils follow the cursor anywhere on the page (eased, not snapping)
  - random blinks every few seconds
  - click / tap: they go dizzy and spin for a moment
  - touch devices: they look around on their own
  - reduced motion: they stay still, looking ahead
*/
const EYES = [
  { cx: 35, cy: 36, rx: 25, ry: 29 },
  { cx: 87, cy: 36, rx: 25, ry: 29 },
];
const PUPIL_R = 10;

export default function GooglyEyes({ size = 96, interactive = true, className = "" }) {
  const svgRef = useRef(null);
  const pupils = useRef([]);
  const [blink, setBlink] = useState(false);
  const dizzy = useRef(0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    let target = null; // screen point the eyes look at
    const cur = EYES.map((e) => ({ x: e.cx, y: e.cy }));
    let raf = 0, wander = 0;

    const onMove = (e) => { target = { x: e.clientX, y: e.clientY }; };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    else {
      // no cursor: glance somewhere new every couple of seconds
      const glance = () => {
        const r = svg.getBoundingClientRect();
        target = { x: r.left + r.width / 2 + (Math.random() - 0.5) * 600, y: r.top + r.height / 2 + (Math.random() - 0.5) * 400 };
      };
      glance();
      wander = setInterval(glance, 2200);
    }

    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      const r = svg.getBoundingClientRect();
      if (!r.width) return;
      const sx = r.width / 122, sy = r.height / 72; // viewBox → screen
      EYES.forEach((eye, i) => {
        let gx = eye.cx, gy = eye.cy;
        const maxX = eye.rx - PUPIL_R - 3, maxY = eye.ry - PUPIL_R - 3;
        if (dizzy.current > t) {
          // dizzy: pupils race round the rim (opposite directions)
          const a = t / 90 * (i ? -1 : 1);
          gx = eye.cx + Math.cos(a) * maxX;
          gy = eye.cy + Math.sin(a) * maxY;
        } else if (target) {
          const ex = r.left + eye.cx * sx, ey = r.top + eye.cy * sy;
          const dx = target.x - ex, dy = target.y - ey;
          const dist = Math.hypot(dx, dy);
          const reach = Math.min(1, dist / 220); // looks further the further away you are
          const a = Math.atan2(dy, dx);
          gx = eye.cx + Math.cos(a) * maxX * reach;
          gy = eye.cy + Math.sin(a) * maxY * reach;
        }
        const ease = dizzy.current > t ? 0.5 : 0.18;
        cur[i].x += (gx - cur[i].x) * ease;
        cur[i].y += (gy - cur[i].y) * ease;
        const p = pupils.current[i];
        if (p) p.setAttribute("transform", `translate(${cur[i].x.toFixed(2)} ${cur[i].y.toFixed(2)})`);
      });
    };
    raf = requestAnimationFrame(tick);

    // random blinks
    let blinkT;
    const scheduleBlink = () => {
      blinkT = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        scheduleBlink();
      }, 2200 + Math.random() * 4000);
    };
    scheduleBlink();

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(wander);
      clearTimeout(blinkT);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const poke = () => {
    if (!interactive) return;
    dizzy.current = performance.now() + 1100;
    play("pop");
  };

  return (
    <svg
      ref={svgRef}
      className={`googly ${blink ? "blink" : ""} ${className}`}
      viewBox="0 0 122 72"
      width={size}
      height={(size * 72) / 122}
      onClick={poke}
      role={interactive ? "button" : "img"}
      aria-label={interactive ? "Googly eyes — click to make them dizzy" : "Googly eyes"}
      data-cursor={interactive ? "Poke" : undefined}
    >
      {EYES.map((e, i) => (
        <g key={i} className="googly-eye">
          <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} className="googly-white" />
          <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} className="googly-line" />
          <g ref={(el) => (pupils.current[i] = el)} transform={`translate(${e.cx} ${e.cy})`}>
            <circle r={PUPIL_R} className="googly-pupil" />
            <circle cx={-3.2} cy={-3.4} r={2.6} className="googly-shine" />
          </g>
        </g>
      ))}
    </svg>
  );
}
