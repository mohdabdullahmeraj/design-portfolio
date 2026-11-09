"use client";
import { useEffect, useRef } from "react";
import trace from "@/content/name-trace.json";

/*
  "ABDULLAH" traced from your lettering image (assets/abdullah.webp)
  by scripts/trace-name.mjs. Letters are real SVG paths taken from the image's
  pixels. Stars/dots are measured from the image (centre, size, colour) and drawn
  here as clean shapes. Re-run the script if the image changes.

  <NameMark />                 site colours (ink letters, red/yellow/blue sparkles)
  <NameMark variant="original"/> the original blue artwork colours
*/

// A clean 4-point sparkle: the curve |x|^n + |y|^n = 1 with n = 0.64
// gives the pinched, concave sides of the stars in the artwork.
// Built at real size (half-width hw, half-height hh) so the speckle texture stays fine.
function starPath(hw, hh) {
  const n = 0.64, steps = 24, pts = [];
  for (let q = 0; q < 4; q++) {
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * (Math.PI / 2);
      const x = Math.pow(Math.cos(t), 2 / n), y = Math.pow(Math.sin(t), 2 / n);
      const [sx, sy] = [[1, -1], [-1, -1], [-1, 1], [1, 1]][q];
      // walk each quadrant in order so the outline is continuous
      const [px, py] = q % 2 === 0 ? [x, y] : [y, x];
      pts.push([(sx * px * hw).toFixed(1), (sy * py * hh).toFixed(1)]);
    }
  }
  return "M" + pts.map((p) => p.join(" ")).join("L") + "Z";
}

// Tight frames around the artwork (in image pixels)
const pad = 6;
const lettersBox = trace.letters.reduce(
  (b, l) => [Math.min(b[0], l.box[0]), Math.min(b[1], l.box[1]), Math.max(b[2], l.box[2]), Math.max(b[3], l.box[3])],
  [Infinity, Infinity, -Infinity, -Infinity]
);
const half = (s) => (s.type === "dot" ? [s.r, s.r] : [s.w / 2, s.h / 2]);
const allBox = trace.sparkles.reduce((b, s) => {
  const [hw, hh] = half(s);
  return [Math.min(b[0], s.cx - hw), Math.min(b[1], s.cy - hh), Math.max(b[2], s.cx + hw), Math.max(b[3], s.cy + hh)];
}, lettersBox);
const vb = (b) => [b[0] - pad, b[1] - pad, b[2] - b[0] + pad * 2, b[3] - b[1] + pad * 2];
export const NAME_VIEWBOX = { letters: vb(lettersBox), all: vb(allBox) };

// Map the artwork's sparkle colours onto the site palette
function siteColor(hex, i) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16);
  if (g > r * 0.85) return "var(--spark-yellow)"; // the lime ones
  return i % 3 === 0 ? "var(--accent-blue)" : "var(--accent-red)"; // pinks/reds
}

export function MarkFilters() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <radialGradient id="nm-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#2f72c6" />
          <stop offset="0.55" stopColor="#2d55d2" />
          <stop offset="1" stopColor="#2b2fdc" stopOpacity="0" />
        </radialGradient>
        <filter id="nm-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="4" result="fine" />
          <feColorMatrix in="fine" values="0 0 0 0 0.05  0 0 0 0 0.05  0 0 0 0 0.35  0 0 0 1.4 -0.55" result="a" />
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" seed="9" result="blot" />
          <feColorMatrix in="blot" values="0 0 0 0 0.05  0 0 0 0 0.05  0 0 0 0 0.3  0 0 0 0.9 -0.42" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="a" /></feMerge>
        </filter>
        {/* original: mottled cream paper inside the letters */}
        <filter id="nm-paper" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" seed="12" result="mottle" />
          <feColorMatrix in="mottle" values="0 0 0 0 0.66  0 0 0 0 0.56  0 0 0 0 0.4  0 0 0 1.3 -0.55" result="mt" />
          <feComposite in="mt" in2="SourceGraphic" operator="in" result="spots" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="spots" /></feMerge>
        </filter>
        {/* site: printed-ink look — tiny paper-coloured specks show through the ink */}
        <filter id="nm-ink" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="12" result="n" />
          <feColorMatrix in="n" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 3 -1.75" result="mask" />
          <feFlood className="nm-flood-paper" result="paper" />
          <feComposite in="paper" in2="mask" operator="in" result="specks" />
          <feComposite in="specks" in2="SourceGraphic" operator="in" result="specks2" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="specks2" /></feMerge>
        </filter>
        {/* lighter speckles over the sparkles */}
        <filter id="nm-speckle" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="21" result="n" />
          <feColorMatrix in="n" values="0 0 0 0 1  0 0 0 0 0.92  0 0 0 0 0.8  0 0 0 2.2 -1.15" result="spk" />
          <feComposite in="spk" in2="SourceGraphic" operator="in" result="spk2" />
          <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="spk2" /></feMerge>
        </filter>
      </defs>
    </svg>
  );
}

export function NameMark({
  variant = "site",
  sparkles = true,
  animate = true,
  playKey = 0,
  width,
  height,
  className = "",
  ...rest
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (!animate) return;
    const el = ref.current;
    if (!el) return;
    el.classList.remove("go");
    void el.getBoundingClientRect();
    el.classList.add("go");
  }, [playKey, animate]);

  const original = variant === "original";
  const box = original ? [0, 0, trace.width, trace.height] : sparkles ? NAME_VIEWBOX.all : NAME_VIEWBOX.letters;
  const ink = original ? "#efe3c8" : "var(--ink)";
  const letterFilter = original ? "url(#nm-paper)" : "url(#nm-ink)";

  return (
    <svg
      ref={ref}
      className={`nm ${animate ? "" : "still"} ${className}`}
      viewBox={box.join(" ")}
      width={width}
      height={height}
      role="img"
      aria-label="Abdullah"
      {...rest}
    >
      {original && (
        <g>
          <rect width={trace.width} height={trace.height} fill="#2b2fdc" />
          <ellipse cx="690" cy="640" rx="560" ry="380" fill="url(#nm-glow)" transform="rotate(-14 690 640)" />
          <rect width={trace.width} height={trace.height} fill="#000" filter="url(#nm-grain)" />
        </g>
      )}
      {/* position lives on the <g>; the animation runs on the inner <path> */}
      <g className="nm-letters">
        {trace.letters.map((l, i) => (
          <g key={i} transform={`translate(${l.x} ${l.y})`}>
            <path className="nm-l" d={l.d} fill={ink} fillRule="evenodd" filter={letterFilter} style={{ "--d": i }} />
          </g>
        ))}
      </g>
      {/* Stars sitting on a letter arrive with that letter and never shrink,
          so the letter edge underneath is always covered. */}
      {sparkles && (
        <g className="nm-sparkles">
          {/* stars that sit behind another star are drawn first */}
          {[...trace.sparkles].map((s, i) => ({ s, i })).sort((a, b) => (b.s.behind ? 1 : 0) - (a.s.behind ? 1 : 0)).map(({ s, i }) => {
            const fill = original ? s.color : siteColor(s.color, i);
            const cls = s.onLetter >= 0 ? "nm-spark-on" : s.type === "dot" ? "nm-dot" : "nm-spark";
            const style = { "--d": s.onLetter >= 0 ? s.onLetter : i };
            return (
              <g key={"s" + i} transform={`translate(${s.cx} ${s.cy})`}>
                {s.type === "dot" ? (
                  <circle className={cls} r={s.r} fill={fill} filter="url(#nm-speckle)" style={style} />
                ) : (
                  <path className={cls} d={starPath(s.w / 2, s.h / 2)} fill={fill} filter="url(#nm-speckle)" style={style} />
                )}
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
